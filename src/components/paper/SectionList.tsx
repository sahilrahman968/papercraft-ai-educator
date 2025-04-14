
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreatePaperState } from '@/hooks/useCreatePaper';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface SectionListProps {
  paperState: CreatePaperState;
  setPaperState: React.Dispatch<React.SetStateAction<CreatePaperState>>;
}

export const SectionList: React.FC<SectionListProps> = ({ 
  paperState, 
  setPaperState 
}) => {
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
              <div key={section.id} className="border rounded-md p-4">
                <h3 className="font-medium">{section.title}</h3>
                <p className="text-sm text-gray-600">{section.description}</p>
                <div className="mt-2">
                  <p className="text-sm">
                    {section.questions.length} questions | 
                    {section.questions.reduce((sum, q) => sum + q.marks, 0)} marks
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
