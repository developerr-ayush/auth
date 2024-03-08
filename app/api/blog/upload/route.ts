import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { url } from "inspector";
import { NextResponse } from "next/server";
import { Formidable } from "formidable";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  let date = new Date();
  console.log("request.body", request.body);
  const filename = searchParams.get("filename") || `${date.getTime()}.png`;
  // return NextResponse.json(filename);
  const form = await request.formData();
  const file = form.get("files[0]") as File;
  console.log(form, file);
  if (filename && request.body) {
    // ⚠️ The below code is for App Router Route Handlers only
    const blob = await put(filename, file, {
      access: "public",
    });
    let url = blob.url;
    let fileName = url.split("/").pop();
    let baseUrl = url.split("/").slice(0, -1).join("/");
    return NextResponse.json({
      success: true,
      time: date,
      url: blob.url,
      data: {
        message: ["File uploaded successfully"],
        baseurl: baseUrl,
        files: [fileName],
        isImage: [true],
        code: 220,
      },
    });
    // return NextResponse.json({ success: true, data: blob });
  }
  return NextResponse.json("Invalid Request");

  // Here's the code for Pages API Routes:
  // const blob = await put(filename, request, {
  //   access: 'public',
  // });
}
