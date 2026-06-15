import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/db";
import { Quiz } from "@/lib/models/Quiz";

// Optional in Next.js 15 since GET routes are no longer cached by default,
// but fine to leave in for explicit clarity.
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  // 1. Type params as a Promise
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await connectDB();

    // 2. Await the params object (The Next.js 15 way)
    const { id } = await params;

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(quiz, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}