import { NextResponse } from "next/server";
import { Quiz } from "@/lib/models/Quiz";
import { connectDB } from "@/lib/db/db";

export async function GET() {
  try {
    await connectDB();

    // Included createdAt to use as the startDate for your UI logic
    const quizzes = await Quiz.find({})
  .select("_id title examType classLevel language difficulty duration totalQuestions createdAt isLocked")
      .sort({ createdAt: -1 });

    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch quizzes" } , { status: 500 });
  }
}