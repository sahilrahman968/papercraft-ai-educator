
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Question, QuestionType, Difficulty, QUESTION_TYPES, DIFFICULTY_LEVELS } from '@/types';
import { useData } from '@/context/DataContext';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

interface QuestionBankSelectorProps {
  onSelect: (question: Question) => void;
  subject: string;
}

interface SubQuestion {
  questionTitle: string;
  marks: number;
  difficulty: string;
  options?: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  evaluationRubric?: Array<{
    criterion: string;
    weight: number;
    keywordHints: string[];
  }>;
}

interface QuestionSection {
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

export const QuestionBankSelector: React.FC<QuestionBankSelectorProps> = ({ onSelect, subject }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    type: 'all-types' as 'option_based' | 'subjective' | 'all-types',
    difficulty: 'all-difficulties' as string,
    chapter: '',
    topic: ''
  });
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const renderQuestionContent = (subQuestion: SubQuestion) => {
    if (subQuestion.options) {
      return (
        <div className="mt-2 space-y-1">
          <p className="text-sm font-medium">Options:</p>
          <ul className="list-disc list-inside text-sm pl-2">
            {subQuestion.options.map((option) => (
              <li key={option.id} className={option.isCorrect ? "font-medium text-green-600" : ""}>
                {option.text} {option.isCorrect && "(Correct)"}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (subQuestion.evaluationRubric) {
      return (
        <div className="mt-2 space-y-2">
          <p className="text-sm font-medium">Evaluation Rubric:</p>
          {subQuestion.evaluationRubric.map((rubric, index) => (
            <div key={index} className="pl-2 text-sm">
              <p className="font-medium">{rubric.criterion} ({rubric.weight}%)</p>
              <p className="text-gray-600">Key points: {rubric.keywordHints.join(', ')}</p>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const renderQuestion = (question: QuestionSection, index: number) => (
    <Collapsible
      key={index}
      open={expandedQuestion === `${index}`}
      onOpenChange={() => setExpandedQuestion(expandedQuestion === `${index}` ? null : `${index}`)}
      className="border rounded-md overflow-hidden mb-4"
    >
      <CollapsibleTrigger className="w-full">
        <div className="p-4 hover:bg-gray-50">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge>{question.questionType}</Badge>
                <Badge variant="outline">{question.marks} marks</Badge>
                <Badge variant="secondary">{question.difficulty}</Badge>
              </div>
              <p className="mt-2 text-sm">{question.questionTitle || 'Section ' + (index + 1)}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {question.syllabusMapping.chapter.map((ch, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {ch.name}
                  </Badge>
                ))}
              </div>
            </div>
            <Button variant="ghost" size="sm" className="ml-2">
              {expandedQuestion === `${index}` ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="p-4 border-t">
          <div className="space-y-4">
            {question.subQuestions.map((subQ, subIndex) => (
              <div key={subIndex} className="border-l-2 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">Q{subIndex + 1}.</span>
                  <Badge variant="outline">{subQ.marks} marks</Badge>
                  <Badge variant="secondary">{subQ.difficulty}</Badge>
                </div>
                <p className="text-sm mb-2">{subQ.questionTitle}</p>
                {renderQuestionContent(subQ)}
              </div>
            ))}
          </div>
          <Button 
            onClick={() => onSelect(question as any)} 
            className="mt-4 w-full"
          >
            Select This Question
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );

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
            onValueChange={(value: 'option_based' | 'subjective' | 'all-types') => 
              setFilters(f => ({ ...f, type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">All types</SelectItem>
              <SelectItem value="option_based">Option Based</SelectItem>
              <SelectItem value="subjective">Subjective</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {/* This is where we would map through the actual questions array */}
        {/* For now, rendering a placeholder */}
        <div className="text-center text-gray-500 py-4">
          Select filters to view questions
        </div>
      </div>
    </div>
  );
};
