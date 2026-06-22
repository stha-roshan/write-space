import { pool } from "../../config/db.js";
import { ApiError, logger } from "../../shared/utils/index.js";

const findExistingVoteQuery = `
    SELECT id, type FROM votes
    WHERE post_id = $1 AND user_id = $2
`;

const insertVoteQuery = `
    INSERT INTO votes(post_id, user_id, type)
    VALUES($1, $2, $3)
    RETURNING id, post_id, user_id, type, created_at
`;

const deleteVoteQuery = `
    DELETE FROM votes
    WHERE post_id = $1 AND user_id = $2
    RETURNING id, post_id, user_id, type
`;

const updateVoteQuery = `
    UPDATE votes
    SET type = $3
    WHERE post_id = $1 AND user_id = $2
    RETURNING id, post_id, user_id, type, created_at
`;
export const VoteRepository = {
  votePost: async (data) => {
    const { postId, userId, type } = data;

    try {
      const findExistingVote = await pool.query(findExistingVoteQuery, [
        postId,
        userId,
      ]);
      const isExistingVote = findExistingVote.rowCount > 0;
      let existingVoteType;
      let queryResult;
      if (isExistingVote) {
        existingVoteType = findExistingVote.rows[0].type;
      }

      if (!isExistingVote) {
        queryResult = await pool.query(insertVoteQuery, [postId, userId, type]);
        return { action: "voted", data: queryResult.rows[0] };
      } else if (isExistingVote && existingVoteType === type) {
        queryResult = await pool.query(deleteVoteQuery, [postId, userId]);
        return { action: "unvoted", data: queryResult.rows[0] };
      } else {
        queryResult = await pool.query(updateVoteQuery, [postId, userId, type]);
        return { action: "updated", data: queryResult.rows[0] };
      }
    } catch (error) {
      logger.error("Error posting vote", error);

      if (error.code === "23503") {
        throw new ApiError(404, "Referenced resource does not exist");
      }

      if (error.code === "23502") {
        throw new ApiError(400, "Required fields cannot be empty");
      }

      if (error.code === "22P02") {
        throw new ApiError(400, "Invalid value provided");
      }

      throw new ApiError(500, "Database operation failed while posting vote");
    }
  },
};
