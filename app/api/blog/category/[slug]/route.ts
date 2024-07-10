import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let slug = req.nextUrl.pathname.split("/").pop();
  const pageSize = 6;
  const p = req.nextUrl.searchParams.get("p");
  const search = req.nextUrl.searchParams.get("search");

  let page = parseInt(p ?? "1");
  const offset = (page - 1) * pageSize;
  let query: any = {
    where: { slug },
    include: {
      blogs: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          status: true,
          banner: true,
          description: true,
          categories: true,
          slug: true,
          tags: true,
          views: true,
          author: {
            select: {
              name: true,
            },
          },
        },
        take: pageSize,
        skip: offset,
      },
    },
  };
  console.log(search);
  if (search) {
    query.include.blogs.where = {
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    };
  }

  try {
    let category: any = await db.category.findUnique({ ...query });

    if (!category) {
      return NextResponse.json(new Error("Not Found"), { status: 404 });
    }
    return NextResponse.json(category.blogs);
  } catch (error) {
    return NextResponse.json(error, { status: 404 });
  }
}
export async function DELETE(req: NextRequest) {
  let id = req.nextUrl.pathname.split("/").pop();
  let session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let GetBlog = await db.blog.findUnique({
    where: { id },
    select: {
      authorId: true,
    },
  });
  if (!GetBlog) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  if (session?.user?.role !== "SUPER_ADMIN") {
    if (GetBlog.authorId !== session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  try {
    let blog = await db.blog.delete({
      where: { id },
    });
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json(error, { status: 404 });
  }
}
