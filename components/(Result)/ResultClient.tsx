"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Info,
  Home,
} from "lucide-react";
import { useQuiz } from "@/context/QuizContext";
import { saveTestResultAction } from "@/lib/actions/saveResult"; 

// 1. Import your Firebase Auth Context
import { useUser } from "@/context/AuthContext"; 

// You no longer need to pass isLoggedIn as a prop, the component can check it natively
const ResultClient = ({ testId }) => {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const { quizData } = useQuiz();
  
  // 2. Consume the Firebase User Context
  const { user, isLoaded } = useUser();

  const hasSaved = useRef(false);

  const questionsList = useMemo(() => {
    if (Array.isArray(quizData?.questions)) {
      return Array.isArray(quizData.questions[0]) ? quizData.questions[0] : quizData.questions;
    }
    return [];
  }, [quizData]);

  const testTitle = quizData?.title || "Test Result";

  useEffect(() => {
    const savedResultString = sessionStorage.getItem(`testResult-${testId}`);
    
    if (savedResultString) {
      const parsedResult = JSON.parse(savedResultString);
      setResult(parsedResult);

      // 3. Wait for Firebase to load before trying to save
      if (isLoaded && !hasSaved.current) {
        hasSaved.current = true; 
        
        // 4. Pass the Firebase user details directly into the server action
        saveTestResultAction(
          testId, 
          parsedResult, 
          testTitle, 
          user?.id || null, // Pass userId
          user || null      // Pass user profile
        ) 
        .then((res) => console.log("Database Sync:", res.message))
        .catch((err) => console.error("Database Sync Failed:", err));
      }
    } else {
      router.push(`/test-series/${testId}`);
    }
  }, [testId, router, isLoaded, user, testTitle]); // Added isLoaded and user to dependency array

  
  useEffect(()=> {
    window.history.pushState(null, "", window.location.href);

    const handleBackButton = () => {
      router.push("/test-series"); 
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [router])

  if (!result || questionsList.length === 0) {
    return (
      <div className="p-20 text-center font-bold text-slate-500">
        Generating Analysis...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/test-series")}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 font-medium transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Test Series
        </button>

        {/* SCORE BANNER */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Trophy size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">{testTitle}</h1>
              <p className="text-slate-500 font-medium">Performance Summary</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-4xl font-black text-indigo-600">
              {result.score} <span className="text-lg text-slate-400">/ {result.maxScore}</span>
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Final Score</p>
          </div>
        </div>

        {/* QUICK STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <StatCard icon={CheckCircle2} color="text-green-500" label="Correct" val={result.correctCount} />
          <StatCard icon={XCircle} color="text-red-500" label="Incorrect" val={result.incorrectCount} />
          <StatCard icon={AlertCircle} color="text-slate-400" label="Skipped" val={result.unattemptedCount} />
        </div>

        {/* SOLUTIONS SECTION */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            Detailed Solutions
            <span className="text-sm font-medium bg-slate-200 px-2 py-0.5 rounded text-slate-600">
              {questionsList.length} Questions
            </span>
          </h2>

          {questionsList.map((q, idx) => {
            const userPick = result.userAnswers[idx];
            const correctAnswer = q.correct_answer; 
            const isCorrect = userPick === correctAnswer;
            const isSkipped = userPick === undefined || userPick === null;

            return (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-indigo-200 transition-colors">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-sm">
                      Question {idx + 1}
                    </span>
                    {isSkipped ? (
                      <span className="text-xs font-bold text-slate-400">SKIPPED</span>
                    ) : isCorrect ? (
                      <span className="text-xs font-bold text-green-600">CORRECT (+4)</span>
                    ) : (
                      <span className="text-xs font-bold text-red-500">INCORRECT (-1)</span>
                    )}
                  </div>

                  <p className="text-lg font-semibold text-slate-800 mb-6">
                    {q.question_text}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {q.options?.map((opt, i) => {
                      const isThisCorrect = i === correctAnswer;
                      const isThisUserPick = i === userPick;

                      let borderStyle = "border-slate-100";
                      let bgStyle = "bg-slate-50/50";
                      if (isThisCorrect) borderStyle = "border-green-500 bg-green-50";
                      else if (isThisUserPick && !isCorrect) borderStyle = "border-red-200 bg-red-50";

                      return (
                        <div key={i} className={`p-4 rounded-xl border-2 flex items-center gap-3 ${borderStyle} ${bgStyle}`}>
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${isThisCorrect ? "bg-green-500 text-white" : "bg-slate-200 text-slate-500"}`}>
                            {String.fromCharCode(65 + i)}
                          </div>
                          <span className={`text-sm font-medium ${isThisCorrect ? "text-green-800" : "text-slate-600"}`}>
                            {opt}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100">
                      <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-2">
                        <Info size={16} /> Solution & Explanation
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex justify-center">
          <button
            onClick={() => router.push("/test-series")}
            className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95"
          >
            <Home size={20} /> Finish & Return Home
          </button>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ icon: Icon, color, label, val }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
    <div className={`h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-2xl font-black text-slate-800">{val}</p>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
    </div>
  </div>
);

export default ResultClient;