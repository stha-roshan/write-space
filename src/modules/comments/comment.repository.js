import { pool } from "../../config/db.js";
import { logger, ApiError } from "../../shared/utils/index.js";

const createCommentQuery = `
    INSERT INTO  comments(post_id, user_id, parent_id, content)
    VALUES($1, $2, $3, $4)
    RETURNING id, post_id, user_id, parent_id, content, created_at
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
};
