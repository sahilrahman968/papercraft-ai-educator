
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useData } from '@/context/DataContext';
import { 
  Board, 
  Difficulty, 
  Question, 
  QuestionType, 
  BloomLevel 
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlusCircle, Search, Filter, Edit, Trash, Eye } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const BOARDS: Board[] = ['CBSE', 'ICSE', 'State'];
const QUESTION_TYPES: QuestionType[] = ['MCQ', 'Short Answer', 'Long Answer', 'Fill in the Blank', 'Match the Following', 'Assertion and Reason'];
const DIFFICULTY_LEVELS: Difficulty[] = ['Easy', 'Medium', 'Hard'];
const BLOOM_LEVELS: BloomLevel[] = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];
const CLASSES = ['8', '9', '10', '11', '12'];

// Sample subjects, chapters and topics
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

// Form schema for adding/editing questions
const questionFormSchema = z.object({
  text: z.string().min(5, { message: 'Question text is required' }),
  type: z.enum(['MCQ', 'Short Answer', 'Long Answer', 'Fill in the Blank', 'Match the Following', 'Assertion and Reason']),
  board: z.enum(['CBSE', 'ICSE', 'State']),
  class: z.string(),
  subject: z.string(),
  chapter: z.string(),
  topic: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  marks: z.number().min(1).max(10),
  bloomLevel: z.enum(['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create']),
  answer: z.string().optional(),
  options: z.array(z.string()).optional(),
  hasImage: z.boolean().default(false),
  imageUrl: z.string().optional(),
});

type QuestionFormValues = z.infer<typeof questionFormSchema>;

