import React from "react";
import { AllStudents } from "@/lib/actions/(admin)/Students";
import { ChevronDown, BookOpen } from "lucide-react"; // Make sure lucide-react is installed

export const dynamic = "force-dynamic"; 

const Page = async () => {
  // We now get an array of users, and each user has a .quizzes array
  const groupedStudents = await AllStudents();

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-screen">
        
      {/* Header */}
      <div className="mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-900">Recent Submissions</h1>
        <p className="text-slate-500 mt-1 font-medium">Grouped by student. Click a student to expand their tests.</p>
      </div>

      {/* Handle empty state */}
      {groupedStudents.length === 0 ? (
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center">
          <p className="text-slate-500 font-medium">No results found or database error.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedStudents.map((student, index) => (
            <details
              key={student.userId}
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md [&_summary::-webkit-details-marker]:hidden"
            >
              
              {/* THE MAIN ROW (Profile Info) */}
              <summary className="flex flex-col sm:flex-row sm:items-center justify-between p-5 cursor-pointer list-none gap-4">
                
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-300 w-6">
                    {index + 1}
                  </span>

                  {student.userImage ? (
                    <img
                      src={student.userImage}
                      alt={student.userName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg shrink-0">
                      {student.userName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h2 className="text-slate-900 font-bold text-lg">{student.userName}</h2>
                    <p className="text-slate-500 text-sm font-medium mt-0.5">
                      {student.quizzes.length} {student.quizzes.length === 1 ? "Recent Test" : "Recent Tests"}
                    </p>
                  </div>
                </div>

                {/* Arrow Icon that rotates when opened */}
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-open:rotate-180 transition-transform duration-300 ml-auto">
                  <ChevronDown size={20} />
                </div>
              </summary>

              {/* THE DROPDOWN LIST (Individual Quizzes) */}
              <div className="bg-slate-50 p-5 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BookOpen size={14} className="text-indigo-400" />
                  Test History
                </h4>
                
                <div className="grid gap-3">
                  {student.quizzes.map((quiz: any) => (
                    <div 
                      key={quiz._id} 
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-colors"
                    >
                      <div>
                        <p className="text-slate-800 font-bold text-md">{quiz.testTitle}</p>
                        {quiz.createdAt && (
                          <p className="text-slate-400 text-xs font-medium mt-1">
                            {new Date(quiz.createdAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 shrink-0">
                        <p className="text-emerald-600 font-black text-lg flex items-baseline gap-1">
                          {quiz.score} 
                          <span className="text-xs font-bold text-emerald-400/80">/ {quiz.maxScore}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
            </details>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;