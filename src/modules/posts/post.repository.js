import { pool } from "../../config/db.js";
import { ApiError, logger } from "../../shared/utils/index.js";

const createPostQuery = `
    INSERT INTO posts(user_id, title, content)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, title, content, created_at
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
};
