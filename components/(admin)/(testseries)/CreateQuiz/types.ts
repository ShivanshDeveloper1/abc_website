// components/admin/CreateQuiz/types.ts
export interface QuestionData {
  subject: string;
  question_text: string;
  question_image?: string | null;
  options: string[];
  option_images?: (string | null)[];
  correct_answer: number;
  explanation: string;
}

export interface QuizFormData {
  examType: string;
  customExamType: string;
  title: string;
  overview: string;
  duration: number;
  difficulty: "easy" | "moderate" | "hard";
  instructions: string[];
}

export type Difficulty = "easy" | "moderate" | "hard";