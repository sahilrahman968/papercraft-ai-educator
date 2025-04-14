
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useData } from '@/context/DataContext';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Question, 
  QuestionType, 
  Section,
  QuestionPaper
} from '@/types';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  PlusCircle, 
  Trash2, 
  Save, 
  Edit, 
  Filter, 
  MoveUp, 
  MoveDown,
  RefreshCcw,
  Wand2,
  Download,
  ArrowLeft,
  FileDown,
  Loader2
} from 'lucide-react'; 
import { toast } from '@/hooks/use-toast';
import { generateSingleQuestion } from '@/lib/aiService';
import { generatePDF } from '@/lib/pdfGenerator';

// Get same constants from CreatePaperPage
const QUESTION_TYPES: QuestionType[] = ['MCQ', 'Short Answer', 'Long Answer', 'Fill in the Blank', 'Match the Following', 'Assertion and Reason'];

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

const EditPaperPage = () => {
  const { paperId } = useParams<{ paperId: string }>();
  const { questionPapers, questions, updateQuestionPaper } = useData();
  const navigate = useNavigate();
  
  // Local state for the paper
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(180);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  
  // Question Bank Filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    chapter: '',
    difficulty: '',
    marks: '',
  });
  
  // AI Question Generation
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [generationParams, setGenerationParams] = useState({
    chapter: '',
    topic: '',
    difficulty: 'Medium',
    type: 'Short Answer',
    marks: 3
  });
  
  // State for export dialog
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportPassword, setExportPassword] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  
  // Load the paper data
  useEffect(() => {
    if (!paperId) return;
    
    const foundPaper = questionPapers.find(p => p.id === paperId);
    if (foundPaper) {
      setPaper(foundPaper);
      setTitle(foundPaper.title);
      setDuration(foundPaper.duration);
      setInstructions(foundPaper.instructions || []);
      setSections(JSON.parse(JSON.stringify(foundPaper.sections))); // Deep copy
    } else {
      toast({
        title: "Error",
        description: "Question paper not found.",
        variant: "destructive",
      });
      navigate('/question-papers');
    }
  }, [paperId, questionPapers, navigate]);
  
  // Get filtered questions from the question bank
  const filteredQuestions = paper ? questions.filter(question => {
    // First filter by board, class and subject
    if (question.board !== paper.board || question.class !== paper.class || question.subject !== paper.subject) {
      return false;
    }
    
    // Then apply search term
    const matchesSearch = searchTerm 
      ? question.text.toLowerCase().includes(searchTerm.toLowerCase()) 
      : true;
    
    // Then apply other filters
    const matchesType = filters.type ? question.type === filters.type : true;
    const matchesChapter = filters.chapter ? question.chapter === filters.chapter : true;
    const matchesDifficulty = filters.difficulty ? question.difficulty === filters.difficulty : true;
    const matchesMarks = filters.marks 
      ? question.marks === parseInt(filters.marks, 10) 
      : true;
    
    return matchesSearch && matchesType && matchesChapter && matchesDifficulty && matchesMarks;
  }) : [];
  
  // Get available chapters for the selected subject
  const availableChapters = paper ? CHAPTERS_BY_SUBJECT[paper.subject] || [] : [];
  
  // Get available topics for the selected chapter
  const availableTopics = TOPICS_BY_CHAPTER[generationParams.chapter] || [];
  
  // Add a new empty section
  const addNewSection = () => {
    if (!paper) return;
    
    const newSection: Section = {
      id: `s-${Date.now()}`,
      title: `Section ${String.fromCharCode(65 + sections.length)}: New Section`,
      description: 'Answer all questions.',
      questions: []
    };
    
    setSections([...sections, newSection]);
  };
  
  // Remove a section
  const removeSection = (sectionId: string) => {
    if (sections.length === 1) {
      toast({
        title: "Error",
        description: "At least one section is required.",
        variant: "destructive",
      });
      return;
    }
    
    setSections(sections.filter(section => section.id !== sectionId));
  };
  
  // Update section details
  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, ...updates } : section
    ));
  };
  
  // Add a question to a section
  const addQuestionToSection = (sectionId: string, question: Question) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          questions: [...section.questions, { ...question, id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }]
        };
      }
      return section;
    }));
  };
  
  // Remove a question from a section
  const removeQuestionFromSection = (sectionId: string, questionId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          questions: section.questions.filter(q => q.id !== questionId)
        };
      }
      return section;
    }));
  };
  
  // Move a question up in the section
  const moveQuestionUp = (sectionId: string, questionIndex: number) => {
    if (questionIndex === 0) return;
    
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const newQuestions = [...section.questions];
        [newQuestions[questionIndex], newQuestions[questionIndex - 1]] = 
          [newQuestions[questionIndex - 1], newQuestions[questionIndex]];
        
        return {
          ...section,
          questions: newQuestions
        };
      }
      return section;
    }));
  };
  
  // Move a question down in the section
  const moveQuestionDown = (sectionId: string, questionIndex: number) => {
    setSections(sections.map(section => {
      if (section.id === sectionId && questionIndex < section.questions.length - 1) {
        const newQuestions = [...section.questions];
        [newQuestions[questionIndex], newQuestions[questionIndex + 1]] = 
          [newQuestions[questionIndex + 1], newQuestions[questionIndex]];
        
        return {
          ...section,
          questions: newQuestions
        };
      }
      return section;
    }));
  };
  
  // Regenerate a question with AI
  const handleRegenerateQuestion = async (sectionId: string, questionId: string) => {
    if (!paper) return;
    
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    
    const question = section.questions.find(q => q.id === questionId);
    if (!question) return;
    
    setIsGeneratingQuestion(true);
    
    try {
      const regeneratedQuestion = await generateSingleQuestion(
        paper.subject,
        question.chapter,
        question.topic,
        question.difficulty,
        question.type,
        question.marks
      );
      
      // Replace the question
      setSections(sections.map(s => {
        if (s.id === sectionId) {
          return {
            ...s,
            questions: s.questions.map(q => q.id === questionId ? regeneratedQuestion : q)
          };
        }
        return s;
      }));
      
      toast({
        title: "Question Regenerated",
        description: "The AI has created a new version of the question.",
      });
    } catch (error) {
      console.error('Error regenerating question:', error);
      toast({
        title: "Error",
        description: "Failed to regenerate the question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQuestion(false);
    }
  };
  
  // Generate a new question with AI
  const handleGenerateQuestion = async (sectionId: string) => {
    if (!paper) return;
    
    setIsGeneratingQuestion(true);
    
    try {
      const newQuestion = await generateSingleQuestion(
        paper.subject,
        generationParams.chapter,
        generationParams.topic,
        generationParams.difficulty as any,
        generationParams.type as any,
        parseInt(generationParams.marks.toString(), 10)
      );
      
      addQuestionToSection(sectionId, newQuestion);
      
      toast({
        title: "Question Generated",
        description: "The AI has created a new question based on your criteria.",
      });
    } catch (error) {
      console.error('Error generating question:', error);
      toast({
        title: "Error",
        description: "Failed to generate a question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQuestion(false);
    }
  };
  
  // Calculate total marks of the paper
  const calculatedTotalMarks = sections.reduce(
    (sum, section) => sum + section.questions.reduce((qSum, q) => qSum + q.marks, 0), 
    0
  );
  
  // Save the question paper
  const handleSavePaper = () => {
    if (!paper || !paperId) return;
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please provide a title for the question paper.",
        variant: "destructive",
      });
      return;
    }
    
    if (sections.some(section => section.questions.length === 0)) {
      toast({
        title: "Error",
        description: "All sections must have at least one question.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      updateQuestionPaper(paperId, {
        title,
        duration,
        sections,
        totalMarks: calculatedTotalMarks,
        instructions
      });
      
      toast({
        title: "Success",
        description: "Question paper updated successfully!",
      });
      
      // Update local paper state
      setPaper({
        ...paper,
        title,
        duration,
        sections,
        totalMarks: calculatedTotalMarks,
        instructions
      });
    } catch (error) {
      console.error('Error saving paper:', error);
      toast({
        title: "Error",
        description: "Failed to update the question paper. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle export to PDF
  const handleExportPDF = async () => {
    if (!paper) return;
    
    setIsExporting(true);
    
    try {
      await generatePDF(paper, exportPassword);
      setIsExportDialogOpen(false);
      setExportPassword('');
      
      toast({
        title: "Success",
        description: "Question paper exported successfully!",
      });
    } catch (error) {
      console.error('Error exporting paper:', error);
      toast({
        title: "Error",
        description: "Failed to export the question paper. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  if (!paper) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-pulse text-center">
            <div className="text-2xl font-semibold">Loading question paper...</div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <button 
              onClick={() => navigate('/question-papers')}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-2"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Question Papers
            </button>
            <h1 className="text-2xl font-bold">Edit Question Paper</h1>
            <p className="text-gray-600">Modify your existing question paper</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSavePaper} className="bg-educate-400 hover:bg-educate-500">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsExportDialogOpen(true)}
              className="gap-2"
            >
              <FileDown className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
        
        {/* Paper Metadata */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle>Paper Details</CardTitle>
            <CardDescription>
              Edit the basic information for this question paper
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="title">Paper Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Class 10 Mathematics Half-Yearly Examination"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="school">School</Label>
                <Input
                  id="school"
                  value={paper.schoolHeader || "Springfield High School"}
                  disabled
                />
                <p className="text-xs text-gray-500">Set by your school administrator</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="board">Board</Label>
                <Input id="board" value={paper.board} disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Input id="class" value={`Class ${paper.class}`} disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" value={paper.subject} disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={30}
                  max={240}
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 180)}
                />
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                value={instructions.join('\n')}
                onChange={(e) => setInstructions(e.target.value.split('\n').filter(line => line.trim()))}
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
            </div>
            
            <div className="text-sm text-gray-600">
              Total Questions: <span className="font-medium">
                {sections.reduce((sum, section) => sum + section.questions.length, 0)}
              </span>
            </div>
          </CardFooter>
        </Card>
        
        {/* Section Management */}
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <Card key={section.id} className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <input
                      className="text-xl font-semibold bg-transparent border-0 border-b border-transparent hover:border-gray-300 focus:border-gray-500 focus:outline-none p-0"
                      value={section.title}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                    />
                    <textarea
                      className="w-full mt-1 text-sm text-gray-600 bg-transparent border-0 border-b border-transparent hover:border-gray-300 focus:border-gray-500 focus:outline-none p-0 resize-none overflow-hidden"
                      value={section.description || ''}
                      onChange={(e) => updateSection(section.id, { description: e.target.value })}
                      placeholder="Section description or instructions..."
                      rows={1}
                      style={{ height: 'auto' }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = '';
                        target.style.height = `${target.scrollHeight}px`;
                      }}
                    />
                  </div>
                  
                  {sections.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeSection(section.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Questions */}
                <div className="space-y-4">
                  {section.questions.length > 0 ? (
                    section.questions.map((question, questionIndex) => (
                      <div key={question.id} className="rounded-lg border overflow-hidden">
                        <div className="bg-gray-50 p-3 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Q{sectionIndex + 1}.{questionIndex + 1}</span>
                            <div className="flex gap-1">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {question.difficulty}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                                {question.type}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800">
                                {question.marks} marks
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => moveQuestionUp(section.id, questionIndex)}
                              disabled={questionIndex === 0}
                            >
                              <MoveUp size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => moveQuestionDown(section.id, questionIndex)}
                              disabled={questionIndex === section.questions.length - 1}
                            >
                              <MoveDown size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => handleRegenerateQuestion(section.id, question.id)}
                              disabled={isGeneratingQuestion}
                            >
                              <RefreshCcw size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeQuestionFromSection(section.id, question.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="text-gray-800">{question.text}</div>
                          
                          {/* MCQ Options */}
                          {question.type === 'MCQ' && question.options && (
                            <div className="mt-3 space-y-1.5">
                              {question.options.map((option, oIndex) => (
                                <div key={oIndex} className="flex items-start gap-2">
                                  <div className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-gray-100 text-xs font-medium">
                                    {String.fromCharCode(65 + oIndex)}
                                  </div>
                                  <div className="text-sm">{option}</div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Question Image */}
                          {question.hasImage && question.imageUrl && (
                            <div className="mt-3">
                              <img 
                                src={question.imageUrl} 
                                alt="Question visual" 
                                className="max-h-48 rounded border" 
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 border border-dashed rounded-lg">
                      <p className="text-gray-500">
                        No questions in this section yet. Add questions from the question bank or generate with AI.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-4 border-t p-4 bg-gray-50">
                {/* Add Question Buttons */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <PlusCircle size={16} />
                      Add from Question Bank
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add Question from Question Bank</DialogTitle>
                      <DialogDescription>
                        Browse and select questions to add to this section
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                      <div className="col-span-2 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          placeholder="Search questions..."
                          className="pl-10"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="filterType">Question Type</Label>
                        <Select
                          value={filters.type}
                          onValueChange={(value) => setFilters({...filters, type: value})}
                        >
                          <SelectTrigger id="filterType">
                            <SelectValue placeholder="All types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All types</SelectItem>
                            {QUESTION_TYPES.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="filterChapter">Chapter</Label>
                        <Select
                          value={filters.chapter}
                          onValueChange={(value) => setFilters({...filters, chapter: value})}
                        >
                          <SelectTrigger id="filterChapter">
                            <SelectValue placeholder="All chapters" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All chapters</SelectItem>
                            {availableChapters.map(chapter => (
                              <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="filterDifficulty">Difficulty</Label>
                        <Select
                          value={filters.difficulty}
                          onValueChange={(value) => setFilters({...filters, difficulty: value})}
                        >
                          <SelectTrigger id="filterDifficulty">
                            <SelectValue placeholder="All difficulties" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All difficulties</SelectItem>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="filterMarks">Marks</Label>
                        <Select
                          value={filters.marks}
                          onValueChange={(value) => setFilters({...filters, marks: value})}
                        >
                          <SelectTrigger id="filterMarks">
                            <SelectValue placeholder="All marks" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All marks</SelectItem>
                            <SelectItem value="1">1 mark</SelectItem>
                            <SelectItem value="2">2 marks</SelectItem>
                            <SelectItem value="3">3 marks</SelectItem>
                            <SelectItem value="5">5 marks</SelectItem>
                            <SelectItem value="10">10 marks</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="h-[300px] overflow-y-auto border rounded-md">
                      {filteredQuestions.length > 0 ? (
                        <div className="space-y-2 p-2">
                          {filteredQuestions.map(question => (
                            <div 
                              key={question.id} 
                              className="border rounded p-3 hover:bg-gray-50 cursor-pointer flex justify-between"
                              onClick={() => addQuestionToSection(section.id, question)}
                            >
                              <div>
                                <div className="flex gap-2 mb-1">
                                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                                    question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                    question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {question.difficulty}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                                    {question.type}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800">
                                    {question.marks} mark{question.marks !== 1 ? 's' : ''}
                                  </span>
                                </div>
                                <div className="line-clamp-2 text-sm">{question.text}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {question.chapter} | {question.topic}
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="ml-2 flex-shrink-0 h-8 text-blue-600" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addQuestionToSection(section.id, question);
                                }}
                              >
                                <PlusCircle size={16} className="mr-1" />
                                Add
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <div className="text-center p-4">
                            <Filter className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">No matching questions found</p>
                            <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2 bg-educate-400 hover:bg-educate-500">
                      <Wand2 size={16} />
                      Generate with AI
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Generate Question with AI</DialogTitle>
                      <DialogDescription>
                        Set parameters for the question you want to generate
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="aiChapter">Chapter</Label>
                        <Select
                          value={generationParams.chapter}
                          onValueChange={(value) => setGenerationParams({...generationParams, chapter: value})}
                        >
                          <SelectTrigger id="aiChapter">
                            <SelectValue placeholder="Select chapter" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableChapters.map(chapter => (
                              <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="aiTopic">Topic</Label>
                        <Select
                          value={generationParams.topic}
                          onValueChange={(value) => setGenerationParams({...generationParams, topic: value})}
                          disabled={!generationParams.chapter}
                        >
                          <SelectTrigger id="aiTopic">
                            <SelectValue placeholder={generationParams.chapter ? "Select topic" : "Select chapter first"} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTopics.map(topic => (
                              <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="aiDifficulty">Difficulty</Label>
                          <Select
                            value={generationParams.difficulty}
                            onValueChange={(value) => setGenerationParams({...generationParams, difficulty: value})}
                          >
                            <SelectTrigger id="aiDifficulty">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Easy">Easy</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="aiType">Question Type</Label>
                          <Select
                            value={generationParams.type}
                            onValueChange={(value) => setGenerationParams({...generationParams, type: value})}
                          >
                            <SelectTrigger id="aiType">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {QUESTION_TYPES.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="aiMarks">Marks</Label>
                        <Select
                          value={generationParams.marks.toString()}
                          onValueChange={(value) => setGenerationParams({...generationParams, marks: parseInt(value)})}
                        >
                          <SelectTrigger id="aiMarks">
                            <SelectValue placeholder="Select marks" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 mark</SelectItem>
                            <SelectItem value="2">2 marks</SelectItem>
                            <SelectItem value="3">3 marks</SelectItem>
                            <SelectItem value="5">5 marks</SelectItem>
                            <SelectItem value="10">10 marks</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        className="bg-educate-400 hover:bg-educate-500"
                        onClick={() => handleGenerateQuestion(section.id)}
                        disabled={isGeneratingQuestion || !generationParams.chapter || !generationParams.topic}
                      >
                        {isGeneratingQuestion ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Generate Question
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
          
          {/* Add Section Button */}
          <Button variant="outline" className="w-full py-6" onClick={addNewSection}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Section
          </Button>
          
          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSavePaper} className="bg-educate-400 hover:bg-educate-500">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
      
      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Question Paper</DialogTitle>
            <DialogDescription>
              Set a password to protect the exported PDF
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="password" className="mb-2 block">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter PDF password"
              value={exportPassword}
              onChange={(e) => setExportPassword(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-2">
              This password will be required to open the PDF file. Make sure to remember it.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsExportDialogOpen(false);
                setExportPassword('');
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleExportPDF}
              disabled={isExporting || !exportPassword.trim()}
              className="gap-2 bg-educate-400 hover:bg-educate-500"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Export PDF
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default EditPaperPage;
