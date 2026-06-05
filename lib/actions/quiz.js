"use server";

import { connectDB } from "@/lib/db/db";
import { QuizResult } from "@/lib/models/QuizResult";
import { LeaderboardStats } from "@/lib/models/LeaderBoard";
import { auth, currentUser } from "@clerk/nextjs/server";
import resources from "@/data/testSeries";

export async function saveFirstAttemptOnly(testId, userAnswers, userId, userProfile) {
  try {
    if (!userId || !userProfile) {
      return { success: false, message: "User not authenticated" };
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

    testData.questions.forEach((question, index) => {
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

async function updateLeaderboardLogic(userId, user, score, maxScore) {
  let stats = await LeaderboardStats.findOne({ userId });
  if (!stats) {
    stats = new LeaderboardStats({
      userId,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Anonymous",
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

// Ensure you also pass userId and user (userProfile) to saveTestResultAction from the client UI
export async function saveTestResultAction(testId, resultData, testTitle, userId, userProfile) {
  try {
    if (!userId || !userProfile) {
      return { success: true, message: "Guest user. Result not saved." };
    }

    await connectDB();

    const existingAttempt = await QuizResult.findOne({ userId, testId }).lean();
    if (existingAttempt) {
      return { success: true, message: "Not the first attempt." };
    }

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

    await LeaderboardStats.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          name: `${userProfile.firstName} ${userProfile.lastName || ""}`.trim(),
          imageUrl: userProfile.imageUrl,
          lastAttemptAt: new Date(),
        },
        $inc: {
          totalScore: resultData.score,
          totalMaxScore: resultData.maxScore,
          quizzesAttempted: 1,
        },
      },
      { upsert: true, new: true }
    );

    return { success: true, message: "Result and Leaderboard updated!" };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "Server error." };
  }
}