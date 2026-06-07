import * as z from "zod";

const emailField = z
  .string()
  .trim()
  .email("Invalid email address")
  .max(50, "Email is too long");
const passwordField = z
  .string()
  .min(8, "Password must be between 8 and 16 characters")
  .max(16, "Password must be between 8 and 16 characters");

export const registrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name cannot exceed 30 characters"),
  email: emailField,
  password: passwordField,
});

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});
