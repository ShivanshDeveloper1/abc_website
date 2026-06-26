"use client";
import React, { useEffect, useState, useMemo } from "react";
import { 
  Eye, 
  Lock, 
  Clock, 
  Loader2, 
  AlertCircle, 
  Layers, 
  Dna, 
  Atom, 
  ClipboardList, 
  GraduationCap,
  Languages // Added for the language badge
} from "lucide-react";
import Link from "next/link";

// Upgraded configuration with gradients, glowing shadows, and ring offsets
const getCategoryConfig = (examType: string) => {
  const type = examType?.toUpperCase();
  
  switch (type) {
    case "ALL":
      return {
        label: "All Exams",
        icon: Layers,
        activeClass: "bg-gradient-to-r from-red-900 to-red-800 border-transparent text-white shadow-md shadow-gray-900/20 ring-2 ring-gray-900 ring-offset-2 ring-offset-white",
        inactiveClass: "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm",
        iconColor: "text-gray-500"
      };
    case "NEET":
      return {
        label: "NEET",
        icon: Dna,
        activeClass: "bg-gradient-to-r from-emerald-500 to-emerald-600 border-transparent text-white shadow-md shadow-emerald-500/30 ring-2 ring-emerald-500 ring-offset-2 ring-offset-white",
        inactiveClass: "bg-white border-emerald-100 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50",
        iconColor: "text-emerald-500"
      };
    case "JEE":
      return {
        label: "JEE",
        icon: Atom,
        activeClass: "bg-gradient-to-r from-blue-500 to-blue-600 border-transparent text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-500 ring-offset-2 ring-offset-white",
        inactiveClass: "bg-white border-blue-100 text-blue-700 hover:border-blue-300 hover:bg-blue-50",
        iconColor: "text-blue-500"
      };
    default:
      return {
        label: examType,
        icon: ClipboardList,
        activeClass: "bg-gradient-to-r from-rose-500 to-red-600 border-transparent text-white shadow-md shadow-red-500/30 ring-2 ring-red-500 ring-offset-2 ring-offset-white",
        inactiveClass: "bg-white border-rose-100 text-rose-700 hover:border-rose-300 hover:bg-rose-50",
        iconColor: "text-rose-500"
      };
  }
};

