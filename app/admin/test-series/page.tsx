// "use client";

// import { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   PlusCircle, Check, Trash2, Upload, FileJson, FileText,
//   Save, BookOpen, HelpCircle, ChevronDown, Image as ImageIcon, X
// } from "lucide-react";

// // --- LaTeX support -----------------------------------------------------
// // KaTeX renders the math. The CSS import below is what makes fractions,
// // superscripts/subscripts, symbols, etc. actually look right instead of
// // just running LaTeX renderer code with no styling.
// import katex from "katex";
// import "katex/dist/katex.min.css";

// interface QuestionData {
//   subject: string;
//   question_text: string;
//   question_image?: string | null; // Added for main question image
//   options: string[];
//   option_images?: (string | null)[]; // Added for option images
//   correct_answer: number;
//   explanation: string;
// }

// /**
//  * LatexText
//  * ---------
//  * Renders a string that may contain a mix of plain text and LaTeX.
//  *
//  * Supported delimiters (covers what you get pasting from Google, textbooks,
//  * ChatGPT/Claude, Wikipedia, most STEM sites):
//  *   - \( ... \)   inline math
//  *   - \[ ... \]   block/display math
//  *   - $ ... $     inline math
//  *   - $$ ... $$   block/display math
//  *
//  * Anything outside those delimiters is rendered as normal text, so a string
//  * like "The reaction produces \(CO_{2}\) and water" renders the CO2 part as
//  * real math and leaves the rest as plain text.
//  *
//  * If a LaTeX snippet is malformed, KaTeX's throwOnError:false means it will
//  * render a red "error" version inline instead of crashing the whole page —
//  * useful while you're still cleaning up pasted content.
//  */
// function LatexText({ text, className }: { text?: string | null; className?: string }) {
//   if (!text) return null;

//   // Order matters: match the longer/greedier block delimiters before the
//   // single-character ones, so "$$x$$" isn't accidentally split as "$" + "x" + "$$".
//   const MATH_REGEX = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^$\n]+?\$)/g;

//   const parts = text.split(MATH_REGEX).filter((part) => part !== undefined && part !== "");

//   return (
//     <span className={className}>
//       {parts.map((part, idx) => {
//         let math: string | null = null;
//         let displayMode = false;

//         if (part.startsWith("$$") && part.endsWith("$$") && part.length >= 4) {
//           math = part.slice(2, -2);
//           displayMode = true;
//         } else if (part.startsWith("\\[") && part.endsWith("\\]")) {
//           math = part.slice(2, -2);
//           displayMode = true;
//         } else if (part.startsWith("\\(") && part.endsWith("\\)")) {
//           math = part.slice(2,  -2);
//         } else if (part.startsWith("$") && part.endsWith("$") && part.length >= 2) {
//           math = part.slice(1, -1);
//         }

//         if (math !== null) {
//           let html = "";
//           try {
//             html = katex.renderToString(math, {
//               throwOnError: false,
//               displayMode,
//               strict: false, // don't hard-fail on things like unusual spacing commands
//             });
//           } catch {
//             // Fallback: show the raw source so it's obvious something needs fixing,
//             // rather than silently dropping content.
//             return (
//               <span key={idx} className="text-red-500 font-mono text-xs">
//                 {part}
//               </span>
//             );
//           }
//           return displayMode ? (
//             <span
//               key={idx}
//               className="block my-2 overflow-x-auto"
//               dangerouslySetInnerHTML={{ __html: html }}
//             />
//           ) : (
//             <span key={idx} dangerouslySetInnerHTML={{ __html: html }} />
//           );
//         }

//         // Plain text segment — preserve line breaks the user typed.
//         return (
//           <span key={idx} style={{ whiteSpace: "pre-wrap" }}>
//             {part}
//           </span>
//         );
//       })}
//     </span>
//   );
// }

// // --- Custom Animated Dropdown Component ---
// function CustomDropdown({
//   label,
//   value,
//   options,
//   onChange
// }: {
//   label: string,
//   value: string,
//   options: string[],
//   onChange: (val: string) => void
// }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative space-y-2" ref={dropdownRef}>
//       <label className="text-sm font-semibold text-foreground block">{label}</label>
//       <div
//         className="flex items-center justify-between w-full p-3.5 bg-background border border-border/60 rounded-xl cursor-pointer hover:border-primary/50 shadow-sm transition-all"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span className="text-sm font-medium">{value || "Select an option..."}</span>
//         <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
//           <ChevronDown className="w-4 h-4 text-muted-foreground" />
//         </motion.div>
//       </div>

