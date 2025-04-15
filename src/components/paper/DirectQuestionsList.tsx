
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreatePaperState } from '@/hooks/useCreatePaper';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuestionAddModal } from './question/QuestionAddModal';

interface DirectQuestionsListProps {
  paperState: CreatePaperState;
  setPaperState: React.Dispatch<React.SetStateAction<CreatePaperState>>;
}

export const DirectQuestionsList: React.FC<DirectQuestionsListProps> = ({
  paperState,
  setPaperState
}) => {
  const addNewQuestion = (question: Question) => {
    setPaperState(prev => ({
      ...prev,
      directQuestions: [...prev.directQuestions, question]
    }));
  };

  const removeQuestion = (questionId: string) => {
    setPaperState(prev => ({
      ...prev,
      directQuestions: prev.directQuestions.filter(q => q.id !== questionId)
    }));
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Questions</CardTitle>
        <QuestionAddModal onQuestionAdd={addNewQuestion} subject={paperState.subject} />
      </CardHeader>
      <CardContent>
        {paperState.directQuestions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No questions added yet. Click "Add Question" to add your first question.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paperState.directQuestions.map((question, index) => (
              <div key={question.id} className="border rounded-md p-4">
                <div className="flex justify-between">
                  <span className="font-medium">Q{index + 1}. ({question.marks} marks)</span>
                  <div>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded mr-2">
                      {question.type}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <p className="mt-2">{question.text}</p>
                <div className="flex mt-2 text-xs text-gray-500 space-x-2">
                  <span>{question.difficulty}</span>
                  <span>•</span>
                  <span>{question.bloomLevel}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
