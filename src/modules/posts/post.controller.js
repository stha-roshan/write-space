import { asyncHandler, ApiResponse, logger } from "../../shared/utils/index.js";
import { PostService } from "./post.service.js";

export const createPost = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const post = await PostService.createPost(req.body, userId);
  return res
    .status(201)
    .json(new ApiResponse(201, "Post created successfully", post));
});

export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await PostService.getAllPosts(req.query);
  return res.status(200).json(new ApiResponse(200, "All post fetched", posts));
});

export const getPost = asyncHandler(async (req, res) => {
  const post = await PostService.getPost(req.params);
  return res
    .status(200)
    .json(new ApiResponse(200, "Post fetched successfully", post));
});
