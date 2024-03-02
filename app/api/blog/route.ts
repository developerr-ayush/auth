import { db } from "@/lib/db";
import { equal } from "assert";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams.get("p");
  const pageSize = 10;
  const page = parseInt(p ?? "1");
  const offset = (page - 1) * pageSize;

  try {
    const blogs = await db.blog.findMany({
      where: {
        status: "published",
      },
      orderBy: { updatedAt: "desc" },
      take: pageSize,
      skip: offset,
    });
    console.log(blogs);
    if (blogs.length === 0) {
      return NextResponse.json({ error: "No Blogs Found" }, { status: 404 });
    }
    return NextResponse.json(blogs);
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 });
  }
}
