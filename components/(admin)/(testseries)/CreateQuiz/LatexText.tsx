// components/admin/CreateQuiz/LatexText.tsx
"use client";

import { isLatexBlock , renderLatex, splitLatexAndText} from "@/lib/utils/latexParser";
interface LatexTextProps {
  text?: string | null;
  className?: string;
}

export function LatexText({ text, className }: LatexTextProps) {
  if (!text) return null;

  const parts = splitLatexAndText(text);

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        const { math, displayMode } = isLatexBlock(part);

        if (math !== null) {
          const html = renderLatex(math, displayMode);
          return displayMode ? (
            <span
              key={idx}
              className="block my-2 overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <span key={idx} dangerouslySetInnerHTML={{ __html: html }} />
          );
        }

        return (
          <span key={idx} style={{ whiteSpace: "pre-wrap" }}>
            {part}
          </span>
        );
      })}
    </span>
  );
}