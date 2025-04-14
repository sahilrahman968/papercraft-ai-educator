import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useData } from '@/context/DataContext';
import { 
  Board, 
  GenerateParams, 
  QuestionPaper
} from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { generateQuestionPaper } from '@/lib/aiService';
import { Wand2, Loader2, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const BOARDS: Board[] = ['CBSE', 'ICSE', 'State'];
const CLASSES = ['8', '9', '10', '11', '12'];
const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];
const CHAPTERS_BY_SUBJECT: Record<string, string[]> = {
  'Mathematics': ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics'],
  'Physics': ['Mechanics', 'Electricity', 'Magnetism', 'Optics', 'Thermodynamics'],
  'Chemistry': ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry'],
  'Biology': ['Cell Biology', 'Genetics', 'Ecology', 'Physiology', 'Evolution'],
  'English': ['Grammar', 'Literature', 'Writing', 'Reading Comprehension'],
  'History': ['Ancient History', 'Medieval History', 'Modern History', 'World Wars'],
  'Geography': ['Physical Geography', 'Human Geography', 'Climatology', 'Oceanography']
};

const TOPICS_BY_CHAPTER: Record<string, string[]> = {
  'Algebra': ['Equations', 'Polynomials', 'Matrices', 'Determinants'],
  'Geometry': ['Triangles', 'Circles', 'Coordinate Geometry', 'Vectors'],
  'Trigonometry': ['Angles', 'Sine & Cosine', 'Identities', 'Applications'],
  'Organic Chemistry': ['Hydrocarbons', 'Functional Groups', 'Reactions', 'Stereochemistry'],
  'Mechanics': ['Newton\'s Laws', 'Kinematics', 'Dynamics', 'Work & Energy'],
  'Cell Biology': ['Cell Structure', 'Cell Division', 'Cell Organelles', 'Cell Membranes'],
  // Simplified for brevity
};

