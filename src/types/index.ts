
export type Board = 'CBSE' | 'ICSE' | 'State';
export const BOARDS: Board[] = ['CBSE', 'ICSE', 'State'];

export enum QuestionTypeEnum {
  MCQ = 'MCQ',
  SHORT_ANSWER = 'Short Answer',
  LONG_ANSWER = 'Long Answer',
  FILL_IN_THE_BLANK = 'Fill in the Blank',
  MATCH_THE_FOLLOWING = 'Match the Following',
  ASSERTION_AND_REASON = 'Assertion and Reason',
  COMPREHENSION = 'Comprehension'
}

export type QuestionType = `${QuestionTypeEnum}`;
export const QUESTION_TYPES: QuestionType[] = Object.values(QuestionTypeEnum) as QuestionType[];

export enum DifficultyEnum {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export type Difficulty = `${DifficultyEnum}`;
export const DIFFICULTY_LEVELS: Difficulty[] = Object.values(DifficultyEnum) as Difficulty[];

export enum BloomLevelEnum {
  REMEMBER = 'Remember',
  UNDERSTAND = 'Understand',
  APPLY = 'Apply',
  ANALYZE = 'Analyze',
  EVALUATE = 'Evaluate',
  CREATE = 'Create'
}

export type BloomLevel = `${BloomLevelEnum}`;
export const BLOOM_LEVELS: BloomLevel[] = Object.values(BloomLevelEnum) as BloomLevel[];

export interface MatchPair {
  left: string;
  right: string;
}

export interface SubQuestion {
  id: string;
  text?: string;
  questionTitle?: string;
  marks: number;
  type: QuestionType;
  difficulty?: Difficulty;
  options?: string[] | Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  answer?: string;
  evaluationRubric?: Array<{
    criterion: string;
    weight: number;
    keywordHints: string[];
  }>;
  syllabusMapping?: {
    chapter: Array<{ id: string; name: string }>;
    topic: Array<{ id: string; name: string }>;
  };
}

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
  matchPairs?: MatchPair[]; // For Match the Following
  subQuestions?: SubQuestion[]; // For Comprehension
  assertionText?: string; // For Assertion and Reason
  reasonText?: string; // For Assertion and Reason
  hasImage?: boolean;
  imageUrl?: string;
  isAiGenerated?: boolean;
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
  sections?: Section[]; // Make sections optional
  questions?: Question[]; // Add direct questions support
  collaborators?: string[];
  isApproved?: boolean;
  schoolHeader?: string;
  instructions?: string[];
  isSectionless?: boolean; // New flag to indicate if paper is section-less
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

export interface QuestionSection {
  questionTitle: string;
  marks: number;
  difficulty: string;
  syllabusMapping: {
    chapter: Array<{ id: string; name: string }>;
    topic: Array<{ id: string; name: string }>;
  };
  questionType: 'option_based' | 'subjective';
  subQuestions: SubQuestion[];
}
