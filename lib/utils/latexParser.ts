// Latex is the language used for writing mathematics

// katex convert thise text into beautiful langugae


// utils/latexParser.ts
import katex from "katex";
import "katex/dist/katex.min.css";

export function renderLatex(math: string, displayMode: boolean = false): string {
  try {
    return katex.renderToString(math, {
      throwOnError: false,
      displayMode,
      strict: false,
    });
  } catch {
    return `<span class="text-red-500 font-mono text-xs">${math}</span>`;
  }
}

export function splitLatexAndText(text: string): string[] {
  const MATH_REGEX = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^$\n]+?\$)/g;
  return text.split(MATH_REGEX).filter((part) => part !== undefined && part !== "");
}

export function isLatexBlock(part: string): { math: string | null; displayMode: boolean } {
  if (part.startsWith("$$") && part.endsWith("$$") && part.length >= 4) {
    return { math: part.slice(2, -2), displayMode: true };
  }
  if (part.startsWith("\\[") && part.endsWith("\\]")) {
    return { math: part.slice(2, -2), displayMode: true };
  }
  if (part.startsWith("\\(") && part.endsWith("\\)")) {
    return { math: part.slice(2, -2), displayMode: false };
  }
  if (part.startsWith("$") && part.endsWith("$") && part.length >= 2) {
    return { math: part.slice(1, -1), displayMode: false };
  }
  return { math: null, displayMode: false };
}