import { connectDB } from "@/lib/db/db";
import { QuizResult } from "@/lib/models/QuizResult"; 
import { LeaderboardStats } from "@/lib/models/LeaderBoard";

export async function AllStudents() {
  try {
    await connectDB();

    // 1. Fetch the 100 most recent quiz results
    const recentResults = await QuizResult.find({})
      .select("userId testTitle score maxScore createdAt")
      .sort({ createdAt: -1 }) 
      .limit(100)
      .lean();

    if (!recentResults || recentResults.length === 0) return [];

    // 2. Extract all the unique userIds
    const userIds = [...new Set(recentResults.map((r: any) => r.userId))];

    // 3. Fetch the Profile Data (Name & Image)
    const userProfiles = await LeaderboardStats.find({ userId: { $in: userIds } })
      .select("userId name imageUrl")
      .lean();

    const profileMap = userProfiles.reduce((acc: any, profile: any) => {
      acc[profile.userId] = profile;
      return acc;
    }, {});

    // 4. Group the recent tests by User
    const groupedData: Record<string, any> = {};

    recentResults.forEach((result: any) => {
      const uid = result.userId ? result.userId.toString() : "Unknown";
      
      // If the user isn't in our grouped list yet, create them
      if (!groupedData[uid]) {
        const profile = profileMap[uid] || {};
        groupedData[uid] = {
          userId: uid,
          userName: profile.name || "Unknown User",
          userImage: profile.imageUrl || "",
          quizzes: [] // We will push their tests into this array
        };
      }

      // Add this specific test to the user's array
      groupedData[uid].quizzes.push({
        _id: result._id.toString(),
        testTitle: result.testTitle || "Unknown Quiz",
        score: result.score || 0,
        maxScore: result.maxScore || result.totalQuestions || 0,
        createdAt: result.createdAt ? result.createdAt.toISOString() : null,
      });
    });

    // 5. Convert the grouped object back into an array so we can map over it in React
    return Object.values(groupedData);
    
  } catch (error) {
    console.error("Failed to fetch grouped student results:", error);
    return []; 
  }
}