"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Repeat, X } from "lucide-react";

const ResultPopup = ({ isOpen, type, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-8 z-50 p-5 rounded-2xl shadow-2xl border flex items-start gap-4 max-w-sm w-full backdrop-blur-md ${
            type === "saved" 
              ? "bg-green-50/95 border-green-200" 
              : "bg-blue-50/95 border-blue-200"
          }`}
        >
          {/* Dynamic Icon */}
          <div className={`mt-1 shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
            type === "saved" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
          }`}>
            {type === "saved" ? <CheckCircle2 size={24} /> : <Repeat size={24} />}
          </div>

          {/* Dynamic Text */}
          <div className="flex-1 pr-4">
            <h3 className={`font-bold text-lg leading-tight mb-1 ${
              type === "saved" ? "text-green-800" : "text-blue-800"
            }`}>
              {type === "saved" ? "Result Saved!" : "Practice Run!"}
            </h3>
            <p className={`text-sm font-medium leading-snug ${
              type === "saved" ? "text-green-700" : "text-blue-700/80"
            }`}>
              {type === "saved" 
                ? "Your fantastic score has been securely saved in the ABC Recordbook." 
                : "Keep on going! You are solving this test again to practice. We kept your first score saved, but great job reviewing!"}
            </p>
          </div>

          {/* Close Button */}
          <button 
            onClick={onClose}
            className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${
              type === "saved" 
                ? "text-green-500 hover:bg-green-200" 
                : "text-blue-500 hover:bg-blue-200"
            }`}
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultPopup;