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

      // Validate nested questions to prevent Mongoose schema crashes
      for (const q of item.questions) {
        if (!q.subject || !q.question_text || !Array.isArray(q.options) || q.correct_answer === undefined) {
          return NextResponse.json({
            error: `Invalid question structure in quiz: "${item.title}". Questions must include subject, question_text, options array, and correct_answer.`,
          }, { status: 400 });
        }
      }

      const totalQuestions = item.questions.length;
      const totalMarks = totalQuestions * 4;

      preparedQuizzes.push({
        examType: item.examType || "General",
        title: item.title,
        duration: Number(item.duration) || 60,
        difficulty: item.difficulty || "moderate",
        overview: item.overview || "No overview provided", // Avoids empty string required-validation failure
        instructions: Array.isArray(item.instructions) ? item.instructions : [],
        classLevel: item.classLevel || "N/A",
        isLocked: item.isLocked ?? false,
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
x1
  } catch (error: any) {
    // This will print the EXACT Mongoose error details in your terminal console
    console.error("Bulk Upload Error Full Trace:", error); 
    
    return NextResponse.json({ 
      error: "Failed to upload bulk JSON data", 
      details: error.message,
      mongooseErrorReason: error.errors ? Object.keys(error.errors).map(k => error.errors[k].message) : undefined
    }, { status: 500 });
  }
}