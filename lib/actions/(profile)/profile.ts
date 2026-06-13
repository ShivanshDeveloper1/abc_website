"use server";

import { connectDB } from "@/lib/db/db";
import { QuizResult } from "@/lib/models/QuizResult";
import { LeaderboardStats } from "@/lib/models/LeaderBoard";

export async function getUserProfileData(userId: string) {
  try {
    if (!userId) return { success: false, message: "No user ID provided" };

    await connectDB();

    // 1. Fetch Overall Stats from Leaderboard
    const stats = await LeaderboardStats.findOne({ userId }).lean();

    // 2. Fetch Quiz History
    const history = await QuizResult.find({ userId })
      .sort({ createdAt: -1 }) // Newest first
      .lean();

    // 3. Calculate derived metrics
    let totalCorrect = 0;
    let totalQuestions = 0;
    
    history.forEach((quiz: any) => {
      totalCorrect += quiz.correctCount || 0;
      totalQuestions += (quiz.correctCount + quiz.incorrectCount + quiz.unattemptedCount) || 0;
    });

    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const highestScore = history.length > 0 ? Math.max(...history.map((q: any) => q.score)) : 0;

    return {
      success: true,
      data: {
        stats: stats || { quizzesAttempted: 0, totalScore: 0, totalMaxScore: 0 },
        history: JSON.parse(JSON.stringify(history)), // Serialize for Next.js Server Action
        metrics: {
          accuracy,
          highestScore,
          totalCorrect
        }
      }
    };
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
    return { success: false, message: "Server error fetching profile" };
  }
}