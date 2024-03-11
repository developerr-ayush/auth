import { auth } from "@/auth";
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