const QuestionBankPage: React.FC = () => {
  const { questions, addQuestion, updateQuestion, deleteQuestion } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    board: '',
    class: '',
    subject: '',
    chapter: '',
    difficulty: '',
    type: '',
  });
  const [viewQuestion, setViewQuestion] = useState<Question | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // Filter questions based on search and filters
  const filteredQuestions = questions.filter(question => {
    // Search term filter
    const matchesSearch = 
      question.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.chapter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.topic.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Attribute filters
    const matchesBoard = filters.board ? question.board === filters.board : true;
    const matchesClass = filters.class ? question.class === filters.class : true;
    const matchesSubject = filters.subject ? question.subject === filters.subject : true;
    const matchesChapter = filters.chapter ? question.chapter === filters.chapter : true;
    const matchesDifficulty = filters.difficulty ? question.difficulty === filters.difficulty : true;
    const matchesType = filters.type ? question.type === filters.type : true;
    
    return matchesSearch && matchesBoard && matchesClass && matchesSubject &&
           matchesChapter && matchesDifficulty && matchesType;
  });
  
  // Setup form for adding/editing questions
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      text: '',
      type: 'Short Answer',
      board: 'CBSE',
      class: '10',
      subject: 'Mathematics',
      chapter: 'Algebra',
      topic: 'Equations',
      difficulty: 'Medium',
      marks: 3,
      bloomLevel: 'Understand',
      answer: '',
      options: ['', '', '', ''],
      hasImage: false,
      imageUrl: '',
    },
  });
  
  const { watch, setValue } = form;
  const selectedSubject = watch('subject');
  const selectedChapter = watch('chapter');
  const selectedType = watch('type');
  
  // Update chapter options when subject changes
  React.useEffect(() => {
    if (selectedSubject) {
      const chapters = CHAPTERS_BY_SUBJECT[selectedSubject] || [];
      setValue('chapter', chapters[0] || '');
    }
  }, [selectedSubject, setValue]);
  
  // Update topic options when chapter changes
  React.useEffect(() => {
    if (selectedChapter) {
      const topics = TOPICS_BY_CHAPTER[selectedChapter] || [];
      setValue('topic', topics[0] || '');
    }
  }, [selectedChapter, setValue]);
  
  // Set form values when editing a question
  React.useEffect(() => {
    if (editingQuestion) {
      Object.entries(editingQuestion).forEach(([key, value]) => {
        // @ts-ignore - This is dynamic field setting
        if (key !== 'id') setValue(key, value);
      });
      
      setIsAddDialogOpen(true);
    }
  }, [editingQuestion, setValue]);
  
  // Handle form submission
  const onSubmit = (data: QuestionFormValues) => {
    if (editingQuestion) {
      updateQuestion(editingQuestion.id, data);
      setEditingQuestion(null);
    } else {
      // Here we need to make sure all required fields are present
      // The type system enforces this, but let's ensure each field is provided
      const newQuestion: Omit<Question, 'id'> = {
        text: data.text,
        type: data.type,
        board: data.board,
        class: data.class,
        subject: data.subject, 
        chapter: data.chapter,
        topic: data.topic,
        difficulty: data.difficulty,
        marks: data.marks,
        bloomLevel: data.bloomLevel,
        answer: data.answer || '',
        options: data.options,
        hasImage: data.hasImage || false,
        imageUrl: data.imageUrl
      };
      
      addQuestion(newQuestion);
    }
    
    setIsAddDialogOpen(false);
    form.reset();
  };
  
  const handleResetFilters = () => {
    setFilters({
      board: '',
      class: '',
      subject: '',
      chapter: '',
      difficulty: '',
      type: '',
    });
    setSearchTerm('');
  };
  
  const handleViewQuestion = (question: Question) => {
    setViewQuestion(question);
    setIsViewDialogOpen(true);
  };
  
  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
  };
  
  const handleDeleteQuestion = (questionId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteQuestion(questionId);
    }
  };
  
  const handleAddNewClick = () => {
    setEditingQuestion(null);
    form.reset();
    setIsAddDialogOpen(true);
  };
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Question Bank</h1>
            <p className="text-gray-600">Manage and explore your question repository</p>
          </div>
          
          <Button onClick={handleAddNewClick} className="bg-educate-400 hover:bg-educate-500">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Question
          </Button>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search questions..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter size={16} />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <div className="p-2">
                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-medium">Board</label>
                    <Select 
                      value={filters.board} 
                      onValueChange={(value) => setFilters({...filters, board: value})}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="All boards" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All boards</SelectItem>
                        {BOARDS.map(board => (
                          <SelectItem key={board} value={board}>{board}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Class</label>
                    <Select 
                      value={filters.class} 
                      onValueChange={(value) => setFilters({...filters, class: value})}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="All classes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All classes</SelectItem>
                        {CLASSES.map(cls => (
                          <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Subject</label>
                    <Select 
                      value={filters.subject} 
                      onValueChange={(value) => setFilters({...filters, subject: value})}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="All subjects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All subjects</SelectItem>
                        {SUBJECTS.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Difficulty</label>
                    <Select 
                      value={filters.difficulty} 
                      onValueChange={(value) => setFilters({...filters, difficulty: value})}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="All difficulties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All difficulties</SelectItem>
                        {DIFFICULTY_LEVELS.map(difficulty => (
                          <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Question Type</label>
                    <Select 
                      value={filters.type} 
                      onValueChange={(value) => setFilters({...filters, type: value})}
                    >
                      <SelectTrigger className="h-8 text-xs">
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
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleResetFilters}
                    className="w-full mt-2"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Applied Filters Display */}
        {(Object.values(filters).some(f => f !== '') || searchTerm) && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-sm text-gray-500">Filters:</span>
            
            {searchTerm && (
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs flex items-center gap-1">
                Search: {searchTerm}
                <button 
                  onClick={() => setSearchTerm('')}
                  className="ml-1 text-gray-500 hover:text-gray-800"
                >
                  ×
                </button>
              </span>
            )}
            
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              return (
                <span key={key} className="px-2 py-1 bg-gray-100 rounded-full text-xs flex items-center gap-1">
                  {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                  <button 
                    onClick={() => setFilters({...filters, [key]: ''})}
                    className="ml-1 text-gray-500 hover:text-gray-800"
                  >
                    ×
                  </button>
                </span>
              );
            })}
            
            <button 
              onClick={handleResetFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          </div>
        )}
        
        {/* Questions List */}
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map(question => (
                <Card key={question.id} className="overflow-hidden hover:shadow-md transition-all">
                  <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
                    <div>
                      <div className="flex gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">{question.type}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {question.difficulty}
                        </span>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs">{question.marks} marks</span>
                      </div>
                      <CardTitle className="text-base">{question.subject}</CardTitle>
                      <CardDescription className="text-xs">
                        {question.board} | Class {question.class} | {question.chapter}
                      </CardDescription>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleViewQuestion(question)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditQuestion(question)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-2">
                    <div className="text-sm line-clamp-3 min-h-[4.5rem]">
                      {question.text}
                    </div>
                    {question.hasImage && question.imageUrl && (
                      <div className="mt-2">
                        <img 
                          src={question.imageUrl} 
                          alt="Question visual" 
                          className="rounded h-28 w-full object-cover" 
                        />
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-2 border-t">
                    <div className="w-full flex justify-between items-center text-xs text-gray-500">
                      <span>Topic: {question.topic}</span>
                      <span>{question.bloomLevel}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full p-8 text-center border rounded-lg bg-gray-50">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No questions found</h3>
                <p className="mt-2 text-gray-600 max-w-md mx-auto">
                  {questions.length === 0 
                    ? "Your question bank is empty. Add some questions to get started!" 
                    : "No questions match the current search and filters. Try adjusting your criteria."}
                </p>
                <div className="mt-6">
                  {questions.length === 0 ? (
                    <Button onClick={handleAddNewClick} className="bg-educate-400 hover:bg-educate-500">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Your First Question
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={handleResetFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Add/Edit Question Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
              <DialogDescription>
                Fill in the details to {editingQuestion ? 'update' : 'add'} a question to your bank.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="basic">
                  <TabsList>
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="details">Classification</TabsTrigger>
                    <TabsTrigger value="content">Question Content</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4 pt-4">
                    {/* Question Type */}
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {QUESTION_TYPES.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Board */}
                    <FormField
                      control={form.control}
                      name="board"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Board</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select board" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {BOARDS.map(board => (
                                <SelectItem key={board} value={board}>{board}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Class */}
                    <FormField
                      control={form.control}
                      name="class"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CLASSES.map(cls => (
                                <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Subject */}
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {SUBJECTS.map(subject => (
                                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="details" className="space-y-4 pt-4">
                    {/* Chapter */}
                    <FormField
                      control={form.control}
                      name="chapter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chapter</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select chapter" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {(CHAPTERS_BY_SUBJECT[selectedSubject] || []).map(chapter => (
                                <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Topic */}
                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topic</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select topic" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {(TOPICS_BY_CHAPTER[selectedChapter] || []).map(topic => (
                                <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Difficulty */}
                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DIFFICULTY_LEVELS.map(difficulty => (
                                <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Bloom's Taxonomy Level */}
                    <FormField
                      control={form.control}
                      name="bloomLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bloom's Taxonomy Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {BLOOM_LEVELS.map(level => (
                                <SelectItem key={level} value={level}>{level}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Cognitive level targeted by this question
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Marks */}
                    <FormField
                      control={form.control}
                      name="marks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marks</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={10}
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value, 10) || 1)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  <TabsContent value="content" className="space-y-4 pt-4">
                    {/* Question Text */}
                    <FormField
                      control={form.control}
                      name="text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question Text</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter the question text here..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* MCQ Options */}
                    {selectedType === 'MCQ' && (
                      <div className="space-y-3">
                        <FormLabel>Answer Options</FormLabel>
                        <FormDescription>
                          Enter 4 options for your multiple-choice question. The first option will be considered the correct answer.
                        </FormDescription>
                        
                        {[0, 1, 2, 3].map(index => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full font-medium">
                              {String.fromCharCode(65 + index)}
                            </div>
                            <Input
                              placeholder={`Option ${String.fromCharCode(65 + index)}`}
                              value={form.watch(`options.${index}`) || ''}
                              onChange={(e) => {
                                const currentOptions = form.watch('options') || ['', '', '', ''];
                                const newOptions = [...currentOptions];
                                newOptions[index] = e.target.value;
                                form.setValue('options', newOptions);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Answer/Solution */}
                    <FormField
                      control={form.control}
                      name="answer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Answer/Solution</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter the answer or solution here..."
                              className="min-h-[100px]"
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormDescription>
                            {selectedType === 'MCQ' 
                              ? 'Specify the correct option (A, B, C, or D) and explanation if needed.' 
                              : 'Provide expected answer or solution guidelines.'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Image Toggle */}
                    <FormField
                      control={form.control}
                      name="hasImage"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Include Image</FormLabel>
                            <FormDescription>
                              Does this question include a diagram, chart, or image?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4 text-educate-400 focus:ring-educate-500 rounded"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {/* Image URL (if hasImage is true) */}
                    {form.watch('hasImage') && (
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/image.jpg"
                                {...field}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter a URL for the image. For a demo, you can use placeholder URLs like https://placehold.co/600x400.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </TabsContent>
                </Tabs>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-educate-400 hover:bg-educate-500">
                    {editingQuestion ? 'Update' : 'Add'} Question
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* View Question Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {viewQuestion && (
              <>
                <DialogHeader>
                  <DialogTitle>Question Details</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Question metadata */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-500">Board</div>
                      <div>{viewQuestion.board}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Class</div>
                      <div>{viewQuestion.class}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Subject</div>
                      <div>{viewQuestion.subject}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Chapter</div>
                      <div>{viewQuestion.chapter}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Topic</div>
                      <div>{viewQuestion.topic}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Type</div>
                      <div>{viewQuestion.type}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Difficulty</div>
                      <div>{viewQuestion.difficulty}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Bloom's Level</div>
                      <div>{viewQuestion.bloomLevel}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Marks</div>
                      <div>{viewQuestion.marks}</div>
                    </div>
                  </div>
                  
                  {/* Question */}
                  <div className="rounded-lg border p-4">
                    <div className="font-medium mb-2">Question</div>
                    <div className="text-gray-800 whitespace-pre-line">{viewQuestion.text}</div>
                    
                    {viewQuestion.hasImage && viewQuestion.imageUrl && (
                      <div className="mt-4">
                        <img 
                          src={viewQuestion.imageUrl} 
                          alt="Question visual" 
                          className="mx-auto max-h-64 rounded" 
                        />
                      </div>
                    )}
                    
                    {/* MCQ Options */}
                    {viewQuestion.type === 'MCQ' && viewQuestion.options && (
                      <div className="mt-4 space-y-2">
                        <div className="font-medium">Options</div>
                        {viewQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="min-w-[24px] h-6 flex items-center justify-center rounded-full bg-gray-100 text-sm font-medium">
                              {String.fromCharCode(65 + index)}
                            </div>
                            <div>{option}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Answer */}
                  <div className="rounded-lg border p-4 bg-gray-50">
                    <div className="font-medium mb-2">Answer/Solution</div>
                    <div className="text-gray-800 whitespace-pre-line">{viewQuestion.answer || 'No answer provided'}</div>
                  </div>
                </div>
                
                <DialogFooter className="gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleEditQuestion(viewQuestion);
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    onClick={() => setIsViewDialogOpen(false)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default QuestionBankPage;
