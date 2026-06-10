"use client";
import React, { useMemo, useEffect, useState } from "react";
import { Trophy, Medal, TrendingUp, TrendingDown, Minus, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";

// --- LOGIC FROM ARENA PRO ---
const calculateNearMiss = (data) => {
  const sorted = [...data].sort((a, b) => b.score - a.score);
  return sorted.map((user, i) => ({
    ...user,
    pointsToNext: i === 0 ? 0 : sorted[i - 1].score - user.score,
  }));
};

const getGapConfig = (points) => {
  if (points <= 5) return { bg: "bg-red-100", text: "text-red-700", label: "SO CLOSE" };
  if (points <= 15) return { bg: "bg-amber-100", text: "text-amber-700", label: `${points} XP AWAY` };
  return { bg: "bg-gray-100", text: "text-gray-500", label: `${points} XP BEHIND` };
};

const TrendIcon = ({ trend }) => {
  if (trend === "up") return <TrendingUp size={14} className="text-emerald-500 md:w-4 md:h-4" />;
  if (trend === "down") return <TrendingDown size={14} className="text-red-500 md:w-4 md:h-4" />;
  return <Minus size={14} className="text-gray-300 md:w-4 md:h-4" />;
};

const LeaderBoard = ({ currentUserId }) => {
  const [rawData, setRawData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCHING DATA ---
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        const dbData = await response.json();

        const formattedData = dbData.map((user) => ({
          id: user.userId,
          name: user.name,
          score: user.totalScore,
          trend: user.trend || "same",
          isCurrentUser: user.userId === currentUserId,
          image: user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&bold=true`
        }));

        setRawData(formattedData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboardData();
  }, [currentUserId]);

  const processedData = useMemo(() => calculateNearMiss(rawData).slice(0, 3), [rawData]);

  if (isLoading) {
    return (
      // FIXED: Adjusted max-width here for the skeleton loader
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden max-w-sm sm:max-w-md md:max-w-lg w-full mx-auto transition-all">
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-16 md:h-20 animate-pulse"></div>
        <div className="p-4 md:p-5 flex flex-col gap-2.5 md:gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-2.5 md:p-3 rounded-2xl border border-gray-50 bg-gray-50/30 animate-pulse">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded-full"></div>
                <div className="flex items-center gap-2.5 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-1.5 md:space-y-2">
                    <div className="w-20 md:w-28 h-3 md:h-3.5 bg-gray-200 rounded-md"></div>
                    <div className="w-12 md:w-16 h-2 md:h-2.5 bg-gray-200 rounded-md"></div>
                  </div>
                </div>
              </div>
              <div className="w-10 md:w-14 h-6 md:h-7 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
    {/* FIXED: Replaced 3xl/4xl with sm:max-w-md md:max-w-lg to prevent awkward stretching on laptops */}
    <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 overflow-hidden max-w-sm sm:max-w-md md:max-w-lg w-full mx-auto transition-all duration-300">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 p-4 md:p-5 flex items-center justify-between relative overflow-hidden group cursor-default">
        <div className="relative z-10 flex items-center gap-3 md:gap-4">
          <div className="bg-white/20 p-2 md:p-2.5 rounded-xl backdrop-blur-md border border-white/10 shadow-inner">
            <Trophy className="text-yellow-300 drop-shadow-md w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div className="flex flex-col">
            <div className="flex gap-2 items-center">
              <h2 className="text-[15px] md:text-lg font-extrabold text-white uppercase tracking-tight drop-shadow-sm">Weekly Top 3</h2>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
              <p className="text-indigo-100 text-[10px] md:text-xs font-bold uppercase tracking-wider">Live Arena</p>
            </div>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute -right-6 -top-6 md:-right-8 md:-top-8 w-24 h-24 md:w-32 md:h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500"></div>
        <div className="absolute -bottom-10 -left-10 md:-bottom-12 md:-left-12 w-32 h-32 md:w-48 md:h-48 bg-purple-400 opacity-20 rounded-full blur-3xl"></div>
      </div>

      {/* List Items */}
      <div className="p-4 md:p-5 flex flex-col gap-2.5 md:gap-3 bg-gray-50/40 relative">
        {processedData.map((user, index) => {
          const rank = index + 1;
          const gap = getGapConfig(user.pointsToNext);
          const isFirst = rank === 1;

          return (
            <div
              key={user.id}
              className={`group relative flex items-center justify-between p-2.5 md:p-3.5 rounded-2xl md:rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                isFirst 
                ? "bg-gradient-to-r from-yellow-50 to-white border border-yellow-200 shadow-[0_4px_20px_-5px_rgba(253,224,71,0.4)] z-10" 
                : user.isCurrentUser 
                ? "bg-indigo-50/80 border border-indigo-200 shadow-sm" 
                : "bg-white border border-gray-100 hover:border-gray-200"
              }`}
            >
              {/* Rank & User Info */}
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-6 md:w-8 flex flex-col items-center justify-center font-bold gap-1 drop-shadow-sm">
                  {isFirst ? <Medal className="text-yellow-500 drop-shadow-md w-6 h-6 md:w-7 md:h-7" /> : 
                   rank === 2 ? <Medal className="text-slate-400 w-5 h-5 md:w-6 md:h-6" /> :
                   rank === 3 ? <Medal className="text-orange-500 w-5 h-5 md:w-6 md:h-6" /> :
                   <span className="text-md md:text-lg text-gray-300">#{rank}</span>}
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                  <div className="relative transform transition-transform group-hover:scale-105">
                    <img
                      src={user.image}
                      alt={user.name}
                      className={`object-cover rounded-full border-2 ${isFirst ? "w-11 h-11 md:w-12 md:h-12 border-yellow-400 shadow-sm" : "w-9 h-9 md:w-10 md:h-10 border-white shadow-sm"}`}
                    />
                    {isFirst && (
                      <div className="absolute -top-1.5 -right-1.5 md:-top-1.5 md:-right-1.5 bg-white rounded-full p-0.5 shadow-sm">
                        <Zap size={10} className="text-yellow-500 fill-yellow-500 md:w-3 md:h-3" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col transform transition-transform group-hover:translate-x-1">
                    <p className={`font-extrabold text-[13px] md:text-sm flex items-center gap-1.5 md:gap-2 ${isFirst ? "text-gray-900" : user.isCurrentUser ? "text-indigo-700" : "text-gray-800"}`}>
                      {user.name}
                      <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                        <TrendIcon trend={user.trend} />
                      </span>
                    </p>
                    
                    {/* Overtake Goal */}
                    <div className="flex items-center gap-2 mt-0.5">
                      {rank > 1 && (
                        <span className={`text-[8px] md:text-[9px] font-black w-fit px-1.5 py-0.5 md:px-2 md:py-0.5 rounded md:rounded uppercase shadow-sm border border-black/5 ${gap.bg} ${gap.text}`}>
                          {gap.label}
                        </span>
                      )}
                      {isFirst && (
                        <span className="text-[9px] md:text-[10px] font-bold text-yellow-600 uppercase">
                          Current Champion
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Score Box */}
              <div className={`font-black text-xs md:text-sm px-2.5 py-1.5 md:px-3.5 md:py-2 rounded-lg border shadow-sm transition-transform group-hover:scale-105 ${
                isFirst ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-950 border-yellow-500" :
                user.isCurrentUser ? "bg-indigo-600 text-white border-indigo-700" :
                "bg-gray-50 text-gray-700 border-gray-200"
              }`}>
                {user.score}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 md:p-4 bg-white border-t border-gray-100">
        <Link href="/saharanpur-toppers" className="block w-full">
          <button className="group w-full flex items-center justify-center gap-1.5 py-2 md:py-2.5 text-[12px] md:text-[13px] font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300 uppercase tracking-widest shadow-sm">
            Explore Saharanpur Rankings
            <ChevronRight size={16} className="transform transition-transform group-hover:translate-x-1.5" />
          </button>
        </Link>
      </div>
    </div>
    </>
  );
};

export default LeaderBoard;