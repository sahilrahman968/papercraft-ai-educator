
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { Board, Question, Section } from '@/types';
import { toast } from '@/hooks/use-toast';

export interface CreatePaperState {
  title: string;
  board: Board;
  classLevel: string;
  subject: string;
  totalMarks: number;
  duration: number;
  instructions: string[];
  sections: Section[];
  isSectionless: boolean;
  directQuestions: Question[];
}

export const useCreatePaper = () => {
  const navigate = useNavigate();
  const { createQuestionPaper } = useData();
  
  const [paperState, setPaperState] = useState<CreatePaperState>({
    title: '',
    board: 'CBSE',
    classLevel: '10',
    subject: 'Mathematics',
    totalMarks: 100,
    duration: 180,
    instructions: [
      'Answer all questions.',
      'Marks are indicated against each question.',
      'Draw diagrams where necessary.',
      'Write legibly for full marks.'
    ],
    sections: [
      {
        id: `s-${Date.now()}`,
        title: 'Section A: Short Answer Questions',
        description: 'Answer all questions. Each question carries 1 mark.',
        questions: []
      }
    ],
    isSectionless: false,
    directQuestions: []
  });

  const calculatedTotalMarks = paperState.isSectionless
    ? paperState.directQuestions.reduce((sum, q) => sum + q.marks, 0)
    : paperState.sections.reduce(
        (sum, section) => sum + section.questions.reduce((qSum, q) => qSum + q.marks, 0),
        0
      );

  const handleSavePaper = () => {
    if (!paperState.title.trim()) {
      toast({
        title: "Error",
        description: "Please provide a title for the question paper.",
        variant: "destructive",
      });
      return;
    }

    if (!paperState.isSectionless && paperState.sections.some(section => section.questions.length === 0)) {
      toast({
        title: "Error",
        description: "All sections must have at least one question.",
        variant: "destructive",
      });
      return;
    }

    if (paperState.isSectionless && paperState.directQuestions.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one question to the paper.",
        variant: "destructive",
      });
      return;
    }

    try {
      const paperId = createQuestionPaper({
        title: paperState.title,
        board: paperState.board,
        class: paperState.classLevel,
        subject: paperState.subject,
        createdBy: 'user1',
        totalMarks: calculatedTotalMarks,
        duration: paperState.duration,
        sections: paperState.isSectionless ? undefined : paperState.sections,
        questions: paperState.isSectionless ? paperState.directQuestions : undefined,
        instructions: paperState.instructions,
        schoolHeader: 'Springfield High School',
        isSectionless: paperState.isSectionless
      });

      toast({
        title: "Success",
        description: "Question paper saved successfully!",
      });

      navigate(`/question-papers`);
    } catch (error) {
      console.error('Error saving paper:', error);
      toast({
        title: "Error",
        description: "Failed to save the question paper. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    paperState,
    setPaperState,
    calculatedTotalMarks,
    handleSavePaper
  };
};
