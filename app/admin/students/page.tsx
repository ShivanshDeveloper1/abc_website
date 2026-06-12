import React from "react";
import { AllStudents } from "@/lib/actions/(admin)/Students";

// This tells Next.js NOT to cache this page. 
// It will fetch fresh database records on every refresh.
export const dynamic = "force-dynamic"; 

const Page = async () => {
  const students = await AllStudents();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Students</h1>

      {/* Handle empty state gracefully */}
      {students.length === 0 ? (
        <p className="text-gray-400">No students found or database error.</p>
      ) : (
        <div className="grid gap-4">
          {students.map((user, index) => (
            <div
              key={user.userId} // If user.userId is ever undefined, use user._id
              className="flex items-center justify-between bg-gray-700 p-4 rounded-xl shadow"
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-400">
                  #{index + 1}
                </span>

                {/* Added fallback UI in case imageUrl is broken/empty */}
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <p className="text-white font-semibold">{user.name}</p>
                  <p className="text-gray-400 text-sm">
                    Attempts: {user.quizzesAttempted}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="text-right">
                <p className="text-green-400 font-bold">
                  {user.totalScore}
                </p>
                <p className="text-gray-400 text-sm">Score</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;