import { CommentRepository } from "./comment.repository.js";

export const CommentService = {
  createComment: async (body, postId, userId) => {
    const { parentId, content } = body;

    const data = { postId, userId, parentId, content };

    const result = await CommentRepository.createComment(data);
    return result;
  },
};
