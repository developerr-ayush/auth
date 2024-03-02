import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  let blogs = await db.blog.findMany();
  return NextResponse.json(blogs);
}
