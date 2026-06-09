import { connectDB } from "@/lib/db/db"
import { Quiz } from "@/lib/models/Quiz"
import { NextResponse } from "next/server";



export async function GET(){
    try {
        await connectDB()

       const quizzes = await Quiz.find({}, 'title').sort({ createdAt: -1 });
    return NextResponse.json(quizzes, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({error:'Failed to fetch quizzes'}, {status:500})
        
    }
}