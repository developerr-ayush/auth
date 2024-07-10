import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// import data from "@/dummyData.json";

export async function POST(req: NextRequest) {
  let { name, email, acknowledge } = await req.json();
  if (!name && !email && !acknowledge) {
    return NextResponse.json({
      success: false,
      message: "All fields are required",
      status: 400,
    });
  }
  try {
    let data = await db.subscription.create({
      data: {
        name,
        email,
      },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
      status: 500,
    });
  }
}
