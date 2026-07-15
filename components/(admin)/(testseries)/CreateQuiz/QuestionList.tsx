// components/admin/CreateQuiz/QuestionList.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Trash2, Save, Upload } from "lucide-react";
import { LatexText } from "./LatexText";
import { QuestionData } from "./types";

interface QuestionListProps {
  questions: QuestionData[];
  onRemove: (index: number) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function QuestionList({ questions, onRemove, onSubmit, submitting }: QuestionListProps) {
  if (questions.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-primary/20 shadow-xl overflow-hidden rounded-2xl">
        <CardHeader className="bg-primary/5 border-b border-primary/10 py-5 flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-3">
            <div className="p-1.5 bg-primary/20 rounded-md">
              <Check className="w-5 h-5 text-primary" />
            </div>
            Ready for Publishing ({questions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[450px] overflow-y-auto p-5 space-y-4 bg-muted/10">
            {questions.map((q, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.05 }} 
                key={i} 
                className="p-5 rounded-2xl bg-background border border-border/60 shadow-sm flex items-start gap-5 relative group hover:border-primary/40 transition-colors"
              >
                <div className="shrink-0">
                  <Badge variant="secondary" className="bg-primary/10 text-primary font-bold px-3 py-1 text-sm rounded-lg">Q{i + 1}</Badge>
                </div>
                <div className="min-w-0 pr-12 flex-1 space-y-2">
                  {q.question_text ? (
                    <LatexText
                      text={q.question_text}
                      className="block font-semibold text-foreground text-base leading-snug"
                    />
                  ) : (
                    <span className="block font-semibold text-foreground text-base leading-snug">[Image-based Question]</span>
                  )}
                  {q.question_image && <span className="text-xs text-muted-foreground">📷 Image attached</span>}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                    <span className="bg-muted px-2.5 py-1 rounded-md font-medium text-foreground">{q.subject}</span>
                    <span className="flex items-center gap-1.5 bg-green-500/10 text-green-700 px-2.5 py-1 rounded-md font-medium">
                      Correct Answer: <strong className="text-lg leading-none">{String.fromCharCode(65 + q.correct_answer)}</strong>
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(i)}
                  className="absolute right-4 top-4 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all rounded-full"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="p-6 bg-background border-t border-border/50">
            <Button
              onClick={onSubmit}
              disabled={submitting}
              className="w-full py-7 text-xl font-extrabold shadow-xl rounded-xl transition-all hover:scale-[1.01]"
            >
              {submitting ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Upload className="w-6 h-6 mr-3" />
                </motion.div>
              ) : (
                <Save className="w-6 h-6 mr-3" />
              )}
              {submitting ? "Uploading Test Series..." : "Publish Test Series to Database"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}