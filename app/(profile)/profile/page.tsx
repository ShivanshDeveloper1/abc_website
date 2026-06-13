"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/context/AuthContext"; // Adjust path to your auth context

import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Zap, Flame, Target, TrendingUp, BookOpen, 
  ChevronDown, ArrowRight, Activity, Award, Clock
} from "lucide-react";
import { getUserProfileData } from "@/lib/actions/(profile)/profile";

// --- Circular Progress Component ---
const CircularProgress = ({ progress, size = 120, strokeWidth = 8 }: { progress: number, size?: number, strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle className="text-gray-100" strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
      <motion.circle
        className="text-blue-600"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
    </svg>
  );
};

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (user?.id) {
        const res = await getUserProfileData(user.id);
        if (res.success) {
          setProfileData(res.data);
        }
      }
      setLoading(false);
    }
    if (isLoaded) loadData();
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Section 8: Empty State
  if (!profileData?.history?.length) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center border border-white">
          <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-16 h-16 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Tests Attempted Yet</h2>
          <p className="text-slate-500 mb-8">Start your learning journey by taking your first mock test. Your analytics will appear here.</p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            Start First Test
          </button>
        </motion.div>
      </div>
    );
  }

  const { stats, history, metrics } = profileData;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-20 relative overflow-hidden mt-20">
      {/* Ambient Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        
        {/* SECTION 1: PROFILE HERO */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 mb-8 flex flex-col md:flex-row items-center gap-10"
        >
          <div className="relative flex-shrink-0">
            <CircularProgress progress={metrics.accuracy} size={140} strokeWidth={6} />
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={user?.imageUrl || "https://ui-avatars.com/api/?name=" + user?.fullName} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-sm" />
            </div>
          </div>
          
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-3">
              {user?.fullName}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                <Trophy className="w-4 h-4" /> Rank #42
              </span>
              <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                <Zap className="w-4 h-4" /> {stats.totalScore} XP
              </span>
              <span className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-sm font-semibold">
                <Flame className="w-4 h-4" /> 7 Day Streak
              </span>
            </div>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto bg-slate-50 p-6 rounded-2xl border border-slate-100 flex gap-8 justify-center">
            <div className="text-center">
              <p className="text-slate-500 text-sm font-medium mb-1">Avg Score</p>
              <p className="text-2xl font-bold text-slate-800">{Math.round((stats.totalScore / stats.totalMaxScore) * 100 || 0)}%</p>
            </div>
            <div className="w-px bg-slate-200"></div>
            <div className="text-center">
              <p className="text-slate-500 text-sm font-medium mb-1">Total Correct</p>
              <p className="text-2xl font-bold text-slate-800">{metrics.totalCorrect}</p>
            </div>
          </div>
        </motion.div>

        {/* SECTION 2: QUICK STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { title: "Tests Completed", value: stats.quizzesAttempted, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
            { title: "Accuracy", value: `${metrics.accuracy}%`, icon: Target, color: "text-purple-600", bg: "bg-purple-50" },
            { title: "Highest Score", value: metrics.highestScore, icon: Award, color: "text-emerald-600", bg: "bg-emerald-50" },
            { title: "Improvement", value: "+12%", subtitle: "this month", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
          ].map((stat, i) => (
            <motion.div 
              key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white/70 backdrop-blur-md border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-slate-500 font-medium">{stat.title}</h3>
              </div>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                {stat.subtitle && <p className="text-sm text-slate-400 mb-1">{stat.subtitle}</p>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* SECTION 4: TEST RESULT HISTORY */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" /> My Test Results
          </h2>
          <div className="space-y-4">
            {history.map((test: any, index: number) => {
              const isExpanded = expandedId === test._id;
              const testAccuracy = Math.round((test.correctCount / (test.correctCount + test.incorrectCount + test.unattemptedCount)) * 100) || 0;
              const status = testAccuracy >= 80 ? "Excellent" : testAccuracy >= 60 ? "Good" : "Needs Practice";
              const statusColors = {
                "Excellent": "bg-emerald-100 text-emerald-700",
                "Good": "bg-blue-100 text-blue-700",
                "Needs Practice": "bg-orange-100 text-orange-700"
              }[status];

              return (
                <motion.div 
                  key={test._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                >
                  {/* Row Header (Clickable) */}
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : test._id)}
                    className="p-6 cursor-pointer hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row items-center gap-6"
                  >
                    <div className="flex-grow w-full md:w-auto">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                          Mock Test
                        </span>
                        <span className="text-sm text-slate-400 flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {new Date(test.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">{test.testTitle}</h3>
                    </div>

                    <div className="flex items-center gap-8 w-full md:w-auto">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-slate-800">{test.score} <span className="text-sm text-slate-400 font-medium">/ {test.maxScore}</span></p>
                      </div>
                      
                      <div className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${statusColors}`}>
                        {status}
                      </div>

                      <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors">
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-100 bg-slate-50/50"
                      >
                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                          {/* Attempt Details */}
                          <div className="col-span-2 space-y-4">
                            <h4 className="font-semibold text-slate-800">Attempt Details</h4>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
                                <p className="text-emerald-500 text-xl font-bold">{test.correctCount}</p>
                                <p className="text-xs text-slate-500 font-medium uppercase mt-1">Correct</p>
                              </div>
                              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
                                <p className="text-red-500 text-xl font-bold">{test.incorrectCount}</p>
                                <p className="text-xs text-slate-500 font-medium uppercase mt-1">Incorrect</p>
                              </div>
                              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
                                <p className="text-slate-400 text-xl font-bold">{test.unattemptedCount}</p>
                                <p className="text-xs text-slate-500 font-medium uppercase mt-1">Skipped</p>
                              </div>
                            </div>
                            
                            {/* Progress Bar Visualization */}
                            <div className="h-3 w-full bg-slate-200 rounded-full flex overflow-hidden mt-6">
                              <div style={{ width: `${(test.correctCount / test.maxScore) * 100}%` }} className="bg-emerald-500"></div>
                              <div style={{ width: `${(test.incorrectCount / test.maxScore) * 100}%` }} className="bg-red-500"></div>
                            </div>
                          </div>

                          {/* Call to Action / Analysis */}
                          <div className="flex flex-col justify-center items-center border-l border-slate-200 pl-8">
                            <CircularProgress progress={testAccuracy} size={100} strokeWidth={8} />
                            <p className="mt-2 text-sm font-medium text-slate-500">Accuracy</p>
                            <button className="mt-6 w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl font-medium hover:bg-blue-600 transition-colors">
                              View Full Analysis <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}