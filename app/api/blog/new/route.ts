import { blogSchema } from "@/schemas";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let body = await request.json();
  const validatedFields = blogSchema.safeParse(body);

  return NextResponse.json({ success: "Blog Created" });
}
