import cloudinary from "@/lib/cloudinary/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const uploadRes = await cloudinary.uploader.upload(body.file, {
      folder: "blogs",
    resource_type: "auto", // <-- FIX: added quotes here
    });
    return NextResponse.json({ url: uploadRes.secure_url });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
