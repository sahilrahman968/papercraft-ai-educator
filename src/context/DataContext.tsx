
import React, { createContext, useContext, useState } from 'react';
import { 
  Board, 
  Difficulty, 
  Question, 
  QuestionPaper, 
  QuestionType, 
  User,
  BloomLevel,
  School,
  Section
} from '@/types';
import { generateMockQuestions, generateMockQuestionPapers } from '@/lib/mockData';

interface DataContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  questions: Question[];
  addQuestion: (question: Omit<Question, 'id'>) => string;
  updateQuestion: (id: string, question: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  questionPapers: QuestionPaper[];
  currentPaper: QuestionPaper | null;
  setCurrentPaper: (paper: QuestionPaper | null) => void;
  createQuestionPaper: (paper: Omit<QuestionPaper, 'id' | 'createdAt'>) => string;
  updateQuestionPaper: (id: string, paper: Partial<QuestionPaper>) => void;
  deleteQuestionPaper: (id: string) => void;
  addQuestionToPaper: (paperId: string, sectionId: string, question: Question) => void;
  removeQuestionFromPaper: (paperId: string, sectionId: string, questionId: string) => void;
  addSectionToPaper: (paperId: string, section: Omit<Section, 'id'>) => void;
  removeSectionFromPaper: (paperId: string, sectionId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mockUser: User = {
    id: 'user1',
    name: 'Mr. John Doe',
    email: 'john.doe@example.edu',
    role: 'Teacher',
    school: 'Springfield High School',
    subjects: ['Biology', 'Chemistry'],
  };

  const [user, setUser] = useState<User | null>(mockUser);
  const [questions, setQuestions] = useState<Question[]>(generateMockQuestions());
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>(generateMockQuestionPapers());
  const [currentPaper, setCurrentPaper] = useState<QuestionPaper | null>(null);

  const addQuestion = (question: Omit<Question, 'id'>) => {
    const newQuestion = { ...question, id: `q-${Date.now()}` };
    setQuestions([...questions, newQuestion as Question]);
    return newQuestion.id;
  };

  const updateQuestion = (id: string, updatedFields: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updatedFields } : q));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const createQuestionPaper = (paper: Omit<QuestionPaper, 'id' | 'createdAt'>) => {
    const id = `qp-${Date.now()}`;
    const newPaper = { 
      ...paper, 
      id, 
      createdAt: new Date(),
      // Ensure we have either sections or questions depending on isSectionless
      sections: paper.isSectionless ? undefined : (paper.sections || []),
      questions: paper.isSectionless ? (paper.questions || []) : undefined,
    };
    setQuestionPapers([...questionPapers, newPaper as QuestionPaper]);
    return id;
  };

  const updateQuestionPaper = (id: string, updatedFields: Partial<QuestionPaper>) => {
    setQuestionPapers(
      questionPapers.map(qp => qp.id === id ? { ...qp, ...updatedFields } : qp)
    );
    
    if (currentPaper?.id === id) {
      setCurrentPaper({ ...currentPaper, ...updatedFields });
    }
  };

  const deleteQuestionPaper = (id: string) => {
    setQuestionPapers(questionPapers.filter(qp => qp.id !== id));
    if (currentPaper?.id === id) {
      setCurrentPaper(null);
    }
  };

  const addQuestionToPaper = (paperId: string, sectionId: string, question: Question) => {
    setQuestionPapers(
      questionPapers.map(qp => {
        if (qp.id === paperId) {
          return {
            ...qp,
            sections: qp.sections.map(section => {
              if (section.id === sectionId) {
                return {
                  ...section,
                  questions: [...section.questions, question]
                };
              }
              return section;
            })
          };
        }
        return qp;
      })
    );
    
    if (currentPaper?.id === paperId) {
      setCurrentPaper({
        ...currentPaper,
        sections: currentPaper.sections.map(section => {
          if (section.id === sectionId) {
            return {
              ...section,
              questions: [...section.questions, question]
            };
          }
          return section;
        })
      });
    }
  };

  const removeQuestionFromPaper = (paperId: string, sectionId: string, questionId: string) => {
    setQuestionPapers(
      questionPapers.map(qp => {
        if (qp.id === paperId) {
          return {
            ...qp,
            sections: qp.sections.map(section => {
              if (section.id === sectionId) {
                return {
                  ...section,
                  questions: section.questions.filter(q => q.id !== questionId)
                };
              }
              return section;
            })
          };
        }
        return qp;
      })
    );
    
    if (currentPaper?.id === paperId) {
      setCurrentPaper({
        ...currentPaper,
        sections: currentPaper.sections.map(section => {
          if (section.id === sectionId) {
            return {
              ...section,
              questions: section.questions.filter(q => q.id !== questionId)
            };
          }
          return section;
        })
      });
    }
  };

  const addSectionToPaper = (paperId: string, section: Omit<Section, 'id'>) => {
    const newSection = { ...section, id: `s-${Date.now()}` };
    
    setQuestionPapers(
      questionPapers.map(qp => {
        if (qp.id === paperId) {
          return {
            ...qp,
            sections: [...qp.sections, newSection as Section]
          };
        }
        return qp;
      })
    );
    
    if (currentPaper?.id === paperId) {
      setCurrentPaper({
        ...currentPaper,
        sections: [...currentPaper.sections, newSection as Section]
      });
    }
  };

  const removeSectionFromPaper = (paperId: string, sectionId: string) => {
    setQuestionPapers(
      questionPapers.map(qp => {
        if (qp.id === paperId) {
          return {
            ...qp,
            sections: qp.sections.filter(s => s.id !== sectionId)
          };
        }
        return qp;
      })
    );
    
    if (currentPaper?.id === paperId) {
      setCurrentPaper({
        ...currentPaper,
        sections: currentPaper.sections.filter(s => s.id !== sectionId)
      });
    }
  };

  return (
    <DataContext.Provider
      value={{
        user,
        setUser,
        questions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        questionPapers,
        currentPaper,
        setCurrentPaper,
        createQuestionPaper,
        updateQuestionPaper,
        deleteQuestionPaper,
        addQuestionToPaper,
        removeQuestionFromPaper,
        addSectionToPaper,
        removeSectionFromPaper,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
