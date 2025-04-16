
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreatePaperState } from '@/hooks/useCreatePaper';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { QuestionAddModal } from './question/QuestionAddModal';
import { Question, QuestionType } from '@/types';
import { Badge } from '@/components/ui/badge';

interface SectionListProps {
  paperState: CreatePaperState;
  setPaperState: React.Dispatch<React.SetStateAction<CreatePaperState>>;
}

export const SectionList: React.FC<SectionListProps> = ({ 
  paperState, 
  setPaperState 
}) => {
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, string[]>>({});

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
  };

  const toggleQuestionExpand = (sectionId: string, questionId: string) => {
    setExpandedQuestions(prev => {
      const currentExpanded = prev[sectionId] || [];
      if (currentExpanded.includes(questionId)) {
        return {
          ...prev,
          [sectionId]: currentExpanded.filter(id => id !== questionId)
        };
      } else {
        return {
          ...prev,
          [sectionId]: [...currentExpanded, questionId]
        };
      }
    });
  };

  const isQuestionExpanded = (sectionId: string, questionId: string) => {
    return (expandedQuestions[sectionId] || []).includes(questionId);
  };

  const addQuestionToSection = (sectionId: string, question: Question) => {
    setPaperState(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            questions: [...section.questions, question]
          };
        }
        return section;
      })
    }));
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

  const renderQuestionDetails = (question: Question) => {
    switch(question.type) {
      case 'MCQ':
        return (
          <div className="mt-2 pl-4 space-y-1">
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
          <div className="mt-2 pl-4 space-y-1">
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
          <div className="mt-2 pl-4 space-y-2">
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
          <div className="mt-2 pl-4 space-y-2">
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
          <div className="mt-2 pl-4">
            <p className="text-sm font-medium">Answer:</p>
            <p className="text-sm pl-2">{question.answer}</p>
          </div>
        ) : null;
    }
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
            {paperState.sections.map(section => (
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
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Questions</h4>
                        <QuestionAddModal 
                          onQuestionAdd={(question) => addQuestionToSection(section.id, question)} 
                          subject={paperState.subject}
                        />
                      </div>
                      
                      {section.questions.length === 0 ? (
                        <p className="text-sm text-gray-500">No questions added to this section yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {section.questions.map((question, qIndex) => (
                            <Collapsible
                              key={question.id}
                              open={isQuestionExpanded(section.id, question.id)}
                              onOpenChange={() => toggleQuestionExpand(section.id, question.id)}
                              className="border rounded-md overflow-hidden"
                            >
                              <CollapsibleTrigger asChild>
                                <div className="p-3 hover:bg-gray-50 cursor-pointer">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <div className="flex items-center">
                                        <span className="font-medium mr-2">Q{qIndex + 1}.</span>
                                        <Badge className="mr-2">{question.type}</Badge>
                                        <Badge variant="outline">{question.marks} marks</Badge>
                                      </div>
                                      <p className="mt-1 pr-8 text-sm">
                                        {question.type === 'Comprehension' 
                                          ? 'Comprehension Passage'
                                          : question.text.length > 80 
                                            ? `${question.text.substring(0, 80)}...` 
                                            : question.text
                                        }
                                      </p>
                                    </div>
                                    <div className="flex items-center">
                                      {isQuestionExpanded(section.id, question.id) 
                                        ? <ChevronUp className="h-4 w-4 text-gray-500" /> 
                                        : <ChevronDown className="h-4 w-4 text-gray-500" />
                                      }
                                    </div>
                                  </div>
                                  <div className="flex mt-1 text-xs text-gray-500 space-x-2">
                                    <span>{question.difficulty}</span>
                                    <span>•</span>
                                    <span>{question.bloomLevel}</span>
                                  </div>
                                </div>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="px-3 pb-3 pt-0 border-t">
                                  {question.type !== 'Comprehension' && (
                                    <div className="mt-2">
                                      <p className="font-medium">Question:</p>
                                      <p className="pl-4 text-sm">{question.text}</p>
                                    </div>
                                  )}
                                  
                                  {renderQuestionDetails(question)}
                                  
                                  <div className="mt-3 flex justify-end">
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      onClick={() => removeQuestion(section.id, question.id)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" />
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          ))}
                        </div>
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