const GeneratePaperPage: React.FC = () => {
  const { setCurrentPaper, createQuestionPaper } = useData();
  const navigate = useNavigate();
  
  const [board, setBoard] = useState<Board>('CBSE');
  const [classLevel, setClassLevel] = useState('10');
  const [subject, setSubject] = useState('Mathematics');
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [useAllChapters, setUseAllChapters] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [useAllTopics, setUseAllTopics] = useState(true);
  const [difficulty, setDifficulty] = useState<[number, number, number]>([30, 50, 20]); // Easy, Medium, Hard
  const [totalMarks, setTotalMarks] = useState(100);
  const [duration, setDuration] = useState(180); // 3 hours
  const [isGenerating, setIsGenerating] = useState(false);
  
  const chapters = CHAPTERS_BY_SUBJECT[subject] || [];
  
  const availableTopics = selectedChapters.flatMap(chapter => 
    TOPICS_BY_CHAPTER[chapter] || []
  );
  
  const handleChapterToggle = (chapter: string) => {
    if (selectedChapters.includes(chapter)) {
      setSelectedChapters(selectedChapters.filter(c => c !== chapter));
    } else {
      setSelectedChapters([...selectedChapters, chapter]);
    }
  };
  
  const handleTopicToggle = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };
  
  const handleSetAllChapters = (value: boolean) => {
    setUseAllChapters(value);
    if (value) {
      setSelectedChapters([]);
    }
  };
  
  const handleSetAllTopics = (value: boolean) => {
    setUseAllTopics(value);
    if (value) {
      setSelectedTopics([]);
    }
  };
  
  const handleDifficultyChange = (value: number[]) => {
    const newEasy = value[0];
    const newMedium = Math.round((100 - newEasy) * (difficulty[1] / (difficulty[1] + difficulty[2])));
    const newHard = 100 - newEasy - newMedium;
    
    setDifficulty([newEasy, newMedium, newHard]);
  };
  
  const handleGenerate = async () => {
    setIsGenerating(true);
    
    const params: GenerateParams = {
      board,
      class: classLevel,
      subject,
      chapters: useAllChapters ? [] : selectedChapters,
      topics: useAllTopics ? [] : selectedTopics,
      difficultyDistribution: {
        easy: difficulty[0],
        medium: difficulty[1],
        hard: difficulty[2]
      },
      totalMarks,
      duration
    };
    
    try {
      const generatedPaper = await generateQuestionPaper(params);
      
      const paperId = createQuestionPaper({
        title: generatedPaper.title,
        board: generatedPaper.board,
        class: generatedPaper.class,
        subject: generatedPaper.subject,
        createdBy: 'user1',
        totalMarks: generatedPaper.totalMarks,
        duration: generatedPaper.duration,
        sections: generatedPaper.sections,
        instructions: generatedPaper.instructions,
        schoolHeader: 'Springfield High School'
      });
      
      toast({
        title: "Question Paper Generated",
        description: "Your paper has been created successfully!",
        variant: "default",
      });
      
      navigate(`/edit-paper/${paperId}`);
    } catch (error) {
      console.error('Error generating paper:', error);
      toast({
        title: "Error Generating Paper",
        description: "There was an issue creating your question paper. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Generate Question Paper with AI</h1>
          <p className="text-gray-600">Set your preferences and let AI create a personalized question paper</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">1. Basic Parameters</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Board</label>
                    <Select
                      value={board}
                      onValueChange={(value: Board) => setBoard(value)}
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
                    <label className="text-sm font-medium">Class</label>
                    <Select
                      value={classLevel}
                      onValueChange={setClassLevel}
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
                    <label className="text-sm font-medium">Subject</label>
                    <Select
                      value={subject}
                      onValueChange={(value) => {
                        setSubject(value);
                        setSelectedChapters([]);
                        setSelectedTopics([]);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Total Marks</label>
                    <Input
                      type="number"
                      min={10}
                      max={200}
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(parseInt(e.target.value) || 100)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duration (minutes)</label>
                    <Input
                      type="number"
                      min={30}
                      max={240}
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 180)}
                    />
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold mb-4 pt-4">2. Content Selection</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Chapters</label>
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="allChapters" 
                        checked={useAllChapters} 
                        onCheckedChange={handleSetAllChapters}
                      />
                      <label htmlFor="allChapters" className="text-sm">
                        Include all chapters
                      </label>
                    </div>
                  </div>
                  
                  {!useAllChapters && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {chapters.map(chapter => (
                        <div key={chapter} className="flex items-center gap-2">
                          <Checkbox 
                            id={`chapter-${chapter}`}
                            checked={selectedChapters.includes(chapter)}
                            onCheckedChange={() => handleChapterToggle(chapter)}
                          />
                          <label htmlFor={`chapter-${chapter}`} className="text-sm">
                            {chapter}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {!useAllChapters && selectedChapters.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Topics</label>
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="allTopics" 
                          checked={useAllTopics} 
                          onCheckedChange={handleSetAllTopics}
                        />
                        <label htmlFor="allTopics" className="text-sm">
                          Include all topics
                        </label>
                      </div>
                    </div>
                    
                    {!useAllTopics && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {availableTopics.map(topic => (
                          <div key={topic} className="flex items-center gap-2">
                            <Checkbox 
                              id={`topic-${topic}`}
                              checked={selectedTopics.includes(topic)}
                              onCheckedChange={() => handleTopicToggle(topic)}
                            />
                            <label htmlFor={`topic-${topic}`} className="text-sm">
                              {topic}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                <h2 className="text-xl font-semibold mb-4 pt-4">3. Difficulty Distribution</h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Easy</span>
                      <span className="text-sm font-medium">{difficulty[0]}%</span>
                    </div>
                    <Slider
                      defaultValue={[difficulty[0]]}
                      max={100}
                      step={5}
                      value={[difficulty[0]]}
                      onValueChange={handleDifficultyChange}
                      className="py-4"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-lg font-semibold text-green-700">{difficulty[0]}%</div>
                      <div className="text-sm text-green-800">Easy</div>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <div className="text-lg font-semibold text-yellow-700">{difficulty[1]}%</div>
                      <div className="text-sm text-yellow-800">Medium</div>
                    </div>
                    
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <div className="text-lg font-semibold text-red-700">{difficulty[2]}%</div>
                      <div className="text-sm text-red-800">Hard</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:row-span-1">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Board</span>
                  <span className="font-medium">{board}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Class</span>
                  <span className="font-medium">{classLevel}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Subject</span>
                  <span className="font-medium">{subject}</span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Chapters</span>
                  <span className="font-medium">
                    {useAllChapters ? 'All Chapters' : 
                      selectedChapters.length > 0 
                        ? `${selectedChapters.length} selected` 
                        : 'None selected'}
                  </span>
                </div>
                
                {!useAllChapters && selectedChapters.length > 0 && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Topics</span>
                    <span className="font-medium">
                      {useAllTopics ? 'All Topics' : 
                        selectedTopics.length > 0 
                          ? `${selectedTopics.length} selected` 
                          : 'None selected'}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Difficulty</span>
                  <span className="font-medium">
                    {difficulty[0]}% / {difficulty[1]}% / {difficulty[2]}%
                  </span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Total Marks</span>
                  <span className="font-medium">{totalMarks}</span>
                </div>
                
                <div className="flex justify-between pb-2">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{duration} minutes</span>
                </div>
                
                <Button 
                  className="w-full mt-8 bg-educate-400 hover:bg-educate-500"
                  disabled={isGenerating || 
                    (!useAllChapters && selectedChapters.length === 0) ||
                    (!useAllChapters && !useAllTopics && selectedTopics.length === 0)}
                  onClick={handleGenerate}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Paper
                    </>
                  )}
                </Button>
                
                <div className="text-center text-xs text-gray-500 mt-2">
                  You'll be able to edit the generated paper
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg mt-6">
          <h2 className="text-xl font-semibold mb-4">How AI Generation Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="rounded-full bg-blue-100 w-10 h-10 flex items-center justify-center mb-4">
                <span className="text-blue-700 font-semibold">1</span>
              </div>
              <h3 className="font-medium mb-2">Set Parameters</h3>
              <p className="text-sm text-gray-600">
                Choose board, class, subject, and other criteria to match your paper requirements.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="rounded-full bg-blue-100 w-10 h-10 flex items-center justify-center mb-4">
                <span className="text-blue-700 font-semibold">2</span>
              </div>
              <h3 className="font-medium mb-2">Generate Paper</h3>
              <p className="text-sm text-gray-600">
                Our AI selects questions from the question bank and creates new ones if needed to match your criteria.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="rounded-full bg-blue-100 w-10 h-10 flex items-center justify-center mb-4">
                <span className="text-blue-700 font-semibold">3</span>
              </div>
              <h3 className="font-medium mb-2">Review & Edit</h3>
              <p className="text-sm text-gray-600">
                After generation, you can review and customize each section and question as needed.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button variant="outline" asChild>
              <a href="#" className="flex items-center">
                Learn more about AI generation
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GeneratePaperPage;
