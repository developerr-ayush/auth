import { auth } from "@/auth";
import { db } from "@/lib/db";
import { equal } from "assert";
import { Questrial } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams.get("p");
  const pageSize = 10;
  let page = parseInt(p ?? "1");
  const offset = (page - 1) * pageSize;
  let session = await auth();
  let query: any = {
    orderBy: { updatedAt: "desc" },
    take: pageSize,
    skip: offset,
  };
  try {
    if (!session) {
      query.where = {
        status: "published",
      };
    } else {
      query.take = 1000;
      query.where = {
        author: { email: session?.user?.email },
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
