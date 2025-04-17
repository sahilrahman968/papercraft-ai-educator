
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Question, 
  QuestionType, 
  Difficulty, 
  BloomLevel, 
  QUESTION_TYPES, 
  DIFFICULTY_LEVELS, 
  BLOOM_LEVELS,
  MatchPair,
  SubQuestion
} from '@/types';
import { Plus, Trash2, FileQuestion } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ManualQuestionFormProps {
  onSubmit: (question: Question) => void;
  subject: string;
}

export const ManualQuestionForm: React.FC<ManualQuestionFormProps> = ({ onSubmit, subject }) => {
  const [questionData, setQuestionData] = useState<Partial<Question>>({
    text: '',
    type: 'Short Answer' as QuestionType,
    difficulty: 'Medium' as Difficulty,
    marks: 5,
    bloomLevel: 'Understand' as BloomLevel,
    chapter: '',
    topic: '',
    options: [],
    matchPairs: [],
    subQuestions: []
  });

  // For MCQ options
  const [newOption, setNewOption] = useState('');
  
  // For Match the Following pairs
  const [newMatchLeft, setNewMatchLeft] = useState('');
  const [newMatchRight, setNewMatchRight] = useState('');
  
  // For Comprehension sub-questions
  const [newSubQuestion, setNewSubQuestion] = useState<Partial<SubQuestion>>({
    text: '',
    marks: 1,
    type: 'Short Answer' as QuestionType,
    options: []
  });
  const [newSubQuestionOption, setNewSubQuestionOption] = useState('');

  // For Assertion and Reason
  useEffect(() => {
    if (questionData.type !== 'Assertion and Reason') {
      setQuestionData(prev => ({...prev, assertionText: '', reasonText: ''}));
    }
  }, [questionData.type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: `q-${Date.now()}`,
      ...questionData,
      board: 'CBSE',
      class: '10',
      subject
    } as Question);
  };

  const addOption = () => {
    if (newOption.trim() === '') return;
    setQuestionData({
      ...questionData,
      options: [...(questionData.options || []), newOption.trim()]
    });
    setNewOption('');
  };

  const removeOption = (index: number) => {
    const updatedOptions = [...(questionData.options || [])];
    updatedOptions.splice(index, 1);
    setQuestionData({...questionData, options: updatedOptions});
  };

  const addMatchPair = () => {
    if (newMatchLeft.trim() === '' || newMatchRight.trim() === '') return;
    const newPair: MatchPair = {
      left: newMatchLeft.trim(),
      right: newMatchRight.trim()
    };
    setQuestionData({
      ...questionData,
      matchPairs: [...(questionData.matchPairs || []), newPair]
    });
    setNewMatchLeft('');
    setNewMatchRight('');
  };

  const removeMatchPair = (index: number) => {
    const updatedPairs = [...(questionData.matchPairs || [])];
    updatedPairs.splice(index, 1);
    setQuestionData({...questionData, matchPairs: updatedPairs});
  };

  const addSubQuestionOption = () => {
    if (newSubQuestionOption.trim() === '') return;
    setNewSubQuestion({
      ...newSubQuestion,
      options: [...(newSubQuestion.options || []), newSubQuestionOption.trim()]
    });
    setNewSubQuestionOption('');
  };

  const removeSubQuestionOption = (index: number) => {
    const updatedOptions = [...(newSubQuestion.options || [])];
    updatedOptions.splice(index, 1);
    setNewSubQuestion({...newSubQuestion, options: updatedOptions});
  };

  const addSubQuestion = () => {
    if (!newSubQuestion.text) return;
    const subQ: SubQuestion = {
      id: `sq-${Date.now()}`,
      text: newSubQuestion.text,
      marks: newSubQuestion.marks || 1,
      type: newSubQuestion.type || 'Short Answer',
      options: newSubQuestion.options,
      answer: newSubQuestion.answer
    };
    setQuestionData({
      ...questionData,
      subQuestions: [...(questionData.subQuestions || []), subQ]
    });
    setNewSubQuestion({
      text: '',
      marks: 1,
      type: 'Short Answer',
      options: []
    });
  };

  const removeSubQuestion = (index: number) => {
    const updatedSubQuestions = [...(questionData.subQuestions || [])];
    updatedSubQuestions.splice(index, 1);
    setQuestionData({...questionData, subQuestions: updatedSubQuestions});
  };

  const renderQuestionTypeSpecificFields = () => {
    switch(questionData.type) {
      case 'MCQ':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="space-y-2">
                {(questionData.options || []).map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input value={option} readOnly className="flex-1" />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeOption(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add option"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addOption}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">Correct Answer</Label>
              <Input
                id="answer"
                value={questionData.answer || ''}
                onChange={(e) => setQuestionData({...questionData, answer: e.target.value})}
                placeholder="Enter correct option"
              />
            </div>
          </div>
        );
      
      case 'Match the Following':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Match Pairs</Label>
              <div className="space-y-2">
                {(questionData.matchPairs || []).map((pair, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input value={pair.left} readOnly className="flex-1" />
                    <Input value={pair.right} readOnly className="flex-1" />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeMatchPair(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Left column item"
                  value={newMatchLeft}
                  onChange={(e) => setNewMatchLeft(e.target.value)}
                />
                <Input
                  placeholder="Right column item"
                  value={newMatchRight}
                  onChange={(e) => setNewMatchRight(e.target.value)}
                />
              </div>
              <Button 
                type="button" 
                variant="outline" 
                onClick={addMatchPair}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Pair
              </Button>
            </div>
          </div>
        );
      
      case 'Comprehension':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Passage/Text</Label>
              <Textarea
                value={questionData.text || ''}
                onChange={(e) => setQuestionData({...questionData, text: e.target.value})}
                placeholder="Enter the passage or text for comprehension"
                rows={5}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-medium">Sub Questions</h3>
              
              {(questionData.subQuestions || []).map((subQ, index) => (
                <Card key={subQ.id} className="shadow-sm">
                  <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">Sub Question {index + 1} ({subQ.marks} marks)</CardTitle>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeSubQuestion(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </CardHeader>
                  <CardContent className="py-2 px-4">
                    <p className="mb-1">{subQ.text}</p>
                    <p className="text-sm text-gray-500">Type: {subQ.type}</p>
                    
                    {subQ.options && subQ.options.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Options:</p>
                        <ul className="list-disc list-inside text-sm">
                          {subQ.options.map((opt, i) => (
                            <li key={i}>{opt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {subQ.answer && (
                      <p className="text-sm mt-2"><span className="font-medium">Answer:</span> {subQ.answer}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
              
              <Card className="border-dashed">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-medium">Add New Sub Question</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4 space-y-3">
                  <div>
                    <Label htmlFor="sub-q-text">Question Text</Label>
                    <Textarea
                      id="sub-q-text"
                      value={newSubQuestion.text || ''}
                      onChange={(e) => setNewSubQuestion({...newSubQuestion, text: e.target.value})}
                      placeholder="Enter sub question text"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sub-q-type">Question Type</Label>
                      <Select
                        value={newSubQuestion.type || 'Short Answer'}
                        onValueChange={(value: QuestionType) => setNewSubQuestion({...newSubQuestion, type: value})}
                      >
                        <SelectTrigger id="sub-q-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {QUESTION_TYPES.filter(type => type !== 'Comprehension').map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="sub-q-marks">Marks</Label>
                      <Input
                        id="sub-q-marks"
                        type="number"
                        min={1}
                        value={newSubQuestion.marks || 1}
                        onChange={(e) => setNewSubQuestion({...newSubQuestion, marks: parseInt(e.target.value) || 1})}
                      />
                    </div>
                  </div>
                  
                  {newSubQuestion.type === 'MCQ' && (
                    <div className="space-y-2">
                      <Label>Options</Label>
                      <div className="space-y-2">
                        {(newSubQuestion.options || []).map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Input value={option} readOnly className="flex-1" />
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeSubQuestionOption(index)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add option"
                          value={newSubQuestionOption}
                          onChange={(e) => setNewSubQuestionOption(e.target.value)}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={addSubQuestionOption}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="sub-q-answer">Answer</Label>
                    <Input
                      id="sub-q-answer"
                      value={newSubQuestion.answer || ''}
                      onChange={(e) => setNewSubQuestion({...newSubQuestion, answer: e.target.value})}
                      placeholder="Enter answer"
                    />
                  </div>
                  
                  <Button 
                    type="button" 
                    className="w-full" 
                    onClick={addSubQuestion}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Sub Question
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case 'Assertion and Reason':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assertion-text">Assertion</Label>
              <Textarea
                id="assertion-text"
                value={questionData.assertionText || ''}
                onChange={(e) => setQuestionData({...questionData, assertionText: e.target.value})}
                placeholder="Enter the assertion statement"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason-text">Reason</Label>
              <Textarea
                id="reason-text"
                value={questionData.reasonText || ''}
                onChange={(e) => setQuestionData({...questionData, reasonText: e.target.value})}
                placeholder="Enter the reason statement"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Select
                value={questionData.answer || ''}
                onValueChange={(value) => setQuestionData({...questionData, answer: value})}
              >
                <SelectTrigger id="answer">
                  <SelectValue placeholder="Select the correct answer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A: Both Assertion and Reason are true and Reason is the correct explanation of Assertion</SelectItem>
                  <SelectItem value="B">B: Both Assertion and Reason are true but Reason is not the correct explanation of Assertion</SelectItem>
                  <SelectItem value="C">C: Assertion is true but Reason is false</SelectItem>
                  <SelectItem value="D">D: Assertion is false but Reason is true</SelectItem>
                  <SelectItem value="E">E: Both Assertion and Reason are false</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              value={questionData.answer || ''}
              onChange={(e) => setQuestionData({...questionData, answer: e.target.value})}
              placeholder="Enter the answer"
              rows={3}
            />
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="question-type">Question Type</Label>
          <Select
            value={questionData.type}
            onValueChange={(value: QuestionType) => setQuestionData({...questionData, type: value})}
          >
            <SelectTrigger id="question-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {QUESTION_TYPES.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {questionData.type !== 'Comprehension' && (
          <div className="space-y-2">
            <Label htmlFor="question-text">Question Text</Label>
            <Textarea
              id="question-text"
              value={questionData.text}
              onChange={(e) => setQuestionData({...questionData, text: e.target.value})}
              placeholder="Enter the question text here..."
              required={questionData.type !== 'Comprehension'}
            />
          </div>
        )}

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
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select
              value={questionData.difficulty}
              onValueChange={(value: Difficulty) => setQuestionData({...questionData, difficulty: value})}
            >
              <SelectTrigger id="difficulty">
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
              <SelectTrigger id="bloom-level">
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
      </div>

      {renderQuestionTypeSpecificFields()}

      <Button type="submit" className="w-full">Add Question</Button>
    </form>
  );
};
