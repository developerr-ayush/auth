import * as z from "zod";
export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(6, {
    message: "Password is required",
  }),
});
export const blogSchema = z.object({
  title: z.string().min(10, { message: "Title should be atleast 10 letters" }),
  content: z
    .string()
    .min(20, { message: "Description should be atleast 30 letters" }),
  date: z.date(),
  author: z.string().optional(),
  banner: z.string(),
  description: z.string().optional(),
  status: z
    .union([z.literal("draft"), z.literal("published"), z.literal("archived")])
    .optional(),
});
