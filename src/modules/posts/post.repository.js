import { pool } from "../../config/db.js";
import { ApiError, logger } from "../../shared/utils/index.js";

const createPostQuery = `
    INSERT INTO posts(user_id, title, content)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, title, content, created_at
`;

const getAllPostsQuery = `
  SELECT id, user_id, title, content, created_at, updated_at
  FROM posts
  ORDER BY created_at DESC
  LIMIT $1 OFFSET $2
`;

export const PostRepository = {
  createPost: async (data) => {
    const { userId, title, content } = data;
    try {
      const result = await pool.query(createPostQuery, [
        userId,
        title,
        content,
      ]);
      return result.rows[0];
    } catch (error) {
      logger.error("Error creating post", error);
      throw new ApiError(500, "Database operation failed while creating post");
    }
  },

  getAllPosts: async (data) => {
    const { offset, limit } = data;

    try {
      const result = await pool.query(getAllPostsQuery, [limit, offset]);
      return result.rows;
    } catch (error) {
      logger.error("Error fetching all posts", error);

      if (error.code === "23502") {
        throw new ApiError(400, "Required fields cannot be empty");
      }

      throw new ApiError(
        500,
        "Database operation failed while fetching all posts",
      );
    }
  },
};
