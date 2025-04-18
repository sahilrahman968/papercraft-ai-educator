
import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useCreatePaper } from '@/hooks/useCreatePaper';
import { PaperDetailsCard } from '@/components/paper/PaperDetailsCard';
import { PaperStructureCard } from '@/components/paper/PaperStructureCard';
import { SectionList } from '@/components/paper/SectionList';
import { DirectQuestionsList } from '@/components/paper/DirectQuestionsList';
import { useData } from '@/context/DataContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const CreatePaperPage: React.FC = () => {
  const { paperState, setPaperState, calculatedTotalMarks, handleSavePaper } = useCreatePaper();
  const { user } = useData();
  const navigate = useNavigate();

  // Redirect if no subjects are assigned
  React.useEffect(() => {
    if (!user?.subjects.length) {
      toast({
        title: "Access Denied",
        description: "You don't have any subjects assigned to create papers.",
        variant: "destructive"
      });
      navigate('/question-papers');
    }
  }, [user, navigate]);

  // If user has subjects, ensure the paper subject is one of them
  React.useEffect(() => {
    if (user?.subjects.length && !user.subjects.includes(paperState.subject)) {
      setPaperState(prev => ({
        ...prev,
        subject: user.subjects[0]
      }));
    }
  }, [user, paperState.subject, setPaperState]);

  if (!user?.subjects.length) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Create Question Paper</h1>
            <p className="text-gray-600">Build a custom question paper from scratch</p>
          </div>
          
          <Button onClick={handleSavePaper} className="bg-educate-400 hover:bg-educate-500">
            <Save className="mr-2 h-4 w-4" />
            Save Paper
          </Button>
        </div>
        
        <PaperDetailsCard 
          paperState={paperState}
          setPaperState={setPaperState}
          calculatedTotalMarks={calculatedTotalMarks}
        />
        
        <PaperStructureCard 
          paperState={paperState}
          setPaperState={setPaperState}
        />

        {paperState.isSectionless ? (
          <DirectQuestionsList
            paperState={paperState}
            setPaperState={setPaperState}
          />
        ) : (
          <SectionList
            paperState={paperState}
            setPaperState={setPaperState}
          />
        )}
      </div>
    </Layout>
  );
};

export default CreatePaperPage;
