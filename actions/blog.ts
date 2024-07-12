"use server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { blogSchema } from "@/schemas";
import { z } from "zod";

export const createBlog = async (values: z.infer<typeof blogSchema>) => {
  const validatedFields = blogSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };
  const { title, description, status, banner, content, categories } =
    validatedFields.data;
  const session = await auth();
  if (!session?.user) return { error: "Not Authorized" };
  try {
    // save blog to database
    const blog = await db.blog.create({
      data: {
        title,
        content,
        description,
        status,
        banner,
        tags: {
          create: values.tags
            ? values.tags.map((tag) => ({
                name: tag,
                slug: tag.toLowerCase().replace(/ /g, "-"),
              }))
            : [],
        },
        slug: values.slug,
        categories: {
          connectOrCreate: categories.map((cat) => {
            return {
              where: { id: cat },
              create: { name: cat, slug: cat.toLowerCase().replace(/ /g, "-") }, // Add the 'slug' property with an empty string value
            };
          }),
        },
        author: {
          connect: {
            email: session.user?.email || "",
          },
        },
      },
    });
    console.log("blog", blog);
  } catch (e: any) {
    console.log(e);
    // checking if error is because of title
    if (e.code === "P2002") {
      return { error: "Title or Slug already exists" };
    }
    return { error: "something went wrong" };
  }
  return { success: "blog created" };
};
export const updateBlog = async (
  values: z.infer<typeof blogSchema>,
  id: string
) => {
  const validatedFields = blogSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid Fields" };
  const {
    title,
    description,
    status,
    content,
    banner,
    tags,
    categories,
    slug,
  } = validatedFields.data;
  const session = await auth();
  if (!session?.user) return { error: "Not Authorized" };
  let existingblog = await db.blog.findUnique({
    where: { id },
    include: { author: true },
  });
  if (session.user.email !== existingblog?.author.email)
    return { error: "Not Authorized" };
  // save blog to database
  const blog = await db.blog.update({
    where: { id: id },
    data: {
      title,
      content,
      description,
      status,
      banner,
      tags: { set: tags ? tags.map((tag) => ({ name: tag })) : [] },
      slug: slug,
      categories: {
        connectOrCreate: categories.map((cat) => {
          return {
            where: { id: cat },
            create: { name: cat, slug: cat.toLowerCase().replace(/ /g, "-") },
          };
        }),
      },
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
    const blog = await db.blog.findUnique({
      where: { id },
      include: { author: true, categories: true, tags: true },
    });
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
