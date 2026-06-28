import { asyncHandler, ApiResponse } from "../../shared/utils/index.js";
import { CommentService } from "./comment.service.js";

export const createComment = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;

  const comment = await CommentService.createComment(req.body, postId, userId);
  return res
    .status(201)
    .json(new ApiResponse(201, "Comment created successfully", comment));
});

export const getAllComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await CommentService.getAllComments(postId, req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, "Comments fetched successfully", comments));
});
