
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CreatePaperState } from '@/hooks/useCreatePaper';

interface PaperStructureCardProps {
  paperState: CreatePaperState;
  setPaperState: React.Dispatch<React.SetStateAction<CreatePaperState>>;
}

export const PaperStructureCard: React.FC<PaperStructureCardProps> = ({
  paperState,
  setPaperState
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Paper Structure</CardTitle>
        <div className="flex items-center space-x-2">
          <Label htmlFor="sectionless">Section-less Paper</Label>
          <Switch
            id="sectionless"
            checked={paperState.isSectionless}
            onCheckedChange={(checked) => setPaperState(prev => ({ ...prev, isSectionless: checked }))}
          />
        </div>
      </CardHeader>
    </Card>
  );
};
