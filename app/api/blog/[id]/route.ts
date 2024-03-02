import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET({ req }: any) {
  let id = req.params.id;
  let blog = await db.blog.findUnique({ where: { id } });
  if (!blog) {
    return NextResponse.json(new Error("Not Found"), { status: 404 });
  }
  return NextResponse.json(blog);
}
