import cloudinary from '@/lib/cloudinary/cloudinary';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'quiz_assets',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({
      secure_url: uploadResult.secure_url,
    });

  } catch (error) {
    console.error("Server-side upload error:", error);
    return NextResponse.json(
      { error: "Internal server error during upload" },
      { status: 500 }
    );
  }
}