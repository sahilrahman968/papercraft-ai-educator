
export type Board = 'CBSE' | 'ICSE' | 'State';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type QuestionType = 'MCQ' | 'Short Answer' | 'Long Answer' | 'Fill in the Blank' | 'Match the Following' | 'Assertion and Reason';
export type BloomLevel = 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';

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
}

export interface QuestionPaper {
  id: string;
  title: string;
  board: Board;
  class: string;
  subject: string;
  createdBy: string;
  createdAt: Date;
  totalMarks: number;
  duration: number; // in minutes
  sections: Section[];
  collaborators?: string[];
  isApproved?: boolean;
  schoolHeader?: string;
  instructions?: string[];
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Teacher' | 'Admin';
  school: string;
  subjects: string[];
}

export interface School {
  id: string;
  name: string;
  board: Board;
  logo?: string;
  headerTemplate?: string;
}

export interface GenerateParams {
  board: Board;
  class: string;
  subject: string;
  chapters: string[];
  topics?: string[];
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  totalMarks: number;
  duration: number;
}
