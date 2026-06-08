"use server";

import { connectDB } from "@/lib/db/db";
import { QuizResult } from "@/lib/models/QuizResult";
import { LeaderboardStats } from "@/lib/models/LeaderBoard";

export async function saveTestResultAction(
  testId: string, 
  resultData: any, 
  testTitle: string,
  userId: string | null,    // Added
  userProfile: any | null   // Added
) {
  try {
    // If there is no user, it's optional, so we just return gracefully
    if (!userId || !userProfile) {
      return { success: true, message: "Guest user. Result not saved." };
    }

    await connectDB();

    // 1. FIRST ATTEMPT CHECK
    const existingAttempt = await QuizResult.findOne({ userId, testId }).lean();
    if (existingAttempt) {
      return { success: true, message: "Not the first attempt." };
    }

    // 2. SAVE INDIVIDUAL RESULT
    await QuizResult.create({
      userId,
      testId,
      score: resultData.score,
      maxScore: resultData.maxScore,
      testTitle,
      correctCount: resultData.correctCount,
      incorrectCount: resultData.incorrectCount,
      unattemptedCount: resultData.unattemptedCount,
      userAnswers: resultData.userAnswers,
    });

    // 3. UPDATE LEADERBOARD
    await LeaderboardStats.findOneAndUpdate(
      { userId: userId },
      {
        $set: { 
          name: userProfile.fullName || "Anonymous", // Mapping from your AuthProvider
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
    
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Server error." };
  }
}