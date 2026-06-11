"use client";
import QuizEngine from "@/components/(testseries)/QuizEngine";
import { useQuiz } from "@/context/QuizContext";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";

export default function QuizPage() {
  const params = useParams();
  const id = params?.id; 
  const { quizData, fetchQuiz, loading } = useQuiz();

  useEffect(() => {
    // Safety net: If they refresh the page directly here, fetch the data.
    // Otherwise, the Context uses the data from QuizSessionPage.
    if (id && id !== "undefined" && !quizData) {
      fetchQuiz(id as string);
    }
  }, [id, quizData, fetchQuiz]);

  if (!id || id === "undefined") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-red-100 shadow-xl shadow-red-500/5 max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto text-red-500 border border-red-100">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-lg font-black text-slate-900">Invalid Target ID</h2>
        </div>
      </div>
    );
  }

  if (loading || !quizData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-3">
          <div className="relative flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600 z-10" size={36} />
          </div>
          <p className="text-slate-800 text-sm font-black tracking-widest">Preparing Questions</p>
        </div>
      </div>
    );
  }

  return <QuizEngine />;
}