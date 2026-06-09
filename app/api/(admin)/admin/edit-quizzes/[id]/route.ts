import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/db";
import { Quiz } from "@/lib/models/Quiz";

// 1. GET Single Quiz
export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    
    // Await params to ensure compatibility across modern Next.js setups
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const quiz = await Quiz.findById(id);
    
    if (!quiz) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    
    return NextResponse.json(quiz, { status: 200 });
  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Error fetching quiz", details: error.message }, { status: 500 });
  }
}

// 2. PUT Update Quiz
export async function PUT(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const data = await req.json();
    
    // Auto-recalculate totals based on questions array length
    if (data.questions && Array.isArray(data.questions)) {
        data.totalQuestions = data.questions.length;
        data.totalMarks = data.questions.length * 4;
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(id, data, { new: true });
    
    if (!updatedQuiz) {
      return NextResponse.json({ error: "Quiz to update not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Updated successfully", quiz: updatedQuiz }, { status: 200 });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Failed to update", details: error.message }, { status: 500 });
  }
}