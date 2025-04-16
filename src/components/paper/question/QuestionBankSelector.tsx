
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Question, QuestionType, Difficulty, QUESTION_TYPES, DIFFICULTY_LEVELS } from '@/types';
import { useData } from '@/context/DataContext';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface QuestionBankSelectorProps {
  onSelect: (question: Question) => void;
  subject: string;
}

export const QuestionBankSelector: React.FC<QuestionBankSelectorProps> = ({ onSelect, subject }) => {
  const { questions } = useData();
  const [filters, setFilters] = useState({
    searchTerm: '',
    type: 'all-types' as QuestionType | 'all-types',
    difficulty: 'all-difficulties' as Difficulty | 'all-difficulties',
    chapter: '',
    topic: ''
  });
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const filteredQuestions = questions.filter(q => {
    return (
      q.subject === subject &&
      (!filters.searchTerm || q.text.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
      (filters.type === 'all-types' || q.type === filters.type) &&
      (filters.difficulty === 'all-difficulties' || q.difficulty === filters.difficulty) &&
      (!filters.chapter || q.chapter.toLowerCase().includes(filters.chapter.toLowerCase())) &&
      (!filters.topic || q.topic.toLowerCase().includes(filters.topic.toLowerCase()))
    );
  });

  const toggleQuestionExpand = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const renderQuestionContent = (question: Question) => {
    switch(question.type) {
      case 'MCQ':
        return (
          <div className="mt-2 space-y-1">
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
          <div className="mt-2 space-y-1">
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
          <div className="mt-2 space-y-2">
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
          <div className="mt-2 space-y-2">
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
          <div className="mt-2">
            <p className="text-sm font-medium">Answer:</p>
            <p className="text-sm pl-2">{question.answer}</p>
          </div>
        ) : null;
    }
  };

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
            onValueChange={(value: QuestionType | 'all-types') => setFilters(f => ({ ...f, type: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">All types</SelectItem>
              {QUESTION_TYPES.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select
            value={filters.difficulty}
            onValueChange={(value: Difficulty | 'all-difficulties') => setFilters(f => ({ ...f, difficulty: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="All difficulties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-difficulties">All difficulties</SelectItem>
              {DIFFICULTY_LEVELS.map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="chapter">Chapter</Label>
          <Input
            id="chapter"
            placeholder="Filter by chapter"
            value={filters.chapter}
            onChange={(e) => setFilters(f => ({ ...f, chapter: e.target.value }))}
          />
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto space-y-2">
        {filteredQuestions.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No questions found matching your criteria</p>
        ) : (
          filteredQuestions.map(question => (
            <Collapsible
              key={question.id}
              open={expandedQuestion === question.id}
              onOpenChange={() => toggleQuestionExpand(question.id)}
              className="border rounded-lg overflow-hidden"
            >
              <div 
                className="p-4 hover:bg-accent cursor-pointer"
                onClick={() => toggleQuestionExpand(question.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {question.type === 'Comprehension' ? 'Comprehension Passage' : question.text}
                      </span>
                      <span className="text-sm bg-secondary px-2 py-1 rounded ml-2 whitespace-nowrap">
                        {question.marks} marks
                      </span>
                    </div>
                    <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                      <span>{question.type}</span>
                      <span>•</span>
                      <span>{question.difficulty}</span>
                      <span>•</span>
                      <span>{question.chapter}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleQuestionExpand(question.id);
                    }}
                  >
                    {expandedQuestion === question.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>
                </div>
              </div>
              <CollapsibleContent>
                <div className="px-4 pb-4 pt-0 border-t">
                  {renderQuestionContent(question)}
                  <Button 
                    onClick={() => onSelect(question)} 
                    className="mt-4 w-full"
                  >
                    Select This Question
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))
        )}
      </div>
    </div>
  );
};
