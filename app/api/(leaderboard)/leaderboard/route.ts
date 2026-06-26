
import { connectDB } from "@/lib/db/db";
import { LeaderboardStats } from "@/lib/models/LeaderBoard";
import { NextResponse } from "next/server";

// Import your DB connection utility here

export async function GET() {
  try {
    // 1. Connect to your database
    await connectDB(); 

    

    // 2. Fetch the top 10 users, sorted by totalScore descending
    const topUsers = await LeaderboardStats.find({})
      .sort({ totalScore: -1, lastAttemptAt: 1 }) // Using the index you created!
      .limit(10)
      .lean({ virtuals: true }) // .lean() makes it a plain JavaScript object

    return NextResponse.json(topUsers);
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}