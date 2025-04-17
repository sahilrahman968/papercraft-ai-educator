
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ManualQuestionForm } from './ManualQuestionForm';
import { QuestionBankSelector } from './QuestionBankSelector';
import { AIQuestionGenerator } from './AIQuestionGenerator';
import { Question } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuestionAddModalProps {
  onQuestionAdd: (question: Question) => void;
  subject: string;
}

export const QuestionAddModal: React.FC<QuestionAddModalProps> = ({
  onQuestionAdd,
  subject
}) => {
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('manual');
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);

  const handleQuestionAdded = (question: Question) => {
    setPreviewQuestion(question);
  };

  const confirmAndAddQuestion = () => {
    if (previewQuestion) {
      onQuestionAdd(previewQuestion);
      setPreviewQuestion(null);
      setOpen(false);
    }
  };

  const renderQuestionPreview = () => {
    if (!previewQuestion) return null;

    const renderQuestionContent = () => {
      switch(previewQuestion.type) {
        case 'MCQ':
          return (
            <div className="mt-3 space-y-2">
              <p className="font-medium">Options:</p>
              <ul className="list-disc list-inside pl-2">
                {previewQuestion.options?.map((option, i) => (
                  <li key={i} className={previewQuestion.answer === option ? "font-medium text-green-600" : ""}>
                    {option} {previewQuestion.answer === option && "(Correct)"}
                  </li>
                ))}
              </ul>
            </div>
          );
          
        case 'Match the Following':
          return (
            <div className="mt-3 space-y-2">
              <p className="font-medium">Match Pairs:</p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Column A</p>
                  {previewQuestion.matchPairs?.map((pair, i) => (
                    <div key={i} className="border p-2 rounded">{pair.left}</div>
                  ))}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Column B</p>
                  {previewQuestion.matchPairs?.map((pair, i) => (
                    <div key={i} className="border p-2 rounded">{pair.right}</div>
                  ))}
                </div>
              </div>
            </div>
          );
          
        case 'Comprehension':
          return (
            <div className="mt-3 space-y-3">
              <div className="bg-gray-50 p-3 rounded">
                <p className="font-medium mb-2">Passage:</p>
                <p>{previewQuestion.text}</p>
              </div>
              <p className="font-medium">Sub Questions:</p>
              <div className="space-y-3 pl-4">
                {previewQuestion.subQuestions?.map((subQ, i) => (
                  <div key={subQ.id} className="border-l-2 border-gray-300 pl-3">
                    <p className="font-medium">Q{i+1}. {subQ.text} ({subQ.marks} marks)</p>
                    {subQ.options && subQ.options.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Options:</p>
                        <ul className="list-disc list-inside text-sm pl-2">
                          {subQ.options.map((opt, j) => (
                            <li key={j} className={subQ.answer === opt ? "font-medium text-green-600" : ""}>
                              {opt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {subQ.answer && <p className="text-sm mt-1"><span className="font-medium">Answer:</span> {subQ.answer}</p>}
                  </div>
                ))}
              </div>
            </div>
          );
          
        case 'Assertion and Reason':
          return (
            <div className="mt-3 space-y-3">
              <div>
                <p className="font-medium">Assertion:</p>
                <p className="pl-3">{previewQuestion.assertionText}</p>
              </div>
              <div>
                <p className="font-medium">Reason:</p>
                <p className="pl-3">{previewQuestion.reasonText}</p>
              </div>
              {previewQuestion.answer && (
                <p><span className="font-medium">Answer:</span> {previewQuestion.answer}</p>
              )}
            </div>
          );
          
        default:
          return previewQuestion.answer ? (
            <div className="mt-3">
              <p className="font-medium">Answer:</p>
              <p className="pl-3">{previewQuestion.answer}</p>
            </div>
          ) : null;
      }
    };

    return (
      <Card className="mt-4 border-2 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">Question Preview</h3>
            <div className="space-x-2">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{previewQuestion.difficulty}</Badge>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{previewQuestion.marks} marks</Badge>
              <Badge>{previewQuestion.type}</Badge>
            </div>
          </div>
          
          {previewQuestion.type !== 'Comprehension' && (
            <p className="text-gray-800 my-2">{previewQuestion.text}</p>
          )}
          
          {renderQuestionContent()}
          
          <div className="flex justify-end mt-4">
            <Button 
              onClick={confirmAndAddQuestion}
              className="bg-educate-500 hover:bg-educate-600"
            >
              Add to Paper
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Question
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Add Question</DialogTitle>
        </DialogHeader>
        
        <Tabs 
          defaultValue="manual" 
          className="w-full flex-1 flex flex-col overflow-hidden"
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <TabsList className="grid w-full grid-cols-3 px-6">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="bank">Question Bank</TabsTrigger>
            <TabsTrigger value="ai">AI Generate</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-[calc(90vh-10rem)]">
              <div className="px-6 py-4">
                <TabsContent value="manual" className="mt-0 data-[state=active]:flex data-[state=active]:flex-col">
                  <ManualQuestionForm onSubmit={handleQuestionAdded} subject={subject} />
                </TabsContent>
                
                <TabsContent value="bank" className="mt-0">
                  <QuestionBankSelector onSelect={handleQuestionAdded} subject={subject} />
                </TabsContent>
                
                <TabsContent value="ai" className="mt-0">
                  <AIQuestionGenerator onGenerate={handleQuestionAdded} subject={subject} />
                </TabsContent>
                
                {previewQuestion && renderQuestionPreview()}
              </div>
            </ScrollArea>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
