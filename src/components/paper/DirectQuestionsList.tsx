
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreatePaperState } from '@/hooks/useCreatePaper';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface DirectQuestionsListProps {
  paperState: CreatePaperState;
  setPaperState: React.Dispatch<React.SetStateAction<CreatePaperState>>;
}

export const DirectQuestionsList: React.FC<DirectQuestionsListProps> = ({
  paperState,
  setPaperState
}) => {
  const addNewQuestion = () => {
    setPaperState(prev => ({
      ...prev,
      directQuestions: [
        ...prev.directQuestions,
        {
          id: `q-${Date.now()}`,
          text: 'New question text',
          type: 'Short Answer',
          board: prev.board,
          class: prev.classLevel,
          subject: prev.subject,
          chapter: '',
          topic: '',
          difficulty: 'Medium',
          marks: 5,
          bloomLevel: 'Understand'
        }
      ]
    }));
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Questions</CardTitle>
        <Button 
          onClick={addNewQuestion}
          size="sm"
          className="bg-educate-400 hover:bg-educate-500"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Question
        </Button>
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
                  <span className="text-sm text-gray-600">{question.type}</span>
                </div>
                <p className="mt-2">{question.text}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
