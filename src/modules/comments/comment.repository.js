import { pool } from "../../config/db.js";
import { logger, ApiError } from "../../shared/utils/index.js";

const createCommentQuery = `
    INSERT INTO  comments(post_id, user_id, parent_id, content)
    VALUES($1, $2, $3, $4)
    RETURNING id, post_id, user_id, parent_id, content, created_at
`;

const getAllCommentsQuery = `
  WITH RECURSIVE comment_tree AS (
  SELECT id, post_id, content, parent_id, user_id, created_at, 
         0 AS depth,
         ARRAY[created_at] AS path
  FROM comments
  WHERE post_id = $1 AND parent_id IS NULL

  UNION ALL

  SELECT c.id, c.post_id, c.content, c.parent_id, c.user_id, c.created_at,
         comment_tree.depth + 1,
         comment_tree.path || ARRAY[c.created_at]
  FROM comments c
  INNER JOIN comment_tree ON comment_tree.id = c.parent_id
)

  SELECT id, post_id, content, parent_id, user_id, created_at, depth
  FROM comment_tree
  ORDER BY path
  LIMIT $2 OFFSET $3
`;
export const CommentRepository = {
  createComment: async (data) => {
    const { postId, userId, parentId, content } = data;
    try {
      const result = await pool.query(createCommentQuery, [
        postId,
        userId,
        parentId || null,
        content,
      ]);
      return result.rows[0];
    } catch (error) {
      logger.error("Error creating comment", error);

      if (error.code === "23503") {
        throw new ApiError(404, "Referenced resource does not exist");
      }

      if (error.code === "23502") {
        throw new ApiError(400, "Required fields cannot be empty");
      }

      if (error.code === "22P02") {
        throw new ApiError(400, "Invalid ID format provided");
      }

      throw new ApiError(
        500,
        "Database operation failed while creating comment",
      );
    }
  },

  getAllComments: async (data) => {
    const { postId, limit, offset } = data;

    try {
      const result = await pool.query(getAllCommentsQuery, [
        postId,
        limit,
        offset,
      ]);
      return result.rows;
    } catch (error) {
      if (error instanceof ApiError) throw error;

      logger.error(`Error fetching comments of post ${postId}`, error);

      if (error.code === "23502") {
        throw new ApiError(400, "Required fields cannot be empty");
      }

      if (error.code === "23503") {
        throw new ApiError(400, "Referenced resource does not exist");
      }

      if (error.code === "22P02") {
        throw new ApiError(400, "Invalid value provided");
      }

      throw new ApiError(
        500,
        "Database operation failed while fetching comments",
      );
    }
  },
};
