// components/admin/CreateQuiz/index.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Check } from "lucide-react";
import { QuizDetailsForm } from "./QuizDetailsForm";
import { QuestionForm } from "./QuestionForm";
import { QuestionList } from "./QuestionList";
import { FileUploader } from "./FileUploader";
import { QuestionData } from "./types";

export default function CreateQuizPage() {
  const [detailsConfirmed, setDetailsConfirmed] = useState(false);
  const [quizData, setQuizData] = useState({
    examType: "",
    customExamType: "",
    title: "",
    overview: "",
    duration: 60,
    difficulty: "moderate" as "easy" | "moderate" | "hard",
    instructions: [] as string[],
  });
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleDetailsConfirm = (data: any) => {
    setQuizData(data);
    setDetailsConfirmed(true);
  };

  const handleAddQuestion = (question: QuestionData) => {
    setQuestions([...questions, question]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleBulkUpload = (newQuestions: QuestionData[]) => {
    setQuestions([...questions, ...newQuestions]);
  };

  const handleSubmit = async () => {
    if (questions.length === 0) {
      alert("Please add at least one question before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const finalExamType = quizData.examType === "Custom" ? quizData.customExamType : quizData.examType;

      const payload = {
        examType: finalExamType,
        title: quizData.title,
        duration: quizData.duration,
        difficulty: quizData.difficulty,
        overview: quizData.overview || undefined,
        instructions: quizData.instructions,
        questions: questions,
      };

      const response = await fetch("/api/admin/upload-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload quiz");
      }

      alert("Quiz successfully uploaded and saved to MongoDB!");
      // Reset state or redirect as needed
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
    setSubmitting(false);
  };

  if (!detailsConfirmed) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 w-full">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold tracking-tight mb-8 text-foreground"
        >
          Create New Quiz
        </motion.h1>
        <QuizDetailsForm onConfirm={handleDetailsConfirm} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 w-full">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold tracking-tight mb-8 text-foreground"
      >
        Create New Quiz
      </motion.h1>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/20 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Check className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">{quizData.title}</h3>
              <p className="text-sm text-muted-foreground">
                {quizData.examType} • {quizData.duration} Mins • {quizData.difficulty} difficulty
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 text-sm border-0">
              {questions.length} Question{questions.length !== 1 ? 's' : ''} Built
            </Badge>
            <Button size="sm" onClick={() => setDetailsConfirmed(false)} variant="outline" className="bg-background rounded-xl">
              Edit Details
            </Button>
          </div>
        </div>

        <Tabs defaultValue="manual" className="w-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-6 p-1.5 bg-muted/40 rounded-2xl">
            <TabsTrigger value="manual" className="rounded-xl py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
              <FileText className="w-4 h-4 mr-2" /> Add Manually
            </TabsTrigger>
            <TabsTrigger value="upload" className="rounded-xl py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
              <Upload className="w-4 h-4 mr-2" /> Upload CSV/JSON
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="mt-0">
            <QuestionForm 
              questionNumber={questions.length + 1}
              onAdd={handleAddQuestion}
            />
          </TabsContent>

          <TabsContent value="upload" className="mt-0">
            <FileUploader onUpload={handleBulkUpload} />
          </TabsContent>
        </Tabs>

        <QuestionList 
          questions={questions}
          onRemove={handleRemoveQuestion}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </motion.div>
    </div>
  );
}