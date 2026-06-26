"use client";
import React, { useMemo, useEffect, useState } from "react";
import {
  Trophy,
  Flame,
  Target,
  Zap,
  Swords,
  TrendingUp,
  TrendingDown,
  Minus,
  Medal,
} from "lucide-react";
import Image from "next/image";

const calculateNearMiss = (data) => {
  const sorted = [...data].sort((a, b) => b.score - a.score);
  return sorted.map((user, i) => ({
    ...user,
    // Using existing trend data or default
    trend: user.trend || "same",
    pointsToNext: i === 0 ? 0 : sorted[i - 1].score - user.score,
  }));
};

// Trend Icon Component for visual growth
const TrendIcon = ({ trend }) => {
  if (trend === "up")
    return <TrendingUp size={12} className="text-emerald-500" />;
  if (trend === "down")
    return <TrendingDown size={12} className="text-red-500" />;
  return <Minus size={12} className="text-gray-300" />;
};



const getGapConfig = (points) => {
  if (points <= 5)
    return {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-100",
      dot: "bg-red-500",
      label: `${points} XP — SO CLOSE`,
    };
  if (points <= 15)
    return {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-100",
      dot: "bg-amber-400",
      label: `${points} XP away`,
    };
  return {
    bg: "bg-gray-50",
    text: "text-gray-400",
    border: "border-gray-200",
    dot: "bg-gray-300",
    label: `${points} XP behind`,
  };
};

const LivePulse = () => {
  const [count, setCount] = useState(127);
  const [on, setOn] = useState(true);
  useEffect(() => {
    const b = setInterval(() => setOn((v) => !v), 1000);
    return () => clearInterval(b);
  }, []);
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-tight">
      <span
        className={`w-2 h-2 rounded-full bg-emerald-500 transition-opacity duration-700 ${on ? "opacity-100" : "opacity-30"}`}
      />
      {count} Active Now
    </span>
  );
};

const RankBadge = ({ rank }) => {
  if (rank === 1) return <Medal size={24} className="text-yellow-500" />;
  if (rank === 2) return <Medal size={22} className="text-gray-400" />;
  if (rank === 3) return <Medal size={22} className="text-orange-400" />;
  return (
    <span className="text-xs font-black text-gray-300 tabular-nums">
      #{rank}
    </span>
  );
};

