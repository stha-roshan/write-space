import { VoteRepository } from "./vote.repository.js";

export const VoteService = {
  votePost: async (postId, userId, body) => {
    const { type } = body;

    const data = { postId, userId, type };

    const result = await VoteRepository.votePost(data);
    return result;
  },
};
