// components/admin/CreateQuiz/QuestionForm.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, X, PlusCircle } from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";
import { LatexText } from "./LatexText";
import { QuestionData } from "./types";

interface QuestionFormProps {
  questionNumber: number;
  onAdd: (question: QuestionData) => void;
}

export function QuestionForm({ questionNumber, onAdd }: QuestionFormProps) {
  const [qSubject, setQSubject] = useState("");
  const [qText, setQText] = useState("");
  const [qImage, setQImage] = useState<string | null>(null);
  const [qOptions, setQOptions] = useState(["", "", "", ""]);
  const [qOptionImages, setQOptionImages] = useState<(string | null)[]>([null, null, null, null]);
  const [qCorrect, setQCorrect] = useState(0);
  const [qExplanation, setQExplanation] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: QuestionData = {
      subject: qSubject,
      question_text: qText,
      question_image: qImage,
      options: [...qOptions],
      option_images: [...qOptionImages],
      correct_answer: qCorrect,
      explanation: qExplanation,
    };

    onAdd(newQuestion);

    // Reset form
    setQText("");
    setQImage(null);
    setQOptions(["", "", "", ""]);
    setQOptionImages([null, null, null, null]);
    setQCorrect(0);
    setQExplanation("");
  };

  return (
    <Card className="border-border/50 shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/20 border-b border-border/50 pb-5">
        <CardTitle className="text-xl flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-md">
            <PlusCircle className="w-5 h-5 text-primary" />
          </div>
          Draft Question #{questionNumber}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 pt-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-2">
            <label className="text-sm font-semibold text-foreground block">Subject / Topic</label>
            <Input 
              className="bg-background rounded-xl border-border/60" 
              value={qSubject} 
              onChange={(e) => setQSubject(e.target.value)} 
              placeholder="e.g. Physics" 
            />
          </div>
          <div className="md:col-span-3 space-y-2 relative">
            <div className="flex justify-between items-end mb-1">
              <label className="text-sm font-semibold text-foreground block">
                Question Text
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  (LaTeX supported: \(...\), \[...\], $...$, $$...$$)
                </span>
              </label>
              <div>
                <input 
                  type="file" 
                  id="qImageUpload" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(e, setQImage)} 
                />
                <label htmlFor="qImageUpload" className="cursor-pointer text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1">
                  <ImageIcon className="w-4 h-4" /> Add Image
                </label>
              </div>
            </div>
            
            <RichTextEditor
              value={qText}
              onChange={setQText}
              placeholder="Type the main question body here... paste LaTeX like \(CO_{2}\) directly"
              rows={3}
            />

            {/* Question Image Preview */}
            {qImage && (
              <div className="relative mt-3 inline-block">
                <img src={qImage} alt="Question Preview" className="max-h-32 rounded-lg border border-border/50 shadow-sm" />
                <button onClick={() => setQImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Options Grouping */}
        <div className="p-6 rounded-2xl bg-muted/20 border border-border/50 space-y-5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground block">Answer Options</label>
            <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Select the correct answer by clicking the letter</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {qOptions.map((opt, i) => (
              <div key={i} className={`flex flex-col gap-2 p-3 rounded-xl border transition-all ${qCorrect === i ? 'bg-primary/5 border-primary shadow-sm' : 'bg-background border-border/60'}`}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQCorrect(i)}
                    className={`w-11 h-11 rounded-lg text-sm font-bold shrink-0 transition-all shadow-sm flex items-center justify-center
                      ${qCorrect === i ? "bg-primary text-primary-foreground shadow-md scale-105" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  >
                    {String.fromCharCode(65 + i)}
                  </button>
                  <div className="flex-1">
                    <RichTextEditor
                      value={opt}
                      onChange={(val) => {
                        const newOpts = [...qOptions];
                        newOpts[i] = val;
                        setQOptions(newOpts);
                      }}
                      placeholder={`Enter option ${String.fromCharCode(65 + i)} text...`}
                      rows={1}
                      showPreview={false}
                    />
                  </div>
                  <input 
                    type="file" 
                    id={`optImageUpload-${i}`} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => {
                      handleImageUpload(e, (val) => {
                        const newImages = [...qOptionImages];
                        newImages[i] = val;
                        setQOptionImages(newImages);
                      })
                    }} 
                  />
                  <label htmlFor={`optImageUpload-${i}`} className="cursor-pointer text-muted-foreground hover:text-primary p-2">
                    <ImageIcon className="w-5 h-5" />
                  </label>
                </div>

                {/* Option Image Preview */}
                {qOptionImages[i] && (
                  <div className="relative ml-14 inline-block">
                    <img src={qOptionImages[i] as string} alt={`Option ${String.fromCharCode(65 + i)} Preview`} className="max-h-20 rounded-md border border-border/50 shadow-sm" />
                    <button onClick={() => {
                      const newImages = [...qOptionImages];
                      newImages[i] = null;
                      setQOptionImages(newImages);
                    }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground block">Detailed Explanation (Optional)</label>
          <RichTextEditor
            value={qExplanation}
            onChange={setQExplanation}
            placeholder="Provide reasoning for the correct answer..."
            rows={2}
          />
        </div>

        <Button
          onClick={handleAddQuestion}
          disabled={(!qText.trim() && !qImage) || !qSubject.trim() || qOptions.some((o, i) => !o.trim() && !qOptionImages[i])}
          className="w-full py-6 text-md font-bold rounded-xl"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Save to Test Series
        </Button>
      </CardContent>
    </Card>
  );
}