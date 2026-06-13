import { LeaderboardStats } from "@/lib/models/leaderboard";

// Put this inside your server action AFTER you successfully save the new QuizResult
async function updateLeaderboardStats(
  userId,
  userName,
  userImage,
  newQuizScore,
  newQuizMaxScore,
) {
  // 1. Find the user's current leaderboard profile, or create an empty one if it's their first quiz
  let userStats = await LeaderboardStats.findOne({ userId: userId });

  if (!userStats) {
    userStats = new LeaderboardStats({
      userId: userId,
      name: userName,
      imageUrl: userImage,
      totalScore: 0,
      totalMaxScore: 0,
      quizzesAttempted: 0,
      averageScore: 0,
    });
  }

  // 2. Add the new quiz data to their totals
  userStats.totalScore += newQuizScore;
  userStats.totalMaxScore += newQuizMaxScore;
  userStats.quizzesAttempted += 1;
  userStats.lastAttemptAt = new Date(); // Updates the tie-breaker timestamp

  // 3. Calculate the new average score
  // Prevent dividing by zero just in case
  if (userStats.quizzesAttempted > 0) {
    // Keeping it to 2 decimal places (e.g., 85.50)
    userStats.averageScore = parseFloat(
      (userStats.totalScore / userStats.quizzesAttempted).toFixed(2),
    );
  }

  // 4. Save to the database
  await userStats.save();
}
