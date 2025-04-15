
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ManualQuestionForm } from './ManualQuestionForm';
import { QuestionBankSelector } from './QuestionBankSelector';
import { AIQuestionGenerator } from './AIQuestionGenerator';
import { Question } from '@/types';

interface QuestionAddModalProps {
  onQuestionAdd: (question: Question) => void;
  subject: string;
}

export const QuestionAddModal: React.FC<QuestionAddModalProps> = ({
  onQuestionAdd,
  subject
}) => {
  const [open, setOpen] = useState(false);

  const handleQuestionAdded = (question: Question) => {
    onQuestionAdd(question);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Question
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Question</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="bank">Question Bank</TabsTrigger>
            <TabsTrigger value="ai">AI Generate</TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <ManualQuestionForm onSubmit={handleQuestionAdded} subject={subject} />
          </TabsContent>
          <TabsContent value="bank">
            <QuestionBankSelector onSelect={handleQuestionAdded} subject={subject} />
          </TabsContent>
          <TabsContent value="ai">
            <AIQuestionGenerator onGenerate={handleQuestionAdded} subject={subject} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
