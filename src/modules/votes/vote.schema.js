import * as z from "zod";

const voteType = ["upvote", "downvote"];

export const voteSchema = z.object({
  type: z.enum(voteType),
});
