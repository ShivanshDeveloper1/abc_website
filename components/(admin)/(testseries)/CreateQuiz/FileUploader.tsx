// components/admin/CreateQuiz/FileUploader.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileJson } from "lucide-react";
import { QuestionData } from "./types";

interface FileUploaderProps {
  onUpload: (questions: QuestionData[]) => void;
}

const SAMPLE_JSON = JSON.stringify([
  {
    subject: "Physics",
    question_text: "Identify the process shown in the diagram below:",
    question_image: "https://example.com/diagram.jpg",
    options: ["Reflection", "Refraction", "Diffraction", "Dispersion"],
    option_images: [null, null, null, "https://example.com/dispersion.jpg"],
    correct_answer: 1,
    explanation: "The diagram shows light bending as it passes through a new medium."
  }
], null, 2);

function parseCSV(text: string): QuestionData[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const questions: QuestionData[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 7) continue;

    questions.push({
      subject: cols[0]?.trim() || "General",
      question_text: cols[1]?.trim() || "",
      question_image: null,
      options: [cols[2]?.trim() || "", cols[3]?.trim() || "", cols[4]?.trim() || "", cols[5]?.trim() || ""],
      option_images: [null, null, null, null],
      correct_answer: parseInt(cols[6]?.trim() || "0", 10),
      explanation: cols[7]?.trim() || "",
    });
  }
  return questions.filter((q) => q.question_text);
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export function FileUploader({ onUpload }: FileUploaderProps) {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadStatus(null);

    try {
      const text = await file.text();
      let parsed: QuestionData[];

      if (file.name.endsWith(".json")) {
        const json = JSON.parse(text);
        parsed = Array.isArray(json) ? json : json.questions || [];
      } else if (file.name.endsWith(".csv")) {
        parsed = parseCSV(text);
      } else {
        setUploadStatus("❌ Unsupported file type. Use .json or .csv");
        return;
      }

      if (parsed.length === 0) {
        setUploadStatus("❌ No valid questions found in file");
        return;
      }

      const formattedQuestions = parsed.map((q) => ({
        subject: q.subject || "General",
        question_text: q.question_text || (q as any).questionText || "",
        question_image: q.question_image || null,
        options: q.options || [],
        option_images: q.option_images || [null, null, null, null],
        correct_answer: Number(q.correct_answer || (q as any).correctAnswer || 0),
        explanation: q.explanation || "",
      }));

      onUpload(formattedQuestions);
      setUploadStatus(`✅ Successfully loaded ${formattedQuestions.length} questions!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setUploadStatus(`❌ Upload failed: ${msg}`);
    }
    e.target.value = "";
  };

  return (
    <Card className="shadow-lg border-border/50 rounded-2xl">
      <CardContent className="p-8 space-y-8">
        <div className="text-center space-y-2 max-w-md mx-auto">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold">Bulk Upload Questions</h3>
          <p className="text-sm text-muted-foreground">
            Instantly populate your test series by dropping a formatted <strong>.json</strong> or <strong>.csv</strong> file below. 
            LaTeX in any field (e.g. <code>\(x^2\)</code>) will render automatically.
          </p>
        </div>

        <div className="border-2 border-dashed border-primary/30 rounded-3xl p-12 text-center bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer relative group">
          <Upload className="w-12 h-12 mx-auto text-primary/60 group-hover:text-primary transition-colors mb-4 group-hover:-translate-y-1 duration-300" />
          <p className="text-lg font-bold mb-2 text-foreground">Click to browse or drag and drop</p>
          <p className="text-sm text-muted-foreground mb-6">JSON or CSV formats strictly supported</p>
          <input
            type="file"
            accept=".json,.csv"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <Button variant="secondary" className="pointer-events-none rounded-xl font-semibold px-8 bg-background shadow-sm border border-border/50 group-hover:border-primary/30">
            Select File
          </Button>
        </div>

        {uploadStatus && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className={`p-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${
              uploadStatus.includes('❌') 
                ? 'bg-red-500/10 text-red-600 border border-red-500/20' 
                : 'bg-green-500/10 text-green-700 border border-green-500/20'
            }`}
          >
            {uploadStatus}
          </motion.div>
        )}

        <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
          <h4 className="font-bold text-sm mb-4 flex items-center gap-2 text-foreground">
            <FileJson className="w-5 h-5 text-primary" /> Required JSON Structure Target
          </h4>
          <pre className="text-xs overflow-auto bg-background rounded-xl p-5 border border-border shadow-inner text-muted-foreground font-mono leading-relaxed">
            {SAMPLE_JSON}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}