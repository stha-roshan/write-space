import { CommentRepository } from "./comment.repository.js";

export const CommentService = {
  createComment: async (body, postId, userId) => {
    const { parentId, content } = body;

    const data = { postId, userId, parentId, content };

    const result = await CommentRepository.createComment(data);
    return result;
  },

  getAllComments: async(postId, query) => {

    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(25, Math.max(1, parseInt(query.limit) || 20));
    const offset = (page - 1) * limit;

    const result = await CommentRepository.getAllComments({postId, limit, offset})
    return result
  }
};
