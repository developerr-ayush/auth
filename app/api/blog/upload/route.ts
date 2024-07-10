import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import cloudinary from "cloudinary";
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

let uploadfrombuffer = (compressedImage: any) => {
  console.log("Uploading to cloudinary");
  let fileUri = "data:image/jpeg;base64," + compressedImage.toString("base64");
  return new Promise((resolve, reject) => {
    let cld_upload_stream = cloudinary.v2.uploader
      .upload(fileUri, { invalidate: true })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export async function POST(req: NextRequest) {
  const data = await req.formData();

  if (!data.get("files[0]")) {
    return NextResponse.json({
      success: false,
      message: "No file found",
      code: 400,
    });
  }

  const file = data.get(`files[0]`) as File;
  const byte = await file.arrayBuffer();
  const buffer = Buffer.from(byte);
  let quality = 70;
  const path = "compressed_" + file.name;
  const format = file.type.split("/")[1];
  let compressedImage;
  switch (format) {
    case "jpeg":
      compressedImage = await sharp(buffer)
        .jpeg({ quality: quality })
        .toBuffer();
      break;
    case "png":
      // No direct quality adjustment in PNG, rely on compression level
      compressedImage = await sharp(buffer)
        .png({ quality: quality })
        .toBuffer(); // Adjust compression (1-9) based on quality
      break;
    case "gif":
      compressedImage = await sharp(buffer).gif().toBuffer();
      break;
    case "webp":
      compressedImage = await sharp(buffer).webp().toBuffer();
      break;
    default:
      compressedImage = await sharp(buffer).toBuffer();
  }
  const fileSize = compressedImage.length;
  try {
    let upload: any = await uploadfrombuffer(compressedImage);
    let updatedPathString = upload.url;
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
    console.error("Error uploading file:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to upload file",
      code: 500,
    });
  }
}
