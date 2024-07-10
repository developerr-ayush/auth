import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams.get("p");

  try {
    const category = await db.category.findMany({
      orderBy: {
        name: "desc",
      },
    });
    if (!category.length) {
      return NextResponse.json({ error: "No category found" }, { status: 404 });
    }
    return NextResponse.json({ data: category }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 404 });
  }
}
