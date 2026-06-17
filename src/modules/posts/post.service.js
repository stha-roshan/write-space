import { ApiError } from "../../shared/utils/index.js";
import { PostRepository } from "./post.repository.js";
export const PostService = {
  createPost: async (body, userId) => {
    const { title, content } = body;

    const data = { userId, title, content };

    const result = await PostRepository.createPost(data);
    return result;
  },
};
