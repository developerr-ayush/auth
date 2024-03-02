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
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.date(),
  author: z.string(),
  status: z.union([z.literal("published"), z.literal("draft")]),
});
