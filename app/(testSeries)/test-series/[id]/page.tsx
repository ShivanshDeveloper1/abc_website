"use client";

import React, { useEffect } from "react";
import { useQuiz } from "@/context/QuizContext";
import { useParams, useRouter } from "next/navigation";
import { Clock, CheckCircle2, Play, Loader2, BookOpen, AlertCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import { useUser } from "@/context/AuthContext";
import { toast } from "sonner";

export default function QuizSessionPage() {
  const { id } = useParams();
  const router = useRouter();
  const { quizData, loading, fetchQuiz } = useQuiz();
  const { user, isLoaded } = useUser();

  // 1. Fetch quiz data when ID is available
  useEffect(() => {
    if (id) {
      fetchQuiz(id as string);
    }
  }, [id, fetchQuiz]);

  // 2. Handle unauthorized users safely inside a useEffect hook
  useEffect(() => {
    if (isLoaded && !user) {
      toast.error("Please login to start the test");
      router.push("/login");
    }
  }, [isLoaded, user, router]);

  // 3. Clean Loading State (Wait for both Quiz data and User auth to finish checking)
  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin mb-4" />
        <p className="font-medium text-gray-500 animate-pulse text-center">Loading Test Data...</p>
      </div>
    );
  }

  // 4. Clean Error/Missing State
  if (!quizData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Quiz not found</h2>
        <p className="text-gray-500 mt-2 max-w-sm text-sm sm:text-base">
          The test you are looking for does not exist or has been removed.
        </p>
        <button 
          onClick={() => router.back()} 
          className="mt-6 px-6 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>
    );
  }

  // Safeguard layout wrapper if user object hasn't settled yet
  if (!user) return null;

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 120 } }
  };

  // Fixed handler function
  const handleStartQuiz = () => {
    if (!isLoaded) return; // Fixed variable name here
    if (!user) {
      alert('Please login first to start the test');
      router.push('/login');
      return;
    }
    router.push(`/test-series/${id}/quiz`);
  };

  return (
    <div className="min-h-screen bg-white pt-24 sm:pt-32 pb-16 px-4 w-full">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
      >
        {/* Header Section */}
        <div className="p-6 sm:p-10 border-b border-gray-100">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-md text-xs sm:text-sm font-semibold mb-4 border border-red-100">
            <BookOpen size={14} />
            <span>Test Series</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            {quizData.title}
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            {quizData.overview}
          </p>
        </div>

        <div className="p-6 sm:p-10">
          {/* Stats Grid */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-full">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Duration</p>
                <p className="text-lg font-bold text-gray-900">{quizData.duration} Mins</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-full">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Total Marks</p>
                <p className="text-lg font-bold text-gray-900">{quizData.totalMarks} Points</p>
              </div>
            </div>
          </div>

          {/* Instructions List */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
               Important Instructions
            </h2>
            <motion.ul 
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
              className="space-y-4"
            >
              {quizData.instructions?.map((inst: string, index: number) => (
                <motion.li 
                  variants={itemVariants} 
                  key={index} 
                  className="flex gap-4 text-gray-600 text-sm sm:text-base leading-relaxed"
                >
                  <span className="flex-shrink-0 mt-0.5 text-red-500 font-bold">
                    {index + 1}.
                  </span>
                  <span>{inst}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleStartQuiz}
            className="w-full bg-red-600 cursor-pointer hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-3"
          >
            <Play size={20} fill="currentColor" />
            <span>I am ready to Begin</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}