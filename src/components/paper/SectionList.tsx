
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

interface SectionListProps {
  paperState: CreatePaperState;
  setPaperState: React.Dispatch<React.SetStateAction<CreatePaperState>>;
}

export const SectionList: React.FC<SectionListProps> = ({ 
  paperState, 
  setPaperState 
}) => {
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);

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
                                <span>•</span>
                                <span>{question.bloomLevel}</span>
                              </div>
                            </div>
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
