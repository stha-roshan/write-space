import {
  asyncHandler,
  ApiResponse,
  logger,
} from "../../shared/utils/index.js";
import { PostService } from "./post.service.js";

export const createPost = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const post = await PostService.createPost(req.body, userId);
  return res
    .status(201)
    .json(new ApiResponse(201, "Post created successfully", post));
});
