import { connectDB } from "@/lib/db/db";
import { LeaderboardStats } from "@/lib/models/LeaderBoard";

export async function AllStudents() {
  try {
    await connectDB();

    const users = await LeaderboardStats.find({})
      .sort({ totalScore: -1 })
      .limit(100)
      .lean();

    // Convert ObjectIds and Dates to plain strings to prevent Next.js crashes
    const serializedUsers = users.map((user: any) => ({
      ...user,
      _id: user._id.toString(), // Convert ObjectId
      lastAttemptAt: user.lastAttemptAt ? user.lastAttemptAt.toISOString() : null,
      createdAt: user.createdAt ? user.createdAt.toISOString() : null,
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
    }));

    return serializedUsers;
    
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return []; // Return empty array on crash so the UI doesn't break
  }
}