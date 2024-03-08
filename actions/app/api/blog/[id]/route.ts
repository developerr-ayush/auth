import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let id = req.nextUrl.pathname.split("/").pop();
  try {
    let blog = await db.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!blog) {
      return NextResponse.json(new Error("Not Found"), { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json(error, { status: 404 });
  }
}
