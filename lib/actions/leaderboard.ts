"use server";

// Import your MongoDB connection utility here

import { connectDB } from "@/lib/db/db"; 
import { LeaderboardStats } from "@/lib/models/LeaderBoard";


export async function fetchLeaderboard() {
  try {
    await connectDB(); 

    // Fetch users sorted by averageScore (highest first)
    // If scores are tied, sort by lastAttemptAt (oldest first)
    const topUsers = await LeaderboardStats.find({})
      .sort({ averageScore: -1, lastAttemptAt: 1 })
      .limit(100) // Adjust limit as needed
      .lean();

    // Next.js Server Actions require plain objects to be returned
    // stringifying and parsing removes MongoDB specific object types like ObjectIds
    return JSON.parse(JSON.stringify(topUsers));
  } catch (error) {
    console.error("Failed to fetch leaderboard data:", error);
    return [];
  }
}