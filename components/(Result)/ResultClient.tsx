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
  Loader2,
} from "lucide-react";
import { useQuiz } from "@/context/QuizContext";
import { saveTestResultAction } from "@/lib/actions/saveResult"; 
import { useUser } from "@/context/AuthContext"; 
import ResultPopup from "./ResultPopup"; // <-- Import the new popup component

const ResultClient = ({ testId }) => {
  const router = useRouter();
  const [result, setResult] = useState(null);
  
  // State for popup visibility and variant type
  const [popupConfig, setPopupConfig] = useState({ show: false, type: null }); 

  const { quizData } = useQuiz();
  const { user, isLoaded } = useUser();
  const hasSaved = useRef(false);

  // Safely memoize the questions list
  const questionsList = useMemo(() => {
    if (Array.isArray(quizData?.questions)) {
      return Array.isArray(quizData.questions[0]) ? quizData.questions[0] : quizData.questions;
    }
    return [];
  }, [quizData]);

  const testTitle = quizData?.title || "Test Result";

  // Handle Fetching from Storage and Saving to DB
  // Handle Fetching from Storage and Saving to DB
  useEffect(() => {
    const savedResultString = sessionStorage.getItem(`testResult-${testId}`);
    
    if (!savedResultString) {
      router.replace(`/test-series/${testId}`);
      return;
    }

    const parsedResult = JSON.parse(savedResultString);
    setResult(parsedResult);

    if (isLoaded && user && !hasSaved.current) {
      hasSaved.current = true; 
      
      const userId = user?.id || user?.uid || null; 
      const userProfile = {
        fullName: user?.fullName || user?.displayName || "Anonymous", 
        imageUrl: user?.imageUrl || user?.photoURL || "",             
      };

      saveTestResultAction(
        testId, 
        parsedResult, 
        testTitle, 
        userId, 
        userProfile 
      ) 
      .then((res) => {
        console.log("Database Sync:", res);
        
        // PERFECTLY MATCHED LOGIC:
        if (res?.isFirstAttempt === false) {
          // It's the second time. Shows the Practice popup. 
          // (Change this to `show: false` if you want it to be completely silent)
          setPopupConfig({ show: true, type: "practice" }); 
        } else if (res?.isFirstAttempt === true) {
          // It's the first time. Shows the Saved popup.
          setPopupConfig({ show: true, type: "saved" });
        }
      })
      .catch((err) => console.error("Database Sync Failed:", err));
    }
  }, [testId, router, isLoaded, user, testTitle]);

  // Prevent Back Navigation to the active quiz
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handleBackButton = () => {
      router.replace("/test-series"); 
    };

    window.addEventListener("popstate", handleBackButton);
    return () => window.removeEventListener("popstate", handleBackButton);
  }, [router]);

  // Improved Loading State
  if (!result || questionsList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <p className="text-slate-500 font-bold tracking-wide">Generating Analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 md:px-8 relative overflow-hidden">
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
                    {(q.options || []).map((opt, i) => {
                      const isThisCorrect = i === correctAnswer;
                      const isThisUserPick = i === userPick;

                      let borderStyle = "border-slate-100 hover:bg-slate-50/80";
                      let bgStyle = "bg-slate-50/50";
                      
                      if (isThisCorrect) {
                        borderStyle = "border-green-500 bg-green-50";
                      } else if (isThisUserPick && !isCorrect) {
                        borderStyle = "border-red-200 bg-red-50";
                      }

                      return (
                        <div key={i} className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-colors ${borderStyle} ${bgStyle}`}>
                          <div className={`h-6 w-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${isThisCorrect ? "bg-green-500 text-white" : "bg-slate-200 text-slate-500"}`}>
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

      {/* --- REFACTORED CUSTOM POPUP COMPONENT --- */}
      <ResultPopup 
        isOpen={popupConfig.show} 
        type={popupConfig.type} 
        onClose={() => setPopupConfig({ show: false, type: null })} 
      />

    </section>
  );
};

const StatCard = ({ icon: Icon, color, label, val }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
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