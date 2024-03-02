"use server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { blogSchema } from "@/schemas";
import { connect } from "http2";
import { z } from "zod";
export const createBlog = async (values: z.infer<typeof blogSchema>) => {
  const validatedFields = blogSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };
  const { title, description, status } = validatedFields.data;
  const session = await auth();
  if (!session?.user) return { error: "Not Authorized" };
  // save blog to database
  console.log(title, description, status);
  const blog = await db.blog.create({
    data: {
      title,
      content: description,
      status,
      author: {
        connect: {
          email: session.user?.email || "",
        },
      },
    },
  });
  return { success: "blog created" };
};
export const showBlog = async () => {
  const blogs = await db.blog.findMany();
  return blogs;
};
