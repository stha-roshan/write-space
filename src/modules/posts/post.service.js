import { ApiError } from "../../shared/utils/index.js";
// import { getAllPosts } from "./post.controller.js";
import { PostRepository } from "./post.repository.js";
export const PostService = {
  createPost: async (body, userId) => {
    const { title, content } = body;

    const data = { userId, title, content };

    const result = await PostRepository.createPost(data);
    return result;
  },

  getAllPosts: async (data) => {
    const page = Math.max(1, parseInt(data.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(data.limit) || 10));
    const offset = (page - 1) * limit;

    const posts = await PostRepository.getAllPosts({ offset, limit });
    return posts;
  },
};
