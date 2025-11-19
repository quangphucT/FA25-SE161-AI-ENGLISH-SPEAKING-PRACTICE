import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
// Note: Add these environment variables to your .env.local file:
// CLOUDINARY_CLOUD_NAME=di1pesnb5
// CLOUDINARY_API_KEY=285854123531849
// CLOUDINARY_API_SECRET=<your_api_secret>
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "di1pesnb5",
  api_key: process.env.CLOUDINARY_API_KEY || "285854123531849",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert File to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64 data URL
    const base64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto", // Auto-detect image, video, etc.
      folder: "uploads", // Optional: organize uploads in a folder
    });

    // Return optimized URL with auto-format and auto-quality
    const optimizedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: "auto",
      quality: "auto",
    });

    return NextResponse.json(
      {
        secure_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        optimized_url: optimizedUrl,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error uploading to Cloudinary:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Upload failed" },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

