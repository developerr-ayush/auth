import cloudinary from "@/lib/cloudinary";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get("files[0]") as unknown as File;
  if (!file) {
    return NextResponse.json({
      success: false,
      message: "File not found",
      code: 404,
    });
  }

  const byte = await file.arrayBuffer();
  const buffer = Buffer.from(byte);

  const path = join("./", "public", Date.now().toString() + "_" + file.name);
  await writeFile(path, buffer);

  console.log(path, buffer, byte, file);
  const updatedPath = path.split("\\").join("/").split("public");
  let updatedPathString = updatedPath[1];
  console.log(updatedPathString);
  await cloudinary.v2.uploader.upload(path, function (error, result) {
    console.log(result, error);
    if (!result) {
      return NextResponse.json({
        success: false,
        message: "File not found",
        code: 404,
      });
    }
    updatedPathString = result.url;
  });

  return NextResponse.json({
    success: true,
    time: Date.now(),
    url: updatedPathString,
    data: {
      message: ["File uploaded successfully"],
      baseurl: "",
      files: [updatedPathString],
      isImage: [true],
      code: 220,
    },
  });
}
