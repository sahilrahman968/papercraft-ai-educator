
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreatePaperState } from '@/hooks/useCreatePaper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save, Trash2 } from 'lucide-react';
import { QuestionType, Difficulty, BloomLevel } from '@/types';

interface DirectQuestionsListProps {
  paperState: CreatePaperState;
  setPaperState: React.Dispatch<React.SetStateAction<CreatePaperState>>;
}

const QUESTION_TYPES: QuestionType[] = ['MCQ', 'Short Answer', 'Long Answer', 'Fill in the Blank', 'Match the Following', 'Assertion and Reason'];
const DIFFICULTY_LEVELS: Difficulty[] = ['Easy', 'Medium', 'Hard'];
const BLOOM_LEVELS: BloomLevel[] = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];

export const DirectQuestionsList: React.FC<DirectQuestionsListProps> = ({
  paperState,
  setPaperState
}) => {
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [questionData, setQuestionData] = useState({
    text: '',
    type: 'Short Answer' as QuestionType,
    difficulty: 'Medium' as Difficulty, 
    marks: 5,
    bloomLevel: 'Understand' as BloomLevel,
  });

  const addNewQuestion = () => {
    if (!questionData.text.trim()) {
      return; // Don't add empty questions
    }

    setPaperState(prev => ({
      ...prev,
      directQuestions: [
        ...prev.directQuestions,
        {
          id: `q-${Date.now()}`,
          text: questionData.text,
          type: questionData.type,
          board: prev.board,
          class: prev.classLevel,
          subject: prev.subject,
          chapter: '',
          topic: '',
          difficulty: questionData.difficulty,
          marks: questionData.marks,
          bloomLevel: questionData.bloomLevel
        }
      ]
    }));

    // Reset form
    setQuestionData({
      text: '',
      type: 'Short Answer',
      difficulty: 'Medium',
      marks: 5,
      bloomLevel: 'Understand',
    });
    setIsAddingQuestion(false);
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
        <Button 
          onClick={() => setIsAddingQuestion(true)}
          size="sm"
          className="bg-educate-400 hover:bg-educate-500"
          disabled={isAddingQuestion}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Question
        </Button>
      </CardHeader>
      <CardContent>
        {isAddingQuestion && (
          <div className="border rounded-md p-4 mb-6 bg-gray-50">
            <h4 className="font-medium mb-2">Add New Question</h4>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="question-text">Question Text</Label>
                <Textarea
                  id="question-text"
                  value={questionData.text}
                  onChange={(e) => setQuestionData({...questionData, text: e.target.value})}
                  placeholder="Enter the question text here..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="question-type">Question Type</Label>
                  <Select
                    value={questionData.type}
                    onValueChange={(value: QuestionType) => setQuestionData({...questionData, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {QUESTION_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="question-difficulty">Difficulty</Label>
                  <Select
                    value={questionData.difficulty}
                    onValueChange={(value: Difficulty) => setQuestionData({...questionData, difficulty: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTY_LEVELS.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="question-marks">Marks</Label>
                  <Input
                    id="question-marks"
                    type="number"
                    min={1}
                    max={25}
                    value={questionData.marks}
                    onChange={(e) => setQuestionData({...questionData, marks: parseInt(e.target.value) || 1})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="question-bloom">Bloom's Taxonomy Level</Label>
                <Select
                  value={questionData.bloomLevel}
                  onValueChange={(value: BloomLevel) => setQuestionData({...questionData, bloomLevel: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOM_LEVELS.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2 mt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddingQuestion(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={addNewQuestion}
                  className="bg-educate-400 hover:bg-educate-500"
                >
                  <Save className="mr-1 h-4 w-4" />
                  Save Question
                </Button>
              </div>
            </div>
          </div>
        )}

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
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded mr-2">{question.type}</span>
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
                  <span>|</span>
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