//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -10, scale: 0.98 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -10, scale: 0.98 }}
//             transition={{ duration: 0.2, ease: "easeOut" }}
//             className="absolute z-50 w-full mt-2 bg-background border border-border/50 rounded-xl shadow-xl overflow-hidden"
//           >
//             <div className="max-h-60 overflow-y-auto p-1">
//               {options.map((opt) => (
//                 <div
//                   key={opt}
//                   className={`p-3 text-sm rounded-lg cursor-pointer transition-colors ${
//                     value === opt ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted text-foreground"
//                   }`}
//                   onClick={() => {
//                     onChange(opt);
//                     setIsOpen(false);
//                   }}
//                 >
//                   {opt}
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export default function CreateQuizPage() {
//   const [examType, setExamType] = useState("JEE");
//   const [customExamType, setCustomExamType] = useState("");
//   const [title, setTitle] = useState("");
//   const [overview, setOverview] = useState("");
//   const [duration, setDuration] = useState(60);
//   const [difficulty, setDifficulty] = useState<"easy" | "moderate" | "hard">("moderate");
//   const [instructions, setInstructions] = useState<string[]>([""]);

//   const [detailsConfirmed, setDetailsConfirmed] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   // Questions State
//   const [questions, setQuestions] = useState<QuestionData[]>([]);
//   const [qSubject, setQSubject] = useState("");
//   const [qText, setQText] = useState("");
//   const [qImage, setQImage] = useState<string | null>(null); // Main Question Image
//   const [qOptions, setQOptions] = useState(["", "", "", ""]);
//   const [qOptionImages, setQOptionImages] = useState<(string | null)[]>([null, null, null, null]); // Option Images
//   const [qCorrect, setQCorrect] = useState(0);
//   const [qExplanation, setQExplanation] = useState("");

//   const [uploadStatus, setUploadStatus] = useState<string | null>(null);

//   const EXAM_OPTIONS = ["Class 11", "Class 12", "JEE", "NEET", "PHYSICS", "Custom"];
//   const DIFFICULTY_OPTIONS = ["easy", "moderate", "hard"];

//   const handleConfirmDetails = () => setDetailsConfirmed(true);

//   // Helper to convert uploaded image to Base64 for instant preview
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string | null) => void) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setter(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleAddQuestion = () => {
//     const newQuestion: QuestionData = {
//       subject: qSubject,
//       question_text: qText,
//       question_image: qImage,
//       options: [...qOptions],
//       option_images: [...qOptionImages],
//       correct_answer: qCorrect,
//       explanation: qExplanation,
//     };

//     setQuestions([...questions, newQuestion]);

//     // Reset form
//     setQText("");
//     setQImage(null);
//     setQOptions(["", "", "", ""]);
//     setQOptionImages([null, null, null, null]);
//     setQCorrect(0);
//     setQExplanation("");
//   };

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setUploadStatus(null);

//     try {
//       const text = await file.text();
//       let parsed: QuestionData[];

//       if (file.name.endsWith(".json")) {
//         const json = JSON.parse(text);
//         parsed = Array.isArray(json) ? json : json.questions || [];
//       } else if (file.name.endsWith(".csv")) {
//         parsed = parseCSV(text);
//       } else {
//         setUploadStatus("❌ Unsupported file type. Use .json or .csv");
//         return;
//       }

//       if (parsed.length === 0) {
//         setUploadStatus("❌ No valid questions found in file");
//         return;
//       }

//       const formattedQuestions = parsed.map((q) => ({
//         subject: q.subject || "General",
//         question_text: q.question_text || (q as any).questionText || "",
//         question_image: q.question_image || null,
//         options: q.options,
//         option_images: q.option_images || [null, null, null, null],
//         correct_answer: Number(q.correct_answer || (q as any).correctAnswer || 0),
//         explanation: q.explanation || "",
//       }));

//       setQuestions([...questions, ...formattedQuestions]);
//       setUploadStatus(`✅ Successfully loaded ${formattedQuestions.length} questions!`);
//     } catch (err: unknown) {
//       const msg = err instanceof Error ? err.message : "Unknown error";
//       setUploadStatus(`❌ Upload failed: ${msg}`);
//     }
//     e.target.value = "";
//   };

//   const handleSubmitQuiz = async () => {
//     if (questions.length === 0) {
//       alert("Please add at least one question before submitting.");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const finalExamType = examType === "Custom" ? customExamType : examType;

//       const payload = {
//         examType: finalExamType,
//         title,
//         duration,
//         difficulty,
//         overview: overview || undefined,
//         instructions: instructions.filter((i) => i.trim()),
//         questions: questions,
//       };

//       const response = await fetch("/api/admin/upload-quiz", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to upload quiz");
//       }

//       alert("Quiz successfully uploaded and saved to MongoDB!");

//     } catch (err: any) {
//       console.error(err);
//       alert(`Error: ${err.message}`);
//     }
//     setSubmitting(false);
//   };

//   const updateInstruction = (index: number, value: string) => {
//     const newInst = [...instructions];
//     newInst[index] = value;
//     setInstructions(newInst);
//   };

//   const sampleJson = JSON.stringify([
//     {
//       subject: "Physics",
//       question_text: "Identify the process shown in the diagram below:",
//       question_image: "https://example.com/diagram.jpg",
//       options: ["Reflection", "Refraction", "Diffraction", "Dispersion"],
//       option_images: [null, null, null, "https://example.com/dispersion.jpg"],
//       correct_answer: 1,
//       explanation: "The diagram shows light bending as it passes through a new medium."
//     }
//   ], null, 2);

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8 w-full">
//       <motion.h1
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-4xl font-extrabold tracking-tight mb-8 text-foreground"
//       >
//         Create New Quiz
//       </motion.h1>

//       {!detailsConfirmed ? (
//         <Card className="shadow-xl border-border/50 rounded-2xl overflow-hidden">
//           <CardHeader className="bg-muted/40 border-b border-border/50 pb-5 mb-5">
//             <CardTitle className="flex items-center gap-3 text-2xl">
//               <div className="p-2 bg-primary/10 rounded-lg">
//                 <BookOpen className="w-6 h-6 text-primary" />
//               </div>
//               Quiz Details
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-8 p-6 sm:p-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

//               <div className="space-y-3 z-20">
//                 <CustomDropdown
//                   label="Exam Type / Class"
//                   value={examType}
//                   options={EXAM_OPTIONS}
//                   onChange={setExamType}
//                 />
//                 <AnimatePresence>
//                   {examType === "Custom" && (
//                     <motion.div
//                       initial={{ opacity: 0, height: 0, marginTop: 0 }}
//                       animate={{ opacity: 1, height: "auto", marginTop: 12 }}
//                       exit={{ opacity: 0, height: 0, marginTop: 0 }}
//                     >
//                       <Input
//                         className="bg-background border-border/60 rounded-xl"
//                         placeholder="Type custom exam name..."
//                         value={customExamType}
//                         onChange={(e) => setCustomExamType(e.target.value)}
//                       />
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>

//               <div className="space-y-3 z-10">
//                 <CustomDropdown
//                   label="Difficulty Level"
//                   value={difficulty}
//                   options={DIFFICULTY_OPTIONS}
//                   onChange={(v) => setDifficulty(v as "easy" | "moderate" | "hard")}
//                 />
//               </div>
//             </div>

//             <div className="space-y-3">
//               <label className="text-sm font-semibold text-foreground block">Quiz Title</label>
//               <Input
//                 className="bg-background text-lg py-6 rounded-xl border-border/60 shadow-sm focus-visible:ring-primary"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="e.g. Physics Sectional Test - Kinematics"
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//               <div className="md:col-span-3 space-y-3">
//                 <label className="text-sm font-semibold text-foreground block">Overview Description</label>
//                 <Textarea
//                   className="bg-background resize-none rounded-xl border-border/60 shadow-sm"
//                   value={overview}
//                   onChange={(e) => setOverview(e.target.value)}
//                   placeholder="Provide a brief description of what this quiz covers..."
//                   rows={3}
//                 />
//               </div>
//               <div className="space-y-3">
//                 <label className="text-sm font-semibold text-foreground block">Duration (mins)</label>
//                 <Input
//                   className="bg-background rounded-xl border-border/60 py-6 text-center text-lg"
//                   type="number"
//                   value={duration}
//                   onChange={(e) => setDuration(Number(e.target.value))}
//                 />
//               </div>
//             </div>

//             <div className="p-6 bg-muted/20 rounded-2xl border border-border/50 space-y-4">
//               <label className="text-sm font-semibold text-foreground flex items-center gap-2">
//                 <HelpCircle className="w-4 h-4 text-primary" /> Instructions for Students
//               </label>
//               <div className="space-y-3">
//                 {instructions.map((inst, i) => (
//                   <div key={i} className="flex gap-3 items-center">
//                     <div className="w-6 h-6 shrink-0 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
//                       {i + 1}
//                     </div>
//                     <Input
//                       className="bg-background rounded-xl"
//                       value={inst}
//                       onChange={(e) => updateInstruction(i, e.target.value)}
//                       placeholder={`Instruction ${i + 1}`}
//                     />
//                     {instructions.length > 1 && (
//                       <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full" onClick={() => setInstructions(instructions.filter((_, j) => j !== i))}>
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     )}
//                   </div>
//                 ))}
//               </div>
//               <Button variant="outline" size="sm" onClick={() => setInstructions([...instructions, ""])} className="mt-2 rounded-xl border-dashed border-border/80 text-muted-foreground hover:text-foreground">
//                 <PlusCircle className="w-4 h-4 mr-2" /> Add Another Instruction
//               </Button>
//             </div>