const ScoreBar = ({ score, max, isUser }) => {
  const pct = Math.round((score / max) * 100);
  return (
    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-1.5">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${isUser ? "bg-indigo-600" : "bg-gray-300"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default function FullLeaderboardPage({currentUserId}) {
  const [rawData, setRawData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // 1. Replace the static rawData with React state

// 2. Fetch the real data when the component loads
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch('/api/leaderboard');

        if(!response.ok){
          throw new Error('Failed to fetch leaderboard')
        }




        const dbData = await response.json();

        // 3. Map the database fields to match your UI's exact format
        const formattedData = (dbData || []).map((user) => ({
          id: user.userId,                   // Map db userId to UI id
          name: user.name,                   // Same
          score: user.totalScore,            // Map db totalScore to UI score
          trend: "same",                     // Default trend (you can add DB logic for this later)
          isCurrentUser: user.userId === currentUserId, // Check if this row is the logged-in user
          image: user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&bold=true`
        }));

        setRawData(formattedData);
      } catch (error) {
        console.error("Error fetching real leaderboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [currentUserId]);

    const processedData = useMemo(() => calculateNearMiss(rawData), [rawData]);
  const topScore = processedData[0]?.score || 1;

  // Optional: Show a loading state while fetching
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-indigo-600 font-bold uppercase tracking-widest animate-pulse">
          Loading Arena Data...
        </div>
      </div>
    );
  }





  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* ── Navbar ── */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 md:px-8 py-4 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center">
              <Trophy size={16} className="text-yellow-400" />
            </div>
            <span className="font-black text-gray-900 text-sm tracking-tight uppercase">
              Arena Pro
            </span>
          </div>
          <LivePulse />
          <button className="flex items-center gap-2 text-[10px] font-black bg-gray-900 hover:bg-indigo-600 transition-all text-white px-4 py-2 rounded-lg uppercase tracking-widest shadow-sm">
            <Swords size={12} />
            <span className="hidden sm:inline">New Test</span>
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-20">
        {/* ── Hero Header ── */}
        {/* ── Hero Header ── */}
        <div className="text-center mb-16">
          {/* The New Awesome Status Strip */}
          <div className="inline-flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mb-6 px-4 py-2 bg-gray-900 rounded-2xl shadow-xl shadow-indigo-100">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            </div>

            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.2em]">
              Top 10 Toppers of Saharanpur
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-4 leading-[0.85]">
            Saharanpur
            <br />
            <span className="text-indigo-600">Toppers</span>
          </h1>

          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-gray-400 text-sm md:text-base font-bold uppercase tracking-[0.3em]">
              The Definitive Merit List
            </p>
            <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed">
              Every rank you ignore is a spot someone else is claiming right
              now.
              <span className="block text-indigo-600 font-black text-2xl mt-2 tracking-tight italic">
                "Where exactly do you stand today?"
              </span>
            </p>
          </div>
        </div>

        {/* ── Leaderboard Card ── */}
        <div className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-2xl shadow-gray-200/50">
          {/* Column headers - CLEAN & VISIBLE */}
          <div
            className="grid items-center px-6 md:px-10 py-5 bg-gray-900 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]"
            style={{ gridTemplateColumns: "60px 1fr 150px 80px" }}
          >
            <div className="text-center">Rank</div>
            <div>The Competition</div>
            <div className="text-center hidden sm:block">Overtake Goal</div>
            <div className="text-right">Score</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-100">
            {processedData.map((user, index) => {
              const rank = index + 1;
              const gap = getGapConfig(user.pointsToNext);
              const isTopper = rank === 1;

              return (
                <div
                  key={user.id}
                  className={`grid items-center px-6 md:px-10 py-5 transition-all hover:bg-gray-50/80 ${user.isCurrentUser ? "bg-indigo-50/40 border-l-4 border-l-indigo-600" : ""}`}
                  style={{ gridTemplateColumns: "60px 1fr 150px 80px" }}
                >
                  {/* Rank & Trend */}
                  <div className="flex flex-col items-center gap-1">
                    <RankBadge rank={rank} />
                    <TrendIcon trend={user.trend} />
                  </div>

                  {/* Candidate */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative flex-shrink-0">
                    <Image
 src={user.image}
 alt={user.name}
 width={56}
 height={56}
                        className={`rounded-full object-cover shadow-sm ${isTopper ? "w-14 h-14 ring-2 ring-yellow-400 ring-offset-2" : "w-11 h-11 border border-gray-100"}`}
                      />
                      {isTopper && (
                        <Zap
                          size={14}
                          className="absolute -top-1 -right-1 text-yellow-500 fill-yellow-500"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-sm md:text-base truncate ${user.isCurrentUser ? "text-indigo-700" : "text-gray-900"}`}
                        >
                          {user.name}
                        </span>
                        {user.isCurrentUser && (
                          <span className="bg-indigo-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full tracking-widest uppercase">
                            You
                          </span>
                        )}
                      </div>
                      <ScoreBar
                        score={user.score}
                        max={topScore}
                        isUser={user.isCurrentUser}
                      />
                    </div>
                  </div>

                  {/* Overtake Goal - Psychological Drive */}
                  <div className="justify-center hidden sm:flex">
                    {isTopper ? (
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-100">
                        Lead Defender
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-lg border transition-all ${gap.bg} ${gap.text} ${gap.border}`}
                      >
                        <Target size={12} strokeWidth={3} />
                        {gap.label}
                      </span>
                    )}
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <span
                      className={`font-black tabular-nums ${isTopper ? "text-2xl text-gray-900" : "text-lg text-gray-700"}`}
                    >
                      {user.score}
                    </span>
                    <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                      Points
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Card */}
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">
              Next Refresh: <span className="text-indigo-600">60:00 mins</span>
            </p>
            <button className="text-[11px] font-black text-gray-900 hover:text-indigo-600 transition-colors flex items-center gap-2 uppercase tracking-[0.2em]">
              View Full History →
            </button>
          </div>
        </div>

        {/* ── Bottom Stats ── */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 text-center shadow-sm">
            <div className="text-2xl mb-1 text-gray-900 font-black tracking-tighter">
              1,200+
            </div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Global Challengers
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 text-center shadow-sm">
            <div className="text-2xl mb-1 text-indigo-600 font-black tracking-tighter">
              7 XP
            </div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Avg. Gap to Top 3
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 text-center shadow-sm">
            <div className="text-2xl mb-1 text-gray-900 font-black tracking-tighter">
              Sun 9 AM
            </div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Grand Final Test
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
