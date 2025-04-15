
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Question, QuestionType, Difficulty, QUESTION_TYPES, DIFFICULTY_LEVELS } from '@/types';
import { useData } from '@/context/DataContext';
import { Search } from 'lucide-react';

interface QuestionBankSelectorProps {
  onSelect: (question: Question) => void;
  subject: string;
}

export const QuestionBankSelector: React.FC<QuestionBankSelectorProps> = ({ onSelect, subject }) => {
  const { questions } = useData();
  const [filters, setFilters] = useState({
    searchTerm: '',
    type: '' as QuestionType | '',
    difficulty: '' as Difficulty | '',
    chapter: '',
    topic: ''
  });

  const filteredQuestions = questions.filter(q => {
    return (
      q.subject === subject &&
      (!filters.searchTerm || q.text.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
      (!filters.type || q.type === filters.type) &&
      (!filters.difficulty || q.difficulty === filters.difficulty) &&
      (!filters.chapter || q.chapter.toLowerCase().includes(filters.chapter.toLowerCase())) &&
      (!filters.topic || q.topic.toLowerCase().includes(filters.topic.toLowerCase()))
    );
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={filters.searchTerm}
            onChange={(e) => setFilters(f => ({ ...f, searchTerm: e.target.value }))}
            className="pl-8"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Question Type</Label>
          <Select
            value={filters.type}
            onValueChange={(value: QuestionType | '') => setFilters(f => ({ ...f, type: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All types</SelectItem>
              {QUESTION_TYPES.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto space-y-2">
        {filteredQuestions.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No questions found matching your criteria</p>
        ) : (
          filteredQuestions.map(question => (
            <div
              key={question.id}
              className="border rounded-lg p-4 hover:bg-accent cursor-pointer"
              onClick={() => onSelect(question)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">{question.text}</span>
                <span className="text-sm bg-secondary px-2 py-1 rounded">
                  {question.marks} marks
                </span>
              </div>
              <div className="flex gap-2 text-sm text-muted-foreground">
                <span>{question.type}</span>
                <span>•</span>
                <span>{question.difficulty}</span>
                <span>•</span>
                <span>{question.chapter}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
