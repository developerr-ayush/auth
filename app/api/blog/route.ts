import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  let blogs = await db.blog.findMany();
  if (!blogs) return NextResponse.json(new Error("Not Found"), { status: 404 });
  return NextResponse.json(blogs);
}
