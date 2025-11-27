import cloudinary from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("audio") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("audio/")) {
      return NextResponse.json(
        { error: "File is not an audio file" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "audio_files",
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error("Upload failed: no result"));
          }
        }
      );

      upload.end(buffer);
    });

    return NextResponse.json(
      { 
        url: result.secure_url, 
        public_id: result.public_id 
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Upload error:", error);
    const errorMessage = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
