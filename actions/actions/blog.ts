"use server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { blogSchema } from "@/schemas";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const createBlog = async (values: z.infer<typeof blogSchema>) => {
  const validatedFields = blogSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };
  const { title, description, status, banner } = validatedFields.data;
  const session = await auth();
  // console.log(title, description, status, banner);
  if (!session?.user) return { error: "Not Authorized" };
  // save blog to database
  const blog = await db.blog.create({
    data: {
      title,
      content: description,
      status,
      banner,
      author: {
        connect: {
          email: session.user?.email || "",
        },
      },
    },
  });
  return { success: "blog created" };
};
export const updateBlog = async (
  values: z.infer<typeof blogSchema>,
  id: string
) => {
  const validatedFields = blogSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };
  const { title, description, status } = validatedFields.data;
  const session = await auth();
  if (!session?.user) return { error: "Not Authorized" };
  let existingblog = await db.blog.findUnique({
    where: { id },
    include: { author: true },
  });
  if (session.user.email !== existingblog?.author.email)
    return { error: "Not Authorized" };
  // save blog to database
  // console.log(title, description, status);
  const blog = await db.blog.update({
    where: { id: id },
    data: {
      title,
      content: description,
      status,
    },
  });
  return { success: "blog created" };
};
export const showBlog = async () => {
  const blogs = await db.blog.findMany();
  return blogs;
};
export const getBlogById = async (id: string) => {
  try {
    const blog = await db.blog.findUnique({ where: { id } });
    // console.log(blog);
    return blog;
  } catch (error) {
    return null;
  }
};
export const deleteBlog = async (id: string) => {
  let session = await auth();
  if (!session) return { error: "Not Authorized" };
  if (!session?.user) return { error: "Not Authorized" };
  let existingblog = await db.blog.findUnique({
    where: { id },
    include: { author: true },
  });
  if (session.user.email !== existingblog?.author.email)
    return { error: "Not Authorized" };
  try {
    await db.blog.delete({ where: { id } });
    return { success: "blog deleted" };
  } catch (error) {
    return { error: "something went wrong" };
  }
};
