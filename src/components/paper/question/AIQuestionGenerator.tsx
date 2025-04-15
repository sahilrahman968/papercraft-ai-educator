
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Question, QuestionType, Difficulty, BloomLevel } from '@/types';
import { Wand2 } from 'lucide-react';

interface AIQuestionGeneratorProps {
  onGenerate: (question: Question) => void;
  subject: string;
}

export const AIQuestionGenerator: React.FC<AIQuestionGeneratorProps> = ({ onGenerate, subject }) => {
  const [generating, setGenerating] = useState(false);
  const [params, setParams] = useState({
    chapter: '',
    topic: '',
    type: 'Short Answer' as QuestionType,
    difficulty: 'Medium' as Difficulty,
    marks: 5,
    bloomLevel: 'Understand' as BloomLevel
  });

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // For now, we'll create a mock question
      // In a real implementation, this would call an AI service
      const question: Question = {
        id: `q-${Date.now()}`,
        text: `[AI Generated] ${params.difficulty} ${params.type} question about ${params.topic} in ${params.chapter}`,
        type: params.type,
        board: 'CBSE',
        class: '10',
        subject,
        chapter: params.chapter,
        topic: params.topic,
        difficulty: params.difficulty,
        marks: params.marks,
        bloomLevel: params.bloomLevel
      };
      
      onGenerate(question);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Chapter</Label>
          <Input
            value={params.chapter}
            onChange={(e) => setParams(p => ({ ...p, chapter: e.target.value }))}
            placeholder="Enter chapter name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Topic</Label>
          <Input
            value={params.topic}
            onChange={(e) => setParams(p => ({ ...p, topic: e.target.value }))}
            placeholder="Enter topic"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Question Type</Label>
          <Select
            value={params.type}
            onValueChange={(value: QuestionType) => setParams(p => ({ ...p, type: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(QuestionType).map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select
            value={params.difficulty}
            onValueChange={(value: Difficulty) => setParams(p => ({ ...p, difficulty: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Difficulty).map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Marks</Label>
          <Input
            type="number"
            min={1}
            max={25}
            value={params.marks}
            onChange={(e) => setParams(p => ({ ...p, marks: parseInt(e.target.value) || 1 }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Bloom's Level</Label>
          <Select
            value={params.bloomLevel}
            onValueChange={(value: BloomLevel) => setParams(p => ({ ...p, bloomLevel: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(BloomLevel).map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        onClick={handleGenerate} 
        disabled={generating || !params.chapter || !params.topic}
        className="w-full"
      >
        <Wand2 className="mr-2 h-4 w-4" />
        {generating ? 'Generating...' : 'Generate Question'}
      </Button>
    </div>
  );
};
