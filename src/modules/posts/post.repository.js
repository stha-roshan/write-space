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

const getPostQuery = `
  SELECT
    posts.id AS post_id,
    posts.user_id AS author_id,
    posts.title, posts.content,
    posts.created_at AS post_created,
    posts.updated_at AS post_updated,
    COUNT(votes.id)::int As total_votes,
    SUM(CASE WHEN votes.type = 'upvote' THEN 1 ELSE 0 END)::int AS upvotes,
    SUM(CASE WHEN votes.type = 'downvote' THEN 1 ELSE 0 END)::int AS downvotes,
    SUM(CASE WHEN votes.type = 'upvote' THEN 1 WHEN votes.type = 'downvote' THEN -1 ELSE 0 END)::int AS score
  FROM posts
  LEFT JOIN votes ON posts.id = votes.post_id
  WHERE posts.id = $1
  GROUP BY
    posts.id,
    posts.user_id,
    posts.title,
    posts.content,
    posts.created_at,
    posts.updated_at
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

  getPost: async (id) => {
    try {
      const result = await pool.query(getPostQuery, [id]);

      if (!result.rows[0]) {
        throw new ApiError(404, "Post not found");
      }

      return result.rows[0];
    } catch (error) {
      if (error instanceof ApiError) throw error;

      logger.error(`Error fetching post ${id}`, error);

      if (error.code === "23502") {
        throw new ApiError(400, "Required fields cannot be empty");
      }

      if (error.code === "23503") {
        throw new ApiError(400, "Referenced resource does not exist");
      }

      if (error.code === "22P02") {
        throw new ApiError(400, "Invalid value provided");
      }

      throw new ApiError(500, "Database operation failed while fetching post");
    }
  },
};
