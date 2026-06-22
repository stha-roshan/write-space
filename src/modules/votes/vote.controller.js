import { asyncHandler, ApiResponse, logger } from "../../shared/utils/index.js";
import { VoteService } from "./vote.service.js";

export const votePost = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;

  const messages = {
    voted: "Post voted successfully",
    unvoted: "Vote removed successfully",
    updated: "Vote updated successfully",
  };
  const vote = await VoteService.votePost(postId, userId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, messages[vote.action], vote.data));
});
