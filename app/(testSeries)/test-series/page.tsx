import React from "react";
import { FileText, Users, Star } from "lucide-react";
import TestSeries from "@/components/(testseries)/testSeries";
import LeaderBoard from "@/components/(testseries)/LeaderBoard";

export default function TestSeriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      
      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="rounded-2xl bg-gradient-to-r from-red-600 to-red-800 p-8 text-white shadow-lg flex flex-col items-start">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Test Series 2026</h1>
          <p className="text-red-100 font-medium mb-6 max-w-xl">
            Simulate real exam conditions. Track your progress. Beat the competition.
          </p>
          
          <div className="flex flex-wrap gap-4 font-medium text-sm">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <FileText size={18} className="text-red-200" />
              <span>6 Tests Available</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Users size={18} className="text-red-200" />
              <span>12,480 Students</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Star size={18} className="text-red-200" />
              <span>Expert Crafted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-1">
            <LeaderBoard />
          </div>
          
          {/* Test Series List (Takes up 2 columns on large screens) */}
          <div className="lg:col-span-2">
            <TestSeries />
          </div>

          {/* Leaderboard Sidebar (Takes up 1 column on large screens) */}
        

        </div>
      </div>
    </div>
  );
}