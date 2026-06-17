import * as z from "zod";

const titleSchema = z
  .string()
  .trim()
  .min(3, "title must be at least 3 characters")
  .max(200, "title can only be 200 characters");

const contentSchema = z
  .string()
  .trim()
  .min(10, "post content must atleast be 10 characters");

export const postSchema = z.object({
  title: titleSchema,
  content: contentSchema,
});
