import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams.get("p");
  const pageSize = 10;
  let page = parseInt(p ?? "1");
  const offset = (page - 1) * pageSize;
  let session = await auth();
  let query: any = {
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      status: true,
      banner:true,
      author: {
        select: {
          name: true,
        },
      },
    },
    take: pageSize,
    skip: offset,
  };
  try {
    if (!session) {
      query.where = {
        status: "published",
      };
    } else if (session?.user?.role === "SUPER_ADMIN") {
      query.take = 1000;
    } else {
      query.take = 1000;
      query.where = {
        author: { id: session?.user?.id },
      };
    }

    const blogs = await db.blog.findMany(query);
    if (blogs.length === 0) {
      return NextResponse.json({ error: "No Blogs Found" }, { status: 404 });
    }
    return NextResponse.json(blogs);
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 });
  }
}
