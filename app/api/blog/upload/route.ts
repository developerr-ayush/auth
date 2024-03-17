import cloudinary from "@/lib/cloudinary";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { S3 } from "aws-sdk";
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

  const path = Date.now().toString() + "_" + file.name;
  // Initialize S3 instance with your AWS credentials
  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  // Define S3 upload parameters
  const uploadParams = {
    Bucket: "ayva-hub",
    Key: `blog/${path}`, // Extract filename from path
    Body: buffer,
    ACL: "public-read", // Set ACL to public-read if you want the uploaded objects to be publicly accessible
  };

  try {
    const uploadResult = await s3.upload(uploadParams).promise();
    const updatedPathString = uploadResult.Location;
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
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to upload file to S3",
      code: 500,
    });
  }
}