const TestSeries = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  
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

  const categories = useMemo(() => {
    const types = quizzes.map((q) => q.examType).filter(Boolean);
    return ["All", ...Array.from(new Set(types))];
  }, [quizzes]);

  const filteredQuizzes = useMemo(() => {
    if (activeFilter === "All") return quizzes;
    return quizzes.filter((q) => q.examType?.toLowerCase() === activeFilter?.toLowerCase());
  }, [activeFilter, quizzes]);

  const getCategoryCount = (catName: string) => {
    if (catName === "All") return quizzes.length;
    return quizzes.filter((q) => q.examType?.toLowerCase() === catName?.toLowerCase()).length;
  };

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
      <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500">
        <Loader2 className="animate-spin mb-2 text-red-600" size={28} />
        <p className="text-sm font-medium">Loading Quizzes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <AlertCircle size={32} className="mb-2 text-gray-300" />
        <p className="text-sm font-medium text-gray-500">Failed to load tests.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* UPGRADED CATEGORY SELECTOR */}
      <div className="space-y-4 bg-white/50 p-4 rounded-2xl border border-gray-100/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-gray-800 text-sm font-black uppercase tracking-widest">
          <GraduationCap size={18} className="text-red-500" />
          <span>Select Category</span>
        </div>
        
        {/* Switched from Grid to Flex-Wrap for organic pill layout */}
        <div className="flex flex-wrap items-center gap-3">
          {categories.map((cat) => {
            const config = getCategoryConfig(cat);
            const IconComponent = config.icon;
            const isActive = activeFilter?.toLowerCase() === cat?.toLowerCase();
            const count = getCategoryCount(cat);

            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`group flex items-center justify-between gap-3 px-4 py-2.5 rounded-full border text-xs font-bold transition-all duration-300 ease-out select-none hover:-translate-y-0.5 ${
                  isActive ? config.activeClass : config.inactiveClass
                }`}
              >
                <div className="flex items-center gap-2">
                  <IconComponent 
                    size={16} 
                    className={`transition-colors duration-300 ${isActive ? "text-white" : config.iconColor}`} 
                  />
                  <span>{config.label}</span>
                </div>
                
                {/* Beautiful dynamic badge */}
                <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-black rounded-full transition-colors duration-300 ${
                  isActive 
                    ? "bg-white/25 text-white" 
                    : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* QUIZ LIST GRID */}
      <div className="space-y-6">
        {filteredQuizzes.length > 0 ? (
          // CHANGED: Added lg:grid-cols-3 here so it doesn't get too wide on laptops
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
         {filteredQuizzes.map((item: any) => {
  // 1. Define our conditions
  const isLive = item.createdAt ? now >= new Date(item.createdAt) : true;
  const isFrozen = item.isLocked === true; // Reads the lock status from the DB

  return (
    <div
      key={item._id}
      // 2. Add an opacity change if the test is frozen
      className={`group relative bg-white rounded-2xl border transition-all duration-300 ${
        isFrozen
          ? "border-red-100 bg-red-50/20 opacity-80" // Styling for locked state
          : isLive
            ? "border-gray-200/80 hover:border-red-200 hover:-translate-y-1.5 hover:shadow-[0_16px_32px_-4px_rgba(239,68,68,0.06),0_4px_12px_-2px_rgba(0,0,0,0.02)]"
            : "border-gray-100 bg-gray-50/40 opacity-80 grayscale-[15%]"
      }`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
          
          {/* 3. Status Badge Logic */}
          {isFrozen ? (
            <div className="flex items-center gap-2 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              <span className="text-[10px] font-black uppercase tracking-wider text-red-700">
                Admin Locked
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
              <span className="relative flex h-2 w-2">
                {isLive && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? "bg-emerald-500" : "bg-amber-400"}`}></span>
              </span>
              <span className={`text-[10px] font-black uppercase tracking-wider ${isLive ? "text-emerald-700" : "text-amber-700"}`}>
                {isLive ? "Live" : "Upcoming"}
              </span>
            </div>
          )}
          
          {/* Right: Metadata Badges */}
          <div className="flex items-center gap-1.5">


            {/* ADD THIS NEW BADGE FOR CLASS LEVEL */}
  {item.classLevel && (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-blue-50/60 text-blue-700 border border-blue-100/80 uppercase tracking-wide">
      {item.classLevel}
    </span>
  )}
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-indigo-50/60 text-indigo-700 border border-indigo-100/80 uppercase tracking-wide">
              <Languages size={11} className="text-indigo-500" />
              {item.language || "English"}
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 uppercase border border-gray-200/60 tracking-wide">
              {item.examType || "Mock Test"}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className={`text-lg font-extrabold mb-3 leading-snug transition-colors duration-200 line-clamp-2 ${isFrozen ? 'text-gray-500' : 'text-gray-900 group-hover:text-red-600'}`}>
          {item.title}
        </h3>

        {/* Operational Clock Details */}
        <div className="flex items-center text-xs font-semibold text-gray-500 mb-6 bg-gray-50/80 w-fit px-3 py-1.5 rounded-lg border border-gray-100/70">
          <Clock size={14} className="mr-2 text-gray-400" />
          <span>
            {isLive ? "Started: " : "Unlocks: "} 
            <span className="text-gray-800 font-medium">{formatFullDate(item.createdAt)}</span>
          </span>
        </div>

        {/* 4. Dynamic Action Button Logic */}
        {isFrozen ? (
           <button 
             disabled
             className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-400 py-3 rounded-xl text-sm font-bold border border-red-200 cursor-not-allowed"
           >
             <Lock size={16} />
             Temporarily Disabled
           </button>
        ) : isLive ? (
          <Link
            href={`/test-series/${item._id}`}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-800 to-red-900 text-white py-3 rounded-xl hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 text-sm font-bold tracking-wide active:scale-[0.98]"
          >
            <Eye size={16} />
            Start Test Now
          </Link>
        ) : (
          <div className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-400 py-3 rounded-xl text-sm font-bold border border-gray-200/60 cursor-not-allowed">
            <Lock size={16} />
            Unlocks {formatShortDate(item.createdAt)}
          </div>
        )}
      </div>
    </div>
  );
})}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center bg-gray-50/40 rounded-3xl border-2 border-dashed border-gray-200 max-w-xl mx-auto">
            <div className="p-4 bg-gray-100 rounded-2xl mb-4 text-gray-400 border border-gray-200/40">
              <ClipboardList size={32} />
            </div>
            <h4 className="text-base font-bold text-gray-800 mb-1">No Tests Available</h4>
            <p className="text-gray-500 text-sm font-medium">We couldn't find any tests matching "{activeFilter}".</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSeries;