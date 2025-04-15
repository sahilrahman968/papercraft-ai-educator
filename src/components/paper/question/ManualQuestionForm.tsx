
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Question, QuestionType, Difficulty, BloomLevel, QUESTION_TYPES, DIFFICULTY_LEVELS, BLOOM_LEVELS } from '@/types';

interface ManualQuestionFormProps {
  onSubmit: (question: Question) => void;
  subject: string;
}

export const ManualQuestionForm: React.FC<ManualQuestionFormProps> = ({ onSubmit, subject }) => {
  const [questionData, setQuestionData] = useState({
    text: '',
    type: 'Short Answer' as QuestionType,
    difficulty: 'Medium' as Difficulty,
    marks: 5,
    bloomLevel: 'Understand' as BloomLevel,
    chapter: '',
    topic: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: `q-${Date.now()}`,
      ...questionData,
      board: 'CBSE',
      class: '10',
      subject
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="question-text">Question Text</Label>
        <Textarea
          id="question-text"
          value={questionData.text}
          onChange={(e) => setQuestionData({...questionData, text: e.target.value})}
          placeholder="Enter the question text here..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="chapter">Chapter</Label>
          <Input
            id="chapter"
            value={questionData.chapter}
            onChange={(e) => setQuestionData({...questionData, chapter: e.target.value})}
            placeholder="Enter chapter name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            value={questionData.topic}
            onChange={(e) => setQuestionData({...questionData, topic: e.target.value})}
            placeholder="Enter topic name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          <Label htmlFor="difficulty">Difficulty</Label>
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
          <Label htmlFor="marks">Marks</Label>
          <Input
            id="marks"
            type="number"
            min={1}
            max={25}
            value={questionData.marks}
            onChange={(e) => setQuestionData({...questionData, marks: parseInt(e.target.value) || 1})}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bloom-level">Bloom's Level</Label>
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
      </div>

      <Button type="submit" className="w-full">Add Question</Button>
    </form>
  );
};
