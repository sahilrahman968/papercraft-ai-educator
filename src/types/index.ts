
export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  board: Board;
  class: string;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: Difficulty;
  marks: number;
  bloomLevel: BloomLevel;
  answer?: string;
  options?: string[]; // For MCQs
  hasImage?: boolean;
  imageUrl?: string;
  isAiGenerated?: boolean; // Add this line
}
