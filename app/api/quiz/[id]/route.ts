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



// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db/db";
// import { Quiz } from "@/lib/models/Quiz";

// // NEW: The idiomatic Next.js way to cache this route for 1 hour (3600 seconds)
// // This replaces the need for manual Cache-Control headers.
// export const revalidate = 3600; 

// export async function GET(
//   request: Request,
//   // NEW: Type 'params' explicitly as a Promise
//   { params }: { params: Promise<{ id: string }> } 
// ) {
//   try {
//     await connectDB();
    
//     // NEW: Await the params (You already had this right!)
//     const { id } = await params;

//     const quiz = await Quiz.findById(id);

//     if (!quiz) {
//       return NextResponse.json(
//         { error: "Quiz not found" }, 
//         { status: 404 }
//       );
//     }

//     // Return the data without needing the manual headers block
//     return NextResponse.json(quiz, { status: 200 });
    
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Internal Server Error" }, 
//       { status: 500 }
//     );
//   }
// }