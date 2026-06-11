"use server";

import { connectDB } from "@/lib/db/db";
import { QuizResult } from "@/lib/models/QuizResult";
import { LeaderboardStats } from "@/lib/models/LeaderBoard";

export async function saveTestResultAction(
  testId: string, 
  resultData: any, 
  testTitle: string,
  userId: string | null,
  userProfile: { fullName: string; imageUrl: string } | null
) {
  try {
    // 1. Guest Check
    if (!userId || !userProfile) {
      return { success: true, message: "Guest user. Result not saved." };
    }

    await connectDB();

    // 2. FIRST ATTEMPT CHECK (This is what guarantees only attempt #1 is saved)
    const existingAttempt = await QuizResult.findOne({ userId, testId }).lean();
    if (existingAttempt) {
      // Return success: true so the frontend doesn't show an error, 
      // but we safely skip saving to the database.
      return { success: true, message: "Not the first attempt. Showing UI only." };
    }

    // 3. SAVE INDIVIDUAL RESULT
    await QuizResult.create({
      userId,
      testId,
      score: resultData.score,
      maxScore: resultData.maxScore,
      testTitle,
      correctCount: resultData.correctCount,
      incorrectCount: resultData.incorrectCount,
      unattemptedCount: resultData.unattemptedCount,
      // Mongoose handles plain JS objects for Map types smoothly
      userAnswers: resultData.userAnswers, 
    });

    // 4. UPDATE LEADERBOARD
    await LeaderboardStats.findOneAndUpdate(
      { userId: userId },
      {
        $set: { 
          name: userProfile.fullName, 
          imageUrl: userProfile.imageUrl,
          lastAttemptAt: new Date()
        },
        $inc: { 
          totalScore: resultData.score, 
          totalMaxScore: resultData.maxScore,
          quizzesAttempted: 1 
        }
      },
      { upsert: true, new: true }
    );

    return { success: true, message: "Result and Leaderboard updated!" };
    
  } catch (error: any) {
    // Check for MongoDB Duplicate Key Error (E11000)
    // This catches race conditions if the user double-clicks submit
    if (error.code === 11000) {
       return { success: true, message: "Duplicate attempt caught by database." };
    }
    
    console.error("Save Result Error:", error);
    return { success: false, message: "Server error." };
  }
}