//             <Button
//               onClick={handleConfirmDetails}
//               disabled={!title.trim()}
//               className="w-full py-7 text-lg font-bold shadow-lg rounded-xl transition-all hover:scale-[1.01]"
//             >
//               Confirm Details & Add Questions
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/20 shadow-sm">
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-primary/10 rounded-xl">
//                 <Check className="w-6 h-6 text-primary" />
//               </div>
//               <div>
//                 <h3 className="font-bold text-foreground">{title}</h3>
//                 <p className="text-sm text-muted-foreground">{examType} • {duration} Mins • {difficulty} difficulty</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3 w-full sm:w-auto">
//                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 text-sm border-0">
//                  {questions.length} Question{questions.length !== 1 ? 's' : ''} Built
//                </Badge>
//                <Button size="sm" onClick={() => setDetailsConfirmed(false)} variant="outline" className="bg-background rounded-xl">Edit Details</Button>
//             </div>
//           </div>

//           <Tabs defaultValue="manual" className="w-full flex flex-col">
//             <TabsList className="grid w-full grid-cols-2 mb-6 p-1.5 bg-muted/40 rounded-2xl">
//               <TabsTrigger value="manual" className="rounded-xl py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
//                 <FileText className="w-4 h-4 mr-2" /> Add Manually
//               </TabsTrigger>
//               <TabsTrigger value="upload" className="rounded-xl py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all">
//                 <Upload className="w-4 h-4 mr-2" /> Upload CSV/JSON
//               </TabsTrigger>
//             </TabsList>

//             {/* MANUAL ENTRY TAB */}
//             <TabsContent value="manual" className="mt-0">
//               <Card className="border-border/50 shadow-lg rounded-2xl overflow-hidden">
//                 <CardHeader className="bg-muted/20 border-b border-border/50 pb-5">
//                   <CardTitle className="text-xl flex items-center gap-2">
//                     <div className="p-1.5 bg-primary/10 rounded-md">
//                       <PlusCircle className="w-5 h-5 text-primary" />
//                     </div>
//                     Draft Question #{questions.length + 1}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-8 pt-6 sm:p-8">
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                     <div className="md:col-span-1 space-y-2">
//                       <label className="text-sm font-semibold text-foreground block">Subject / Topic</label>
//                       <Input className="bg-background rounded-xl border-border/60" value={qSubject} onChange={(e) => setQSubject(e.target.value)} placeholder="e.g. Physics" />
//                     </div>
//                     <div className="md:col-span-3 space-y-2 relative">
//                       <div className="flex justify-between items-end mb-1">
//                         <label className="text-sm font-semibold text-foreground block">
//                           Question Text
//                           <span className="ml-2 text-xs font-normal text-muted-foreground">
//                             (LaTeX supported: \(...\), \[...\], $...$, $$...$$)
//                           </span>
//                         </label>
//                         {/* Question Image Upload Button */}
//                         <div>
//                           <input type="file" id="qImageUpload" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setQImage)} />
//                           <label htmlFor="qImageUpload" className="cursor-pointer text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1">
//                             <ImageIcon className="w-4 h-4" /> Add Image
//                           </label>
//                         </div>
//                       </div>
//                       <Textarea className="bg-background resize-none rounded-xl border-border/60 font-mono text-sm" value={qText} onChange={(e) => setQText(e.target.value)} placeholder="Type the main question body here... paste LaTeX like \(CO_{2}\) directly" rows={3} />

//                       {/* Live LaTeX preview so you can catch broken formulas before saving */}
//                       {qText && (
//                         <div className="mt-2 p-3 bg-muted/30 rounded-lg border border-border/40">
//                           <p className="text-xs font-semibold text-muted-foreground mb-1">Live Preview</p>
//                           <LatexText text={qText} className="text-sm text-foreground" />
//                         </div>
//                       )}

//                       {/* Question Image Preview */}
//                       {qImage && (
//                         <div className="relative mt-3 inline-block">
//                           <img src={qImage} alt="Question Preview" className="max-h-32 rounded-lg border border-border/50 shadow-sm" />
//                           <button onClick={() => setQImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors">
//                             <X className="w-3 h-3" />
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Options Grouping */}
//                   <div className="p-6 rounded-2xl bg-muted/20 border border-border/50 space-y-5">
//                     <div className="flex items-center justify-between">
//                       <label className="text-sm font-semibold text-foreground block">Answer Options</label>
//                       <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Select the correct answer by clicking the letter</span>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                       {qOptions.map((opt, i) => (
//                         <div key={i} className={`flex flex-col gap-2 p-3 rounded-xl border transition-all ${qCorrect === i ? 'bg-primary/5 border-primary shadow-sm' : 'bg-background border-border/60'}`}>
//                           <div className="flex items-center gap-3">
//                             <button
//                               onClick={() => setQCorrect(i)}
//                               className={`w-11 h-11 rounded-lg text-sm font-bold shrink-0 transition-all shadow-sm flex items-center justify-center
//                                 ${qCorrect === i ? "bg-primary text-primary-foreground shadow-md scale-105" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
//                             >
//                               {String.fromCharCode(65 + i)}
//                             </button>
//                             <Input
//                               className={`border-0 bg-transparent focus-visible:ring-0 shadow-none px-2 font-mono text-sm ${qCorrect === i ? 'font-medium text-foreground' : 'text-muted-foreground'}`}
//                               value={opt}
//                               onChange={(e) => {
//                                 const newOpts = [...qOptions];
//                                 newOpts[i] = e.target.value;
//                                 setQOptions(newOpts);
//                               }}
//                               placeholder={`Enter option ${String.fromCharCode(65 + i)} text...`}
//                             />
//                             {/* Option Image Upload Icon */}
//                             <input type="file" id={`optImageUpload-${i}`} className="hidden" accept="image/*" onChange={(e) => {
//                                 handleImageUpload(e, (val) => {
//                                   const newImages = [...qOptionImages];
//                                   newImages[i] = val;
//                                   setQOptionImages(newImages);
//                                 })
//                             }} />
//                             <label htmlFor={`optImageUpload-${i}`} className="cursor-pointer text-muted-foreground hover:text-primary p-2">
//                               <ImageIcon className="w-5 h-5" />
//                             </label>
//                           </div>

//                           {/* Live LaTeX preview for this option */}
//                           {opt && (
//                             <div className="ml-14 text-sm bg-background/60 rounded-md px-3 py-1.5 border border-border/40">
//                               <LatexText text={opt} />
//                             </div>
//                           )}

