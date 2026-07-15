// components/admin/CreateQuiz/RichTextEditor.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import { LatexText } from "./LatexText";
import { 
  Bold, Italic, Underline, 
  Superscript, Subscript, 
   Languages, ArrowRight, 
  Calculator, X
} from "lucide-react";
import { SYMBOL_TOOLBAR } from "@/lib/utils/textCleanup";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  showPreview?: boolean;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder, 
  className = "",
  rows = 3,
  showPreview = true
}: RichTextEditorProps) {
  const [showSymbols, setShowSymbols] = useState(false);
  const [activeTab, setActiveTab] = useState<"greek" | "arrows" | "chemistry">("greek");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + text + value.substring(end);
    onChange(newValue);

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
    }, 0);
  };

  const insertLatex = (latex: string) => {
    insertText(`\\(${latex}\\)`);
  };

  const wrapText = (prefix: string, suffix: string = prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const newValue = value.substring(0, start) + prefix + selected + suffix + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = end + prefix.length;
    }, 0);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-muted/30 rounded-xl border border-border/50">
        {/* Text formatting */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => wrapText("**", "**")}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => wrapText("*", "*")}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => wrapText("__", "__")}
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Math formatting */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertLatex("x^2")}
          title="Superscript (x²)"
        >
          <Superscript className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertLatex("x_2")}
          title="Subscript (x₂)"
        >
          <Subscript className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => insertLatex("\\frac{1}{2}")}
          title="Fraction"
        >
          <Calculator className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Symbol toolbar */}
        <Button
          variant={showSymbols ? "secondary" : "ghost"}
          size="sm"
          className="h-8 px-2 text-xs"
          onClick={() => setShowSymbols(!showSymbols)}
        >
        <Languages className="w-4 h-4 mr-1" />
          Symbols
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs"
          onClick={() => insertText(" → ")}
        >
          <ArrowRight className="w-4 h-4 mr-1" />
          Arrow
        </Button>
      </div>

      {/* Symbols panel */}
      {showSymbols && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="p-3 bg-muted/20 rounded-xl border border-border/50 space-y-3">
            <div className="flex gap-2">
              <Button
                variant={activeTab === "greek" ? "secondary" : "ghost"}
                size="sm"
                className="text-xs"
                onClick={() => setActiveTab("greek")}
              >
                Greek
              </Button>
              <Button
                variant={activeTab === "arrows" ? "secondary" : "ghost"}
                size="sm"
                className="text-xs"
                onClick={() => setActiveTab("arrows")}
              >
                Arrows
              </Button>
              <Button
                variant={activeTab === "chemistry" ? "secondary" : "ghost"}
                size="sm"
                className="text-xs"
                onClick={() => setActiveTab("chemistry")}
              >
                Chemistry
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {SYMBOL_TOOLBAR[activeTab]?.map((symbol) => (
                <Button
                  key={symbol.value}
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-sm font-mono hover:bg-primary/10"
                  onClick={() => insertText(symbol.value)}
                >
                  {symbol.label}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        className={`w-full bg-background resize-none rounded-xl border border-border/60 font-mono text-sm p-3 focus:outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />

      {/* Live preview */}
      {showPreview && value && (
        <div className="mt-2 p-3 bg-muted/30 rounded-lg border border-border/40">
          <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center justify-between">
            <span>Live Preview</span>
            <span className="text-[10px] text-muted-foreground">LaTeX supported</span>
          </p>
          <LatexText text={value} className="text-sm text-foreground" />
        </div>
      )}
    </div>
  );
}``