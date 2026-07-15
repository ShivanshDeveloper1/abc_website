"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";

// --- LaTeX support -----------------------------------------------------
// Same renderer used on the admin "Create Quiz" page, so anything typed
// there (e.g. \(CO_{2}\)) renders correctly here for the student too.
import katex from "katex";
import "katex/dist/katex.min.css";

function LatexText({ text, className }: { text?: string | null; className?: string }) {
  if (!text) return null;

  const MATH_REGEX = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^$\n]+?\$)/g;
  const parts = text.split(MATH_REGEX).filter((part) => part !== undefined && part !== "");

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        let math: string | null = null;
        let displayMode = false;

        if (part.startsWith("$$") && part.endsWith("$$") && part.length >= 4) {
          math = part.slice(2, -2);
          displayMode = true;
        } else if (part.startsWith("\\[") && part.endsWith("\\]")) {
          math = part.slice(2, -2);
          displayMode = true;
        } else if (part.startsWith("\\(") && part.endsWith("\\)")) {
          math = part.slice(2, -2);
        } else if (part.startsWith("$") && part.endsWith("$") && part.length >= 2) {
          math = part.slice(1, -1);
        }

        if (math !== null) {
          let html = "";
          try {
            html = katex.renderToString(math, {
              throwOnError: false,
              displayMode,
              strict: false,
            });
          } catch {
            return (
              <span key={idx} className="text-red-500 font-mono text-xs">
                {part}
              </span>
            );
          }
          return displayMode ? (
            <span
              key={idx}
              className="block my-2 overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <span key={idx} dangerouslySetInnerHTML={{ __html: html }} />
          );
        }

        return (
          <span key={idx} style={{ whiteSpace: "pre-wrap" }}>
            {part}
          </span>
        );
      })}
    </span>
  );
}
// ------------------------------------------------------------------------

const QuizEngine = () => {
  const { quizData, loading } = useQuiz();
  const router = useRouter();

  // 1. Load saved progress from localStorage on initial render
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    if (typeof window !== "undefined" && quizData?._id) {
      const saved = localStorage.getItem(`quiz-progress-${quizData._id}`);
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  // FIXED: Added the missing curly brace for the if statement
  let questionsList = [];
  if (Array.isArray(quizData?.questions)) {
    if (Array.isArray(quizData.questions[0])) {
      questionsList = quizData.questions[0];
    } else {
      questionsList = quizData.questions;
    }
  }

  const totalQuestions = questionsList.length;
  const totalTimeInSeconds = (quizData?.duration || totalQuestions) * 60;
  
  const [timeLeft, setTimeLeft] = useState(totalTimeInSeconds);
  const latestAnswers = useRef(selectedAnswers);
  const hasSubmittedRef = useRef(false);
  const currentIndexRef = useRef(currentIndex);

  // Keep refs updated for background tasks
  useEffect(() => {
    latestAnswers.current = selectedAnswers;
  }, [selectedAnswers]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // 2. Auto-save every 15 seconds
  useEffect(() => {
    if (!quizData?._id) return;
    const saveInterval = setInterval(() => {
      if (Object.keys(latestAnswers.current).length > 0 && !hasSubmittedRef.current) {
        localStorage.setItem(
          `quiz-progress-${quizData._id}`,
          JSON.stringify(latestAnswers.current)
        );
      }
    }, 15000);
    return () => clearInterval(saveInterval);
  }, [quizData?._id]);

  // Define handleSubmitTest BEFORE the hooks that use it
  const handleSubmitTest = (forceSubmit = false) => {
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    const answersToProcess = latestAnswers.current;

    let correctCount = 0;
    let incorrectCount = 0;

    questionsList.forEach((question, index) => {
      const selectedOption = answersToProcess[index];
      if (selectedOption !== undefined) {
        if (selectedOption === question.correct_answer) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      }
    });

    const unattemptedCount = totalQuestions - (correctCount + incorrectCount);
    const score = correctCount * 4;

    const resultData = {
      score,
      correctCount,
      incorrectCount,
      unattemptedCount,
      totalQuestions,
      maxScore: totalQuestions * 4,
      userAnswers: answersToProcess,
    };

    latestAnswers.current = {}; 
    localStorage.removeItem(`quiz-progress-${quizData?._id}`);
    sessionStorage.setItem(`testResult-${quizData?._id}`, JSON.stringify(resultData));
    
    router.replace(`/test-series/${quizData?._id}/result?attempt=${Date.now()}`);
  };

  // Timer logic
  useEffect(() => {
    if (!quizData) return; 
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quizData]); 

  // 3. Anti-cheat and Window listeners 
  useEffect(() => {
    if (!quizData) return;

    window.history.pushState(null, "", window.location.href);
    
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      if (currentIndexRef.current > 0) {
        setCurrentIndex((prev) => prev - 1);
      } else {
        const leave = window.confirm("Warning: Leaving now will instantly submit your quiz. Continue?");
        if (leave) handleSubmitTest(true);
      }
    };

    const handleBeforeUnload = (e: any) => {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave?";
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !hasSubmittedRef.current) {
        alert("Cheating Protection: Test auto-submitted due to tab switch!");
        handleSubmitTest(true);
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [quizData, questionsList]); 

  // 4. Loading state early return
  if (loading || !quizData || questionsList.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">
        Loading Quiz Data...
      </div>
    );
  }

  const currentQuestion = questionsList[currentIndex];
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins} min ${secs < 10 ? `0${secs}` : secs} sec` : `${secs} sec`;
  };

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedAnswers((prev: any) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex(currentIndex + 1);
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  // REMOVED DUPLICATE TIMER AND EVENT LISTENER HOOKS THAT WERE PREVIOUSLY HERE

  return (
    <section
      className="min-h-screen bg-gradient-to-br mt-2 from-slate-50 to-slate-100 pt-20 pb-12 px-4 sm:px-6 lg:px-8 select-none"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        <div className="lg:col-span-3 order-1 lg:order-none">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
            <div className="h-1.5 w-full bg-slate-100">
              <div
                className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="p-5 sm:p-8 md:p-10 flex-1 flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                  {currentQuestion?.subject || "General"}
                </span>

                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-100 text-sm sm:text-base font-extrabold shadow-sm">
                  <Clock size={18} className="animate-pulse" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>

              <div className="mb-8 sm:mb-10">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">
                  <span className="text-indigo-600 mr-2 text-xl sm:text-2xl md:text-3xl">
                    Q{currentIndex + 1}.
                  </span>
                  <LatexText text={currentQuestion?.question_text} />
                </h2>

                {currentQuestion?.imageUrl && (
                  <div className="mt-6 flex justify-center">
                    <img 
                      src={currentQuestion.imageUrl} 
                      alt={`Question ${currentIndex + 1} illustration`} 
                      className="max-h-64 w-auto rounded-xl shadow-sm border border-slate-200 object-contain"
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-10 flex-1">
                {currentQuestion?.options?.map((opt: string, i: number) => {
                  const isSelected = selectedAnswers[currentIndex] === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(i)}
                      className={`group w-full flex items-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ease-in-out transform active:scale-[0.99] text-left ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/80 shadow-md shadow-indigo-100/50"
                          : "border-slate-100 hover:border-indigo-300 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-lg flex items-center justify-center font-bold mr-4 border transition-colors ${
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-slate-400 border-slate-200"
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span
                        className={`font-medium text-sm sm:text-base ${
                          isSelected ? "text-indigo-900" : "text-slate-700"
                        }`}
                      >
                        <LatexText text={opt} />
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-100 mt-auto">
                <button
                  onClick={prevQuestion}
                  disabled={currentIndex === 0}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-500 bg-slate-50 disabled:opacity-50"
                >
                  <ChevronLeft size={20} /> Previous
                </button>

                {currentIndex === totalQuestions - 1 ? (
                  <button
                    onClick={() => handleSubmitTest(false)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                  >
                    Submit Test <CheckCircle size={20} />
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  >
                    Save & Next <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 order-2 lg:order-none">
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-6 lg:top-28">
            <h3 className="font-bold text-slate-800 mb-4">Question Palette</h3>
            <div className="grid grid-cols-5 gap-2">
              {questionsList?.map((_: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-10 w-full rounded-lg flex items-center justify-center text-sm font-bold border transition-all ${
                    currentIndex === i ? "border-indigo-600 ring-2 ring-indigo-100" : "border-transparent"
                  } ${
                    selectedAnswers[i] !== undefined ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuizEngine;