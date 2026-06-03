"use client";

import React, { useEffect } from "react";
import { useQuiz } from "@/context/QuizContext";
import { useParams, useRouter } from "next/navigation";
import { Clock, CheckCircle2, Play, Loader2, BookOpen, AlertCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function QuizSessionPage() {
  const { id } = useParams();
  const router = useRouter();
  const { quizData, loading, fetchQuiz } = useQuiz();

  useEffect(() => {
    if (id) {
      fetchQuiz(id as string);
    }
  }, [id, fetchQuiz]);

  // 1. Premium Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 px-4">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
        <p className="font-bold text-gray-500 animate-pulse text-center">Loading Test Data...</p>
      </div>
    );
  }

  // 2. Handle missing data
  if (!quizData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Quiz not found</h2>
        <p className="text-gray-500 mt-2 max-w-sm text-sm sm:text-base">
          The test you are looking for does not exist or has been removed.
        </p>
        <button 
          onClick={() => router.back()} 
          className="mt-6 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors flex items-center gap-2 text-sm shadow-md"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>
    );
  }

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 120 } }
  };

  return (
    // Responsive top padding (pt-24 for mobile, pt-32 for desktop) to handle dynamic navbar heights
    <div className="min-h-screen bg-slate-50/30 pt-24 sm:pt-32 pb-16 px-4 max-w-7xl mx-auto w-full">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto bg-white rounded-3xl sm:rounded-[2rem] shadow-xl sm:shadow-2xl overflow-hidden border border-gray-100 ring-1 ring-black/[0.03]"
      >
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-br from-red-600 via-red-600 to-red-800 p-6 xs:p-8 sm:p-12 text-white relative overflow-hidden">
          {/* Decorative background circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-32 -mb-16 w-40 h-40 rounded-full bg-black opacity-10 blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 shadow-sm border border-white/10">
              <BookOpen size={14} className="sm:w-[16px] sm:h-[16px]" />
              <span>Test Series</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black mb-3 sm:mb-4 leading-tight tracking-tight">
              {quizData.title}
            </h1>
            <p className="opacity-90 text-sm sm:text-lg max-w-xl leading-relaxed font-medium">
              {quizData.overview}
            </p>
          </div>
        </div>

        <div className="p-5 xs:p-8 sm:p-12">
          {/* Stats Grid - Stacked on tiny screens, side-by-side from 'xs' upwards */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-5 mb-8 sm:mb-10">
            {/* Duration Card */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
              <p className="text-gray-400 text-[10px] sm:text-xs uppercase font-bold tracking-wider mb-1.5 sm:mb-2">Duration</p>
              <div className="flex items-center gap-3 text-gray-900 font-black text-lg sm:text-xl">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Clock size={20} className="sm:w-[22px] sm:h-[22px]" />
                </div>
                <span>{quizData.duration} Mins</span>
              </div>
            </div>
            
            {/* Marks Card */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
              <p className="text-gray-400 text-[10px] sm:text-xs uppercase font-bold tracking-wider mb-1.5 sm:mb-2">Total Marks</p>
              <div className="flex items-center gap-3 text-gray-900 font-black text-lg sm:text-xl">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 size={20} className="sm:w-[22px] sm:h-[22px]" />
                </div>
                <span>{quizData.totalMarks} Points</span>
              </div>
            </div>
          </div>

          {/* Instructions List */}
          <div className="mb-8 sm:mb-10">
            <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
               Important Instructions
            </h2>
            <motion.ul 
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.08, delayChildren: 0.15 }}
              className="space-y-3 sm:space-y-4"
            >
              {quizData.instructions?.map((inst: string, index: number) => (
                <motion.li 
                  variants={itemVariants} 
                  key={index} 
                  className="flex gap-3 sm:gap-4 text-gray-600 text-sm sm:text-base leading-relaxed bg-gray-50/50 p-3 sm:p-4 rounded-xl border border-gray-100/70 shadow-sm"
                >
                  <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs sm:text-sm font-black shadow-sm">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 sm:pt-1 font-medium text-gray-700">{inst}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => router.push(`/test-series/${id}/quiz`)}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-lg sm:text-xl shadow-lg shadow-red-600/15 active:shadow-sm transition-all flex items-center justify-center gap-2.5 sm:gap-3 border border-red-500/10 tracking-wide"
          >
            <Play size={20} className="sm:w-[24px] sm:h-[24px] cursor-pointer" fill="currentColor" />
            <span>I am ready to Begin</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}