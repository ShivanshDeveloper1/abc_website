// components/admin/CreateQuiz/QuizDetailsForm.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, PlusCircle, Trash2, HelpCircle } from "lucide-react";
import { CustomDropdown } from "./CustomDropdown";

interface QuizDetailsFormProps {
  onConfirm: (data: {
    examType: string;
    customExamType: string;
    title: string;
    overview: string;
    duration: number;
    difficulty: "easy" | "moderate" | "hard";
    instructions: string[];
  }) => void;
}

const EXAM_OPTIONS = ["Class 11", "Class 12", "JEE", "NEET", "PHYSICS", "Custom"];
const DIFFICULTY_OPTIONS = ["easy", "moderate", "hard"];

export function QuizDetailsForm({ onConfirm }: QuizDetailsFormProps) {
  const [examType, setExamType] = useState("JEE");
  const [customExamType, setCustomExamType] = useState("");
  const [title, setTitle] = useState("");
  const [overview, setOverview] = useState("");
  const [duration, setDuration] = useState(60);
  const [difficulty, setDifficulty] = useState<"easy" | "moderate" | "hard">("moderate");
  const [instructions, setInstructions] = useState<string[]>([""]);

  const updateInstruction = (index: number, value: string) => {
    const newInst = [...instructions];
    newInst[index] = value;
    setInstructions(newInst);
  };

  return (
    <Card className="shadow-xl border-border/50 rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/40 border-b border-border/50 pb-5 mb-5">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          Quiz Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3 z-20">
            <CustomDropdown
              label="Exam Type / Class"
              value={examType}
              options={EXAM_OPTIONS}
              onChange={setExamType}
            />
            <AnimatePresence>
              {examType === "Custom" && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                >
                  <Input
                    className="bg-background border-border/60 rounded-xl"
                    placeholder="Type custom exam name..."
                    value={customExamType}
                    onChange={(e) => setCustomExamType(e.target.value)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-3 z-10">
            <CustomDropdown
              label="Difficulty Level"
              value={difficulty}
              options={DIFFICULTY_OPTIONS}
              onChange={(v) => setDifficulty(v as "easy" | "moderate" | "hard")}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground block">Quiz Title</label>
          <Input
            className="bg-background text-lg py-6 rounded-xl border-border/60 shadow-sm focus-visible:ring-primary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Physics Sectional Test - Kinematics"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-3 space-y-3">
            <label className="text-sm font-semibold text-foreground block">Overview Description</label>
            <Textarea
              className="bg-background resize-none rounded-xl border-border/60 shadow-sm"
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="Provide a brief description of what this quiz covers..."
              rows={3}
            />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground block">Duration (mins)</label>
            <Input
              className="bg-background rounded-xl border-border/60 py-6 text-center text-lg"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="p-6 bg-muted/20 rounded-2xl border border-border/50 space-y-4">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary" /> Instructions for Students
          </label>
          <div className="space-y-3">
            {instructions.map((inst, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-6 h-6 shrink-0 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>
                <Input
                  className="bg-background rounded-xl"
                  value={inst}
                  onChange={(e) => updateInstruction(i, e.target.value)}
                  placeholder={`Instruction ${i + 1}`}
                />
                {instructions.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="shrink-0 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full" 
                    onClick={() => setInstructions(instructions.filter((_, j) => j !== i))}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setInstructions([...instructions, ""])} 
            className="mt-2 rounded-xl border-dashed border-border/80 text-muted-foreground hover:text-foreground"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Add Another Instruction
          </Button>
        </div>

        <Button
          onClick={() => onConfirm({
            examType,
            customExamType,
            title,
            overview,
            duration,
            difficulty,
            instructions: instructions.filter(i => i.trim())
          })}
          disabled={!title.trim()}
          className="w-full py-7 text-lg font-bold shadow-lg rounded-xl transition-all hover:scale-[1.01]"
        >
          Confirm Details & Add Questions
        </Button>
      </CardContent>
    </Card>
  );
}