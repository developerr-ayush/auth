import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// import data from "@/dummyData.json";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams.get("p");
  const search = req.nextUrl.searchParams.get("search");
  const trending = req.nextUrl.searchParams.get("trending");
  const yearmonth = req.nextUrl.searchParams.get("yearmonth"); // 2022-01
  const pageSize = 10;
  let page = parseInt(p ?? "0");
  const offset = (page - 1) * pageSize;
  let session = await auth();
  let query: any = {
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      updatedAt: true,
      title: true,
      banner: true,
      description: true,
      categories: true,
      slug: true,
      views: true,
    },
  };
  if (!!page) {
    query.take = pageSize;
    query.skip = offset;
  }
  if (search) {
    query.where = {
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    };
  }
  if (trending) {
    query.orderBy = {
      views: "desc",
    };
  }
  if (yearmonth) {
    query.where = {
      AND: [
        {
          updatedAt: {
            gte: new Date(`${yearmonth}-01`),
          },
        },
        {
          updatedAt: {
            lt: new Date(`${yearmonth}-31`),
          },
        },
      ],
    };
  }
  if (!session) {
    query.where = {
      ...query.where,
      status: "published",
    };
  } else if (session?.user?.role === "SUPER_ADMIN") {
    query.take = 1000;
  } else {
    query.take = 1000;
    // query.where = {
    //   author: { id: session?.user?.id },
    // };
  }

  try {
    const blogs = await db.blog.findMany(query);
    if (blogs.length === 0) {
      return NextResponse.json({ error: "No Blogs Found" }, { status: 404 });
    }
    return NextResponse.json(blogs);
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 404 });
  }
}