//                           {/* Option Image Preview */}
//                           {qOptionImages[i] && (
//                             <div className="relative ml-14 inline-block">
//                               <img src={qOptionImages[i] as string} alt={`Option ${String.fromCharCode(65 + i)} Preview`} className="max-h-20 rounded-md border border-border/50 shadow-sm" />
//                               <button onClick={() => {
//                                 const newImages = [...qOptionImages];
//                                 newImages[i] = null;
//                                 setQOptionImages(newImages);
//                               }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors">
//                                 <X className="w-3 h-3" />
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm font-semibold text-foreground block">Detailed Explanation (Optional)</label>
//                     <Textarea className="bg-background resize-none rounded-xl border-border/60 font-mono text-sm" value={qExplanation} onChange={(e) => setQExplanation(e.target.value)} placeholder="Provide reasoning for the correct answer..." rows={2} />
//                     {qExplanation && (
//                       <div className="mt-2 p-3 bg-muted/30 rounded-lg border border-border/40">
//                         <p className="text-xs font-semibold text-muted-foreground mb-1">Live Preview</p>
//                         <LatexText text={qExplanation} className="text-sm text-muted-foreground" />
//                       </div>
//                     )}
//                   </div>

//                   <Button
//                     onClick={handleAddQuestion}
//                     disabled={(!qText.trim() && !qImage) || !qSubject.trim() || qOptions.some((o, i) => !o.trim() && !qOptionImages[i])}
//                     className="w-full py-6 text-md font-bold rounded-xl"
//                   >
//                     <PlusCircle className="w-5 h-5 mr-2" /> Save to Test Series
//                   </Button>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* UPLOAD FILE TAB */}
//             <TabsContent value="upload" className="mt-0">
//               <Card className="shadow-lg border-border/50 rounded-2xl">
//                 <CardContent className="p-8 space-y-8">
//                   <div className="text-center space-y-2 max-w-md mx-auto">
//                     <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
//                        <Upload className="w-6 h-6 text-primary" />
//                     </div>
//                     <h3 className="text-xl font-bold">Bulk Upload Questions</h3>
//                     <p className="text-sm text-muted-foreground">Instantly populate your test series by dropping a formatted <strong>.json</strong> or <strong>.csv</strong> file below. LaTeX in any field (e.g. <code>\(x^2\)</code>) will render automatically.</p>
//                   </div>

//                   <div className="border-2 border-dashed border-primary/30 rounded-3xl p-12 text-center bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer relative group">
//                     <Upload className="w-12 h-12 mx-auto text-primary/60 group-hover:text-primary transition-colors mb-4 group-hover:-translate-y-1 duration-300" />
//                     <p className="text-lg font-bold mb-2 text-foreground">Click to browse or drag and drop</p>
//                     <p className="text-sm text-muted-foreground mb-6">JSON or CSV formats strictly supported</p>
//                     <input
//                       type="file"
//                       accept=".json,.csv"
//                       onChange={handleFileUpload}
//                       className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                     />
//                     <Button variant="secondary" className="pointer-events-none rounded-xl font-semibold px-8 bg-background shadow-sm border border-border/50 group-hover:border-primary/30">Select File</Button>
//                   </div>

//                   {uploadStatus && (
//                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 ${uploadStatus.includes('❌') ? 'bg-red-500/10 text-red-600 border border-red-500/20' : 'bg-green-500/10 text-green-700 border border-green-500/20'}`}>
//                       {uploadStatus}
//                     </motion.div>
//                   )}

//                   <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
//                     <h4 className="font-bold text-sm mb-4 flex items-center gap-2 text-foreground">
//                       <FileJson className="w-5 h-5 text-primary" /> Required JSON Structure Target
//                     </h4>
//                     <pre className="text-xs overflow-auto bg-background rounded-xl p-5 border border-border shadow-inner text-muted-foreground font-mono leading-relaxed">
//                       {sampleJson}
//                     </pre>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>

