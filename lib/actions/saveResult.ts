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

    // 2. FIRST ATTEMPT CHECK
    const existingAttempt = await QuizResult.findOne({ userId, testId }).lean();
    if (existingAttempt) {
      return { success: true, message: "Not the first attempt. Showing UI only." };
    }

    // FIX 3: Convert Array to plain Object so Mongoose Map accepts it
    const formattedUserAnswers = Array.isArray(resultData.userAnswers)
      ? Object.fromEntries(resultData.userAnswers.map((ans: any, index: number) => [index.toString(), ans]))
      : resultData.userAnswers;

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
      userAnswers: formattedUserAnswers, // Use the converted object here
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
    if (error.code === 11000) {
       return { success: true, message: "Duplicate attempt caught by database." };
    }
    
    // Log the actual error to your terminal so you can see if Mongoose is still complaining
    console.error("Save Result Error Detailed:", error);
    return { success: false, message: "Server error." };
  }
}