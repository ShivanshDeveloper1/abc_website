// models/Quiz.ts
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  question_text: { type: String, required: true }, // Matches your JSON
  options: [{ type: String, required: true }],
  correct_answer: { type: Number, required: true }, // Index 0-3
  explanation: { type: String },
 imageUrl: { type: String, required: false }, // <-- ADD THIS LINE
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  examType: { type: String, required: true }, // Changed from category
  difficulty: { type: String, required: true },
  duration: { type: Number, required: true },
  overview: { type: String, required: true },
  instructions: [{ type: String }],
  totalQuestions: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 0 },
  questions: [questionSchema]
}, { timestamps: true });

export const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);