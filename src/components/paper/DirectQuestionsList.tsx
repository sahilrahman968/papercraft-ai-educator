
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreatePaperState } from '@/hooks/useCreatePaper';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuestionAddModal } from './question/QuestionAddModal';
import { Question, QuestionType } from '@/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

interface DirectQuestionsListProps {
  paperState: CreatePaperState;
  setPaperState: React.Dispatch<React.SetStateAction<CreatePaperState>>;
}

export const DirectQuestionsList: React.FC<DirectQuestionsListProps> = ({
  paperState,
  setPaperState
}) => {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

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

  const toggleQuestionExpand = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const renderQuestionDetails = (question: Question) => {
    switch(question.type) {
      case 'MCQ':
        return (
          <div className="mt-2 pl-4 space-y-1">
            <p className="text-sm font-medium">Options:</p>
            <ul className="list-disc list-inside text-sm pl-2">
              {question.options?.map((option, i) => (
                <li key={i} className={question.answer === option ? "font-medium text-green-600" : ""}>
                  {option} {question.answer === option && "(Correct)"}
                </li>
              ))}
            </ul>
          </div>
        );
        
      case 'Match the Following':
        return (
          <div className="mt-2 pl-4 space-y-1">
            <p className="text-sm font-medium">Match Pairs:</p>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500">Column A</p>
                {question.matchPairs?.map((pair, i) => (
                  <div key={i} className="border p-1 rounded text-sm">{pair.left}</div>
                ))}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500">Column B</p>
                {question.matchPairs?.map((pair, i) => (
                  <div key={i} className="border p-1 rounded text-sm">{pair.right}</div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'Comprehension':
        return (
          <div className="mt-2 pl-4 space-y-2">
            <div className="bg-gray-50 p-2 rounded text-sm">
              <p className="font-medium mb-1">Passage:</p>
              <p>{question.text}</p>
            </div>
            <p className="text-sm font-medium">Sub Questions:</p>
            <div className="space-y-2 pl-4">
              {question.subQuestions?.map((subQ, i) => (
                <div key={subQ.id} className="border-l-2 pl-2">
                  <p className="text-sm font-medium">Q{i+1}. {subQ.text} ({subQ.marks} marks)</p>
                  {subQ.options && subQ.options.length > 0 && (
                    <div className="mt-1">
                      <p className="text-xs font-medium">Options:</p>
                      <ul className="list-disc list-inside text-xs pl-2">
                        {subQ.options.map((opt, j) => (
                          <li key={j} className={subQ.answer === opt ? "font-medium text-green-600" : ""}>
                            {opt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {subQ.answer && <p className="text-xs mt-1"><span className="font-medium">Answer:</span> {subQ.answer}</p>}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'Assertion and Reason':
        return (
          <div className="mt-2 pl-4 space-y-2">
            <div>
              <p className="text-sm font-medium">Assertion:</p>
              <p className="text-sm pl-2">{question.assertionText}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Reason:</p>
              <p className="text-sm pl-2">{question.reasonText}</p>
            </div>
            {question.answer && (
              <p className="text-sm"><span className="font-medium">Answer:</span> {question.answer}</p>
            )}
          </div>
        );
        
      default:
        return question.answer ? (
          <div className="mt-2 pl-4">
            <p className="text-sm font-medium">Answer:</p>
            <p className="text-sm pl-2">{question.answer}</p>
          </div>
        ) : null;
    }
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
              <Collapsible 
                key={question.id} 
                open={expandedQuestion === question.id}
                onOpenChange={() => toggleQuestionExpand(question.id)}
                className="border rounded-md overflow-hidden"
              >
                <CollapsibleTrigger asChild>
                  <div className="p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Q{index + 1}.</span>
                          <Badge className="mr-2">{question.type}</Badge>
                          <Badge variant="outline">{question.marks} marks</Badge>
                        </div>
                        <p className="mt-1 pr-8">
                          {question.type === 'Comprehension' 
                            ? 'Comprehension Passage'
                            : question.text.length > 100 
                              ? `${question.text.substring(0, 100)}...` 
                              : question.text
                          }
                        </p>
                      </div>
                      <div className="flex items-center">
                        {expandedQuestion === question.id 
                          ? <ChevronUp className="h-4 w-4 text-gray-500" /> 
                          : <ChevronDown className="h-4 w-4 text-gray-500" />
                        }
                      </div>
                    </div>
                    <div className="flex mt-2 text-xs text-gray-500 space-x-2">
                      <span>{question.difficulty}</span>
                      <span>•</span>
                      <span>{question.bloomLevel}</span>
                      <span>•</span>
                      <span>{question.chapter}</span>
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4 border-t">
                    {question.type !== 'Comprehension' && (
                      <div className="mt-2">
                        <p className="font-medium">Question:</p>
                        <p className="pl-4">{question.text}</p>
                      </div>
                    )}
                    
                    {renderQuestionDetails(question)}
                    
                    <div className="mt-4 flex justify-end">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove Question
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
