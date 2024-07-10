import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams.get("p");

  try {
    const blogEntries = await db.blog.findMany({
      select: {
        updatedAt: true,
      },
      distinct: ["updatedAt"],
      orderBy: {
        updatedAt: "asc",
      },
    }); // get all blogs
    if (!blogEntries.length) {
      return NextResponse.json({ error: "No blog found" }, { status: 404 });
    }

    const MonthsAndYears: any = blogEntries.map((entry) => {
      const date = new Date(entry.updatedAt);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const slug = `${year}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      return { name: `${month} ${year}`, slug };
    });
    const uniqueMonthsAndYears = MonthsAndYears.filter(
      (v: any, i: any, a: any) =>
        a.findIndex((t: any) => t.slug === v.slug) === i
    );

    return NextResponse.json({ data: uniqueMonthsAndYears }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 404 });
  }
}
