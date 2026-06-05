import * as z from 'zod'

export const registrationSchema = z.object({
  name: z
    .string("Name must be string")
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name cannot exceed 30 characters"),

  email: z
    .string("Email must be a string")
    .trim()
    .email("Invalid email address")
    .max(50, "Email is too long"),

  password: z
    .string("password must be a string")
    .min(8, "password must be between 8 and 16 characters")
    .max(16, "password must be between 8 and 16 characters"),
});