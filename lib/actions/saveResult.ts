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
      return { success: true, isFirstAttempt: false, message: "Guest user. Result not saved." };
    }

    await connectDB();

    // 2. FIRST ATTEMPT CHECK (Just reading, not saving)
    const existingAttempt = await QuizResult.findOne({ userId, testId }).lean();
    if (existingAttempt) {
      // FIX: Added `isFirstAttempt: false`
      return { success: true, isFirstAttempt: false, message: "Not the first attempt. Showing UI only." };
    }

    // 3. Convert Array to plain Object so Mongoose Map accepts it
    const formattedUserAnswers = Array.isArray(resultData.userAnswers)
      ? Object.fromEntries(resultData.userAnswers.map((ans: any, index: number) => [index.toString(), ans]))
      : resultData.userAnswers;

    // 4. SAVE INDIVIDUAL RESULT (This only runs if it IS the first attempt)
    await QuizResult.create({
      userId,
      testId,
      score: resultData.score,
      maxScore: resultData.maxScore,
      testTitle,
      correctCount: resultData.correctCount,
      incorrectCount: resultData.incorrectCount,
      unattemptedCount: resultData.unattemptedCount,
      userAnswers: formattedUserAnswers, 
    });

    // 5. UPDATE LEADERBOARD
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

    // FIX: Added `isFirstAttempt: true`
    return { success: true, isFirstAttempt: true, message: "Result and Leaderboard updated!" };
    
  } catch (error: any) {
    if (error.code === 11000) {
       // FIX: Added `isFirstAttempt: false`
       return { success: true, isFirstAttempt: false, message: "Duplicate attempt caught by database." };
    }
    
    console.error("Save Result Error Detailed:", error);
    return { success: false, message: "Server error." };
  }
}