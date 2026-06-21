import * as z from "zod";

const contentSchema = z
  .string()
  .min(3, "comment must be at least 1 characters")
  .max(200, "title can only be 200 characters");

const parentIdSchema = z.string().optional();

export const commentSchema = z.object({
  content: contentSchema,
  parentId: parentIdSchema,
});
