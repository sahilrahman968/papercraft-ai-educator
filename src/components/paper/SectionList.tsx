
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreatePaperState } from '@/hooks/useCreatePaper';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, ChevronDown, ChevronUp, Save, Trash2 } from 'lucide-react';
import { QuestionType, Difficulty, BloomLevel } from '@/types';

interface SectionListProps {
  paperState: CreatePaperState;
  setPaperState: React.Dispatch<React.SetStateAction<CreatePaperState>>;
}

const QUESTION_TYPES: QuestionType[] = ['MCQ', 'Short Answer', 'Long Answer', 'Fill in the Blank', 'Match the Following', 'Assertion and Reason'];
const DIFFICULTY_LEVELS: Difficulty[] = ['Easy', 'Medium', 'Hard'];
const BLOOM_LEVELS: BloomLevel[] = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];

export const SectionList: React.FC<SectionListProps> = ({ 
  paperState, 
  setPaperState 
}) => {
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);
  const [newQuestionForSection, setNewQuestionForSection] = useState<string | null>(null);
  const [questionData, setQuestionData] = useState({
    text: '',
    type: 'Short Answer' as QuestionType,
    difficulty: 'Medium' as Difficulty, 
    marks: 5,
    bloomLevel: 'Understand' as BloomLevel,
  });

  const addNewSection = () => {
    setPaperState(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: `s-${Date.now()}`,
          title: `Section ${prev.sections.length + 1}`,
          description: 'New section description',
          questions: []
        }
      ]
    }));
  };

  const toggleSection = (sectionId: string) => {
    setOpenSectionId(openSectionId === sectionId ? null : sectionId);
    // Reset question form when closing or changing sections
    if (openSectionId !== sectionId) {
      setNewQuestionForSection(null);
      setQuestionData({
        text: '',
        type: 'Short Answer',
        difficulty: 'Medium',
        marks: 5,
        bloomLevel: 'Understand',
      });
    }
  };

  const startAddingQuestion = (sectionId: string) => {
    setNewQuestionForSection(sectionId);
  };

  const cancelAddingQuestion = () => {
    setNewQuestionForSection(null);
    setQuestionData({
      text: '',
      type: 'Short Answer',
      difficulty: 'Medium',
      marks: 5,
      bloomLevel: 'Understand',
    });
  };

  const addQuestionToSection = (sectionId: string) => {
    if (!questionData.text.trim()) {
      return; // Don't add empty questions
    }

    setPaperState(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            questions: [
              ...section.questions,
              {
                id: `q-${Date.now()}`,
                text: questionData.text,
                type: questionData.type,
                board: prev.board,
                class: prev.classLevel,
                subject: prev.subject,
                chapter: '',
                topic: '',
                difficulty: questionData.difficulty,
                marks: questionData.marks,
                bloomLevel: questionData.bloomLevel
              }
            ]
          };
        }
        return section;
      })
    }));

    // Reset form after adding
    setNewQuestionForSection(null);
    setQuestionData({
      text: '',
      type: 'Short Answer',
      difficulty: 'Medium',
      marks: 5,
      bloomLevel: 'Understand',
    });
  };

  const removeQuestion = (sectionId: string, questionId: string) => {
    setPaperState(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            questions: section.questions.filter(q => q.id !== questionId)
          };
        }
        return section;
      })
    }));
  };

  const updateSectionDetails = (sectionId: string, field: 'title' | 'description', value: string) => {
    setPaperState(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            [field]: value
          };
        }
        return section;
      })
    }));
  };

  const removeSection = (sectionId: string) => {
    setPaperState(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sections</CardTitle>
        <Button 
          onClick={addNewSection}
          size="sm"
          className="bg-educate-400 hover:bg-educate-500"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Section
        </Button>
      </CardHeader>
      <CardContent>
        {paperState.sections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No sections added yet. Click "Add Section" to create your first section.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paperState.sections.map((section, index) => (
              <Collapsible 
                key={section.id} 
                open={openSectionId === section.id}
                onOpenChange={() => toggleSection(section.id)}
                className="border rounded-md overflow-hidden"
              >
                <div className="p-4 bg-gray-50 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{section.title}</h3>
                    <p className="text-sm text-gray-600">{section.description}</p>
                    <div className="mt-1">
                      <p className="text-sm">
                        {section.questions.length} questions | 
                        {section.questions.reduce((sum, q) => sum + q.marks, 0)} marks
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSection(section.id);
                      }}
                    >
                      {openSectionId === section.id ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                </div>
                
                <CollapsibleContent>
                  <div className="p-4 border-t">
                    <div className="space-y-4 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor={`section-title-${section.id}`}>Section Title</Label>
                        <Input
                          id={`section-title-${section.id}`}
                          value={section.title}
                          onChange={(e) => updateSectionDetails(section.id, 'title', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`section-desc-${section.id}`}>Description</Label>
                        <Textarea
                          id={`section-desc-${section.id}`}
                          value={section.description || ''}
                          onChange={(e) => updateSectionDetails(section.id, 'description', e.target.value)}
                          rows={2}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeSection(section.id)}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Remove Section
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Questions</h4>
                      
                      {section.questions.length === 0 ? (
                        <p className="text-sm text-gray-500 mb-4">No questions added to this section yet.</p>
                      ) : (
                        <div className="space-y-3 mb-4">
                          {section.questions.map((question, qIndex) => (
                            <div key={question.id} className="border rounded-md p-3 bg-white">
                              <div className="flex justify-between">
                                <span className="font-medium">Q{qIndex + 1}. ({question.marks} marks)</span>
                                <div>
                                  <span className="text-sm bg-gray-100 px-2 py-1 rounded mr-2">{question.type}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => removeQuestion(section.id, question.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                              <p className="mt-2 text-gray-700">{question.text}</p>
                              <div className="flex mt-2 text-xs text-gray-500 space-x-2">
                                <span>{question.difficulty}</span>
                                <span>|</span>
                                <span>{question.bloomLevel}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {newQuestionForSection === section.id ? (
                        <div className="border rounded-md p-4 mt-2 bg-gray-50">
                          <h4 className="font-medium mb-2">Add New Question</h4>
                          
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor={`question-text-${section.id}`}>Question Text</Label>
                              <Textarea
                                id={`question-text-${section.id}`}
                                value={questionData.text}
                                onChange={(e) => setQuestionData({...questionData, text: e.target.value})}
                                placeholder="Enter the question text here..."
                                rows={3}
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="space-y-2">
                                <Label htmlFor={`question-type-${section.id}`}>Question Type</Label>
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
                                <Label htmlFor={`question-difficulty-${section.id}`}>Difficulty</Label>
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
                                <Label htmlFor={`question-marks-${section.id}`}>Marks</Label>
                                <Input
                                  id={`question-marks-${section.id}`}
                                  type="number"
                                  min={1}
                                  max={25}
                                  value={questionData.marks}
                                  onChange={(e) => setQuestionData({...questionData, marks: parseInt(e.target.value) || 1})}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`question-bloom-${section.id}`}>Bloom's Taxonomy Level</Label>
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
                            
                            <div className="flex justify-end space-x-2 mt-2">
                              <Button 
                                variant="outline" 
                                onClick={cancelAddingQuestion}
                              >
                                Cancel
                              </Button>
                              <Button 
                                onClick={() => addQuestionToSection(section.id)}
                                className="bg-educate-400 hover:bg-educate-500"
                              >
                                <Save className="mr-1 h-4 w-4" />
                                Save Question
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => startAddingQuestion(section.id)}
                          size="sm"
                          className="mt-2"
                          variant="outline"
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          Add Question
                        </Button>
                      )}
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