//           {/* List of currently added questions */}
//           {questions.length > 0 && (
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
//               <Card className="border-primary/20 shadow-xl overflow-hidden rounded-2xl">
//                 <CardHeader className="bg-primary/5 border-b border-primary/10 py-5 flex flex-row items-center justify-between">
//                   <CardTitle className="text-lg flex items-center gap-3">
//                     <div className="p-1.5 bg-primary/20 rounded-md">
//                       <Check className="w-5 h-5 text-primary" />
//                     </div>
//                     Ready for Publishing ({questions.length})
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-0">
//                   <div className="max-h-[450px] overflow-y-auto p-5 space-y-4 bg-muted/10">
//                     {questions.map((q, i) => (
//                       <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} key={i} className="p-5 rounded-2xl bg-background border border-border/60 shadow-sm flex items-start gap-5 relative group hover:border-primary/40 transition-colors">
//                         <div className="shrink-0">
//                           <Badge variant="secondary" className="bg-primary/10 text-primary font-bold px-3 py-1 text-sm rounded-lg">Q{i + 1}</Badge>
//                         </div>
//                         <div className="min-w-0 pr-12 flex-1 space-y-2">
//                           {q.question_text ? (
//                             <LatexText
//                               text={q.question_text}
//                               className="block font-semibold text-foreground text-base leading-snug"
//                             />
//                           ) : (
//                             <span className="block font-semibold text-foreground text-base leading-snug">[Image-based Question]</span>
//                           )}
//                           {q.question_image && <ImageIcon className="w-4 h-4 text-primary" />}
//                           <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
//                             <span className="bg-muted px-2.5 py-1 rounded-md font-medium text-foreground">{q.subject}</span>
//                             <span className="flex items-center gap-1.5 bg-green-500/10 text-green-700 px-2.5 py-1 rounded-md font-medium">
//                               Correct Answer: <strong className="text-lg leading-none">{String.fromCharCode(65 + q.correct_answer)}</strong>
//                             </span>
//                           </div>
//                         </div>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => setQuestions(questions.filter((_, idx) => idx !== i))}
//                           className="absolute right-4 top-4 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all rounded-full"
//                         >
//                           <Trash2 className="w-5 h-5" />
//                         </Button>
//                       </motion.div>
//                     ))}
//                   </div>

//                   {/* FINAL SUBMIT BUTTON */}
//                   <div className="p-6 bg-background border-t border-border/50">
//                     <Button
//                       onClick={handleSubmitQuiz}
//                       disabled={submitting}
//                       className="w-full py-7 text-xl font-extrabold shadow-xl rounded-xl transition-all hover:scale-[1.01]"
//                     >
//                       {submitting ? (
//                         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
//                            <Upload className="w-6 h-6 mr-3" />
//                         </motion.div>
//                       ) : (
//                         <Save className="w-6 h-6 mr-3" />
//                       )}
//                       {submitting ? "Uploading Test Series..." : "Publish Test Series to Database"}
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           )}
//         </motion.div>
//       )}
//     </div>
//   );
// }

// function parseCSV(text: string): QuestionData[] {
//   const lines = text.trim().split("\n");
//   if (lines.length < 2) return [];

//   const questions: QuestionData[] = [];
//   for (let i = 1; i < lines.length; i++) {
//     const cols = parseCSVLine(lines[i]);
//     if (cols.length < 7) continue;

//     questions.push({
//       subject: cols[0]?.trim() || "General",
//       question_text: cols[1]?.trim() || "",
//       options: [cols[2]?.trim() || "", cols[3]?.trim() || "", cols[4]?.trim() || "", cols[5]?.trim() || ""],
//       correct_answer: parseInt(cols[6]?.trim() || "0", 10),
//       explanation: cols[7]?.trim() || "",
//     });
//   }
//   return questions.filter((q) => q.question_text);
// }

// function parseCSVLine(line: string): string[] {
//   const result: string[] = [];
//   let current = "";
//   let inQuotes = false;

//   for (let i = 0; i < line.length; i++) {
//     const char = line[i];
//     if (char === '"') {
//       if (inQuotes && line[i + 1] === '"') {
//         current += '"';
//         i++;
//       } else {
//         inQuotes = !inQuotes;
//       }
//     } else if (char === "," && !inQuotes) {
//       result.push(current);
//       current = "";
//     } else {
//       current += char;
//     }
//   }
//   result.push(current);
//   return result;
// }

import CreateQuizPage from '@/components/(admin)/(testseries)/CreateQuiz'
import React from 'react'

const page = () => {
  return (
    <CreateQuizPage />
  )
}

export default page