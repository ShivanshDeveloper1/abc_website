"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Eye, Lock, Clock, Loader2, AlertCircle, Filter } from "lucide-react";
import Link from "next/link";

const TestSeries = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All"); // State for the filter
  
  const now = new Date();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("/api/quiz");
        const data = await response.json();

        let quizArray = [];
        if (Array.isArray(data)) {
          quizArray = data;
        } else if (data && Array.isArray(data.quizzes)) {
          quizArray = data.quizzes;
        } else {
          setError(true);
          return;
        }
        setQuizzes(quizArray);
      } catch (err) {
        console.error("Error loading quizzes:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  // 1. DYNAMICALLY GET CATEGORIES: Extract unique examTypes/Classes from the data
  const categories = useMemo(() => {
    const types = quizzes.map((q) => q.examType).filter(Boolean);
    return ["All", ...Array.from(new Set(types))];
  }, [quizzes]);

  // 2. FILTER LOGIC: Filter the list based on selection
  const filteredQuizzes = useMemo(() => {
    if (activeFilter === "All") return quizzes;
    return quizzes.filter((q) => q.examType === activeFilter);
  }, [activeFilter, quizzes]);

  const formatFullDate = (dateString: string) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatShortDate = (dateString: string) => {
    if (!dateString) return "Soon";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Loader2 className="animate-spin mb-2 text-red-600" size={32} />
        <p className="font-medium">Loading Quizzes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <AlertCircle size={40} className="mb-2 opacity-20" />
        <p className="font-medium text-lg text-gray-500">Failed to load tests.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* FILTER TAGS SECTION */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-2 text-gray-500 text-sm font-bold uppercase tracking-wider">
          <Filter size={14} className="text-red-600" />
          <span>Filter by Category</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${
                activeFilter === cat
                  ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-200"
                  : "bg-white border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* QUIZ GRID */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
          {filteredQuizzes.map((item: any) => {
            const startDate = new Date(item.createdAt);
            const isLive = item.createdAt ? now >= new Date(item.createdAt) : true;

            return (
              <div
                key={item._id}
                className={`group relative bg-white rounded-2xl border transition-all duration-300 ${
                  isLive
                    ? "border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1"
                    : "border-gray-100 bg-gray-50/50 opacity-80"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-2.5 w-2.5 rounded-full ${
                          isLive ? "bg-emerald-500 animate-pulse" : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={`text-[11px] font-bold uppercase tracking-widest ${
                          isLive ? "text-emerald-600" : "text-gray-400"
                        }`}
                      >
                        {isLive ? "Live Now" : "Upcoming"}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-gray-100 text-gray-600 uppercase">
                      {item.examType || "Mock Test"} 
                    </span>
                  </div>

                <h3 className="text-lg font-black text-gray-900 mb-2 leading-snug  group-hover:text-red-600 transition-colors">
  {item.title}
</h3>

                  <div className="flex items-center text-sm text-gray-500 mb-8">
                    <Clock size={14} className="mr-2 text-red-500/70" />
                    <span className="font-medium">
                      {isLive ? "Started: " : "Unlocks: "} {formatFullDate(item.createdAt)}
                    </span>
                  </div>

                  {isLive ? (
                    <Link
                      href={`/test-series/${item._id}`}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white py-3.5 rounded-xl hover:shadow-lg hover:shadow-red-200 transition-all font-bold active:scale-[0.97]"
                    >
                      <Eye size={18} />
                      Start Test Now
                    </Link>
                  ) : (
                    <div className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-400 py-3.5 rounded-xl font-bold border border-gray-200 cursor-not-allowed">
                      <Lock size={16} />
                      Unlocks on {formatShortDate(item.createdAt)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">No tests found for "{activeFilter}"</p>
        </div>
      )}
    </div>
  );
};

export default TestSeries;