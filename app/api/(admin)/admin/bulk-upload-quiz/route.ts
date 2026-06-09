import { NextRequest, NextResponse } from "next/server";
import { Quiz } from "@/lib/models/Quiz";
import { connectDB } from "@/lib/db/db";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const rawData = await req.json();

    // Standardize input data into an array of quizzes
    const quizzesArray = Array.isArray(rawData) ? rawData : [rawData];

    if (quizzesArray.length === 0) {
      return NextResponse.json({ error: "No data found to process" }, { status: 400 });
    }

    const preparedQuizzes = [];

    // Loop through and validate/calculate totals for each quiz block
    for (const item of quizzesArray) {
      if (!item.title || !item.questions || !Array.isArray(item.questions)) {
        return NextResponse.json({ 
          error: "Invalid structure encountered. Quizzes must have a title and a valid questions array." 
        }, { status: 400 });
      }

      const totalQuestions = item.questions.length;
      const totalMarks = totalQuestions * 4;

      preparedQuizzes.push({
        examType: item.examType || "General",
        title: item.title,
        duration: Number(item.duration) || 60,
        difficulty: item.difficulty || "moderate",
        overview: item.overview || "",
        instructions: Array.isArray(item.instructions) ? item.instructions : [],
        questions: item.questions,
        totalQuestions,
        totalMarks
      });
    }

    // Insert all documents efficiently into MongoDB
    const insertedDocs = await Quiz.insertMany(preparedQuizzes);

    return NextResponse.json({
      message: `Successfully uploaded ${insertedDocs.length} quizzes directly!`,
      count: insertedDocs.length
    }, { status: 201 });

  } catch (error: any) {
    console.error("Bulk Upload Error:", error);
    return NextResponse.json({ 
      error: "Failed to upload bulk JSON data", 
      details: error.message 
    }, { status: 500 });
  }
}