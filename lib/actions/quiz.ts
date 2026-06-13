"use server";

import { connectDB } from "@/lib/db/db";
import { QuizResult } from "@/lib/models/QuizResult";
import { LeaderboardStats } from "@/lib/models/LeaderBoard";
import resources from "@/data/testSeries";

// -----------------------------------------
// Action 1: Save First Attempt Only
// -----------------------------------------
export async function saveFirstAttemptOnly(testId: string, userAnswers: any, userId: string | null, userProfile: any) {
  try {
    // If auth is optional, we just exit gracefully here if no user is passed
    if (!userId || !userProfile) {
      return { success: false, message: "Guest user. Result not saved." };
    }

    await connectDB();

    const existing = await QuizResult.findOne({
      userId: userId,
      testId: Number(testId),
    }).lean();

    if (existing) {
      return { success: true, message: "Already saved." };
    }

    const testData = resources.find((item) => item.id === Number(testId));
    if (!testData) return { success: false, message: "Test not found" };

    let cleanAnswers = Array.isArray(userAnswers)
      ? userAnswers.map(Number)
      : Object.values(userAnswers).map(Number);
      
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    testData.questions.forEach((question: any, index: number) => {
      const userAnswer = cleanAnswers[index];
      if (userAnswer === undefined || userAnswer === null || isNaN(userAnswer)) {
        unattemptedCount++;
      } else if (userAnswer === question.correctAnswer) {
        correctCount++;
        score += 4;
      } else {
        incorrectCount++;
        score -= 1;
      }
    });

    const maxScore = testData.questions.length * 4;

    await Promise.all([
      QuizResult.create({
        userId,
        testId: Number(testId),
        testTitle: testData.title,
        score,
        maxScore,
        correctCount,
        incorrectCount,
        unattemptedCount,
        userAnswers: cleanAnswers,
      }),
      updateLeaderboardLogic(userId, userProfile, score, maxScore),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Critical Error in saveFirstAttemptOnly:", error);
    return { success: false };
  }
}

// -----------------------------------------
// Helper: Update Leaderboard Logic
// -----------------------------------------
async function updateLeaderboardLogic(userId: string, user: any, score: number, maxScore: number) {
  let stats = await LeaderboardStats.findOne({ userId });
  if (!stats) {
    stats = new LeaderboardStats({
      userId,
      name: user.fullName || "Anonymous", // Pulls from your AuthProvider payload
      imageUrl: user.imageUrl,
      totalScore: 0,
      totalMaxScore: 0,
      quizzesAttempted: 0,
    });
  }
  stats.totalScore += score;
  stats.totalMaxScore += maxScore;
  stats.quizzesAttempted += 1;
  stats.lastAttemptAt = new Date();
  stats.averageScore = parseFloat((stats.totalScore / stats.quizzesAttempted).toFixed(2));
  
  return stats.save();
}

// -----------------------------------------
// Action 2: Save Test Result Action
// -----------------------------------------
export async function saveTestResultAction(testId: string, resultData: any, testTitle: string, userId: string | null, userProfile: any) {
  try {
    // Optional auth check
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
          name: userProfile.fullName || "Anonymous",
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