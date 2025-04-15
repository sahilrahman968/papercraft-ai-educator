
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CreatePaperState } from '@/hooks/useCreatePaper';
import { Board } from '@/types';
import { useData } from '@/context/DataContext';

const BOARDS: Board[] = ['CBSE', 'ICSE', 'State'];
const CLASSES = ['8', '9', '10', '11', '12'];
const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];

interface PaperDetailsCardProps {
  paperState: CreatePaperState;
  setPaperState: React.Dispatch<React.SetStateAction<CreatePaperState>>;
  calculatedTotalMarks: number;
}

export const PaperDetailsCard: React.FC<PaperDetailsCardProps> = ({
  paperState,
  setPaperState,
  calculatedTotalMarks
}) => {
  const { user } = useData();
  const userSubjects = user?.subjects || [];

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>Paper Details</CardTitle>
        <CardDescription>
          Enter the basic information for this question paper
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="title">Paper Title</Label>
            <Input
              id="title"
              placeholder="e.g., Class 10 Mathematics Half-Yearly Examination"
              value={paperState.title}
              onChange={(e) => setPaperState(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="school">School</Label>
            <Input
              id="school"
              value="Springfield High School"
              disabled
            />
            <p className="text-xs text-gray-500">Set by your school administrator</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="board">Board</Label>
            <Select
              value={paperState.board}
              onValueChange={(value: Board) => setPaperState(prev => ({ ...prev, board: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select board" />
              </SelectTrigger>
              <SelectContent>
                {BOARDS.map(b => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select
              value={paperState.classLevel}
              onValueChange={(value) => setPaperState(prev => ({ ...prev, classLevel: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {CLASSES.map(c => (
                  <SelectItem key={c} value={c}>Class {c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select
              value={paperState.subject}
              onValueChange={(value) => setPaperState({...paperState, subject: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {userSubjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min={30}
              max={240}
              value={paperState.duration}
              onChange={(e) => setPaperState(prev => ({ ...prev, duration: parseInt(e.target.value) || 180 }))}
            />
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <Label htmlFor="instructions">Instructions</Label>
          <Textarea
            id="instructions"
            value={paperState.instructions.join('\n')}
            onChange={(e) => setPaperState(prev => ({
              ...prev,
              instructions: e.target.value.split('\n').filter(line => line.trim())
            }))}
            placeholder="Enter instructions (one per line)"
            className="min-h-[100px]"
          />
          <p className="text-xs text-gray-500">
            Each line will be a separate instruction point
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t flex justify-between">
        <div className="text-sm text-gray-600">
          Total Marks: <span className="font-medium">{calculatedTotalMarks}</span>
          {calculatedTotalMarks !== paperState.totalMarks && (
            <span className="text-yellow-600 ml-2">
              (Target: {paperState.totalMarks})
            </span>
          )}
        </div>
        
        <div className="text-sm text-gray-600">
          Total Questions: <span className="font-medium">
            {paperState.isSectionless 
              ? paperState.directQuestions.length
              : paperState.sections.reduce((sum, section) => sum + section.questions.length, 0)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};
