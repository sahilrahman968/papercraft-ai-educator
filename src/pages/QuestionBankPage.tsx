
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Search, FileText, Edit, Trash2, Plus, PlusCircle, Filter, X, CheckCircle } from 'lucide-react';

const BOARDS: Board[] = ['CBSE', 'ICSE', 'State'];
const CLASSES = ['8', '9', '10', '11', '12'];
const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];
const QUESTION_TYPES: QuestionType[] = ['MCQ', 'Short Answer', 'Long Answer', 'Fill in the Blank', 'Match the Following', 'Assertion and Reason'];
const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];
const BLOOM_LEVELS: BloomLevel[] = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];

const QuestionBankPage: React.FC = () => {
  const { questions, addQuestion, updateQuestion, deleteQuestion } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    board: 'all',
    class: 'all',
    subject: 'all',
    chapter: '',
    topic: '',
    difficulty: 'all',
    marks: '',
    bloomLevel: 'all'
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [form, setForm] = useState<Partial<Question>>({
    text: '',
    type: 'Short Answer',
    board: 'CBSE',
    class: '10',
    subject: 'Mathematics',
    chapter: '',
    topic: '',
    difficulty: 'Medium',
    marks: 1,
    bloomLevel: 'Understand',
    answer: '',
    options: [],
    hasImage: false,
    imageUrl: ''
  });

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = searchTerm ? question.text.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchesType = filters.type !== 'all' ? question.type === filters.type : true;
    const matchesBoard = filters.board !== 'all' ? question.board === filters.board : true;
    const matchesClass = filters.class !== 'all' ? question.class === filters.class : true;
    const matchesSubject = filters.subject !== 'all' ? question.subject === filters.subject : true;
    const matchesChapter = filters.chapter ? question.chapter === filters.chapter : true;
    const matchesTopic = filters.topic ? question.topic === filters.topic : true;
    const matchesDifficulty = filters.difficulty !== 'all' ? question.difficulty === filters.difficulty : true;
    const matchesMarks = filters.marks ? question.marks === parseInt(filters.marks, 10) : true;
    const matchesBloomLevel = filters.bloomLevel !== 'all' ? question.bloomLevel === filters.bloomLevel : true;

    return matchesSearch && matchesType && matchesBoard && matchesClass && matchesSubject && matchesChapter && matchesTopic && matchesDifficulty && matchesMarks && matchesBloomLevel;
  });

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setForm(question);
    setIsAddDialogOpen(true);
  };

  const handleDeleteQuestion = (id: string) => {
    deleteQuestion(id);
    toast({
      title: "Question Deleted",
      description: "The question has been removed from the question bank.",
    });
  };

  const handleAddQuestion = (data: Partial<Question>) => {
    if (editingQuestion) {
      updateQuestion(editingQuestion.id, data);
      setEditingQuestion(null);
    } else {
      // Here we need to make sure all required fields are present
      // The type system enforces this, but let's ensure each field is provided
      const newQuestion: Omit<Question, 'id'> = {
        text: data.text || '',
        type: data.type || 'Short Answer',
        board: data.board || 'CBSE',
        class: data.class || '10',
        subject: data.subject || 'Mathematics', 
        chapter: data.chapter || '',
        topic: data.topic || '',
        difficulty: data.difficulty || 'Medium',
        marks: data.marks || 1,
        bloomLevel: data.bloomLevel || 'Understand',
        answer: data.answer || '',
        options: data.options || [],
        hasImage: data.hasImage || false,
        imageUrl: data.imageUrl || ''
      };
      
      addQuestion(newQuestion);
    }
    
    setIsAddDialogOpen(false);
    setForm({
      text: '',
      type: 'Short Answer',
      board: 'CBSE',
      class: '10',
      subject: 'Mathematics',
      chapter: '',
      topic: '',
      difficulty: 'Medium',
      marks: 1,
      bloomLevel: 'Understand',
      answer: '',
      options: [],
      hasImage: false,
      imageUrl: ''
    });
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Question Bank</h1>
            <p className="text-gray-600">Manage questions for your question papers</p>
          </div>
          <Button onClick={() => {
            setEditingQuestion(null);
            setIsAddDialogOpen(true);
          }} className="bg-educate-400 hover:bg-educate-500">
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Questions</TabsTrigger>
            <TabsTrigger value="mcq">MCQ</TabsTrigger>
            <TabsTrigger value="short">Short Answer</TabsTrigger>
            <TabsTrigger value="long">Long Answer</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative w-1/3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search questions..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Select onValueChange={(value) => setFilters({...filters, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {QUESTION_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => setFilters({...filters, board: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter Board" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Boards</SelectItem>
                    {BOARDS.map(board => (
                      <SelectItem key={board} value={board}>{board}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => setFilters({...filters, class: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {CLASSES.map(cls => (
                      <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => setFilters({...filters, subject: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {SUBJECTS.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      More Filters
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Additional Filters</DialogTitle>
                      <DialogDescription>
                        Filter questions based on chapter, topic, difficulty, marks, and bloom's level.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="chapter">Chapter</Label>
                          <Input
                            id="chapter"
                            placeholder="Enter chapter..."
                            value={filters.chapter}
                            onChange={(e) => setFilters({...filters, chapter: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="topic">Topic</Label>
                          <Input
                            id="topic"
                            placeholder="Enter topic..."
                            value={filters.topic}
                            onChange={(e) => setFilters({...filters, topic: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="difficulty">Difficulty</Label>
                          <Select onValueChange={(value) => setFilters({...filters, difficulty: value})}>
                            <SelectTrigger id="difficulty">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Difficulties</SelectItem>
                              {DIFFICULTIES.map(difficulty => (
                                <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="marks">Marks</Label>
                          <Input
                            id="marks"
                            type="number"
                            placeholder="Enter marks..."
                            value={filters.marks}
                            onChange={(e) => setFilters({...filters, marks: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="bloomLevel">Bloom's Level</Label>
                        <Select onValueChange={(value) => setFilters({...filters, bloomLevel: value})}>
                          <SelectTrigger id="bloomLevel">
                            <SelectValue placeholder="Select Bloom's Level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Levels</SelectItem>
                            {BLOOM_LEVELS.map(level => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" onClick={() => setIsAddDialogOpen(false)} variant="secondary">
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <CheckCircle className="mx-auto h-4 w-4" />
                  </TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Board</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-medium">
                      <CheckCircle className="mx-auto h-4 w-4 text-green-500" />
                    </TableCell>
                    <TableCell>{question.text}</TableCell>
                    <TableCell>{question.type}</TableCell>
                    <TableCell>{question.board}</TableCell>
                    <TableCell>{question.class}</TableCell>
                    <TableCell>{question.subject}</TableCell>
                    <TableCell>{question.difficulty}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditQuestion(question)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteQuestion(question.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="mcq">
            <p>This is the MCQ tab content.</p>
          </TabsContent>
          <TabsContent value="short">
            <p>This is the Short Answer tab content.</p>
          </TabsContent>
          <TabsContent value="long">
            <p>This is the Long Answer tab content.</p>
          </TabsContent>
        </Tabs>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
              <DialogDescription>
                Fill in the details for this question.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={e => {
              e.preventDefault();
              handleAddQuestion(form);
            }}>
              <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Question Text</Label>
                  <Textarea 
                    id="question" 
                    placeholder="Enter question text..."
                    className="min-h-[100px]"
                    value={form.text || ''}
                    onChange={e => setForm({...form, text: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Question Type</Label>
                    <Select 
                      value={form.type || 'Short Answer'} 
                      onValueChange={value => setForm({...form, type: value as QuestionType})}
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
                    <Label htmlFor="board">Board</Label>
                    <Select 
                      value={form.board || 'CBSE'} 
                      onValueChange={value => setForm({...form, board: value as Board})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select board" />
                      </SelectTrigger>
                      <SelectContent>
                        {BOARDS.map(board => (
                          <SelectItem key={board} value={board}>{board}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Select 
                      value={form.class || '10'} 
                      onValueChange={value => setForm({...form, class: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLASSES.map(cls => (
                          <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select 
                      value={form.subject || 'Mathematics'} 
                      onValueChange={value => setForm({...form, subject: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select 
                      value={form.difficulty || 'Medium'} 
                      onValueChange={value => setForm({...form, difficulty: value as Difficulty})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIFFICULTIES.map(diff => (
                          <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bloomLevel">Bloom's Level</Label>
                    <Select 
                      value={form.bloomLevel || 'Understand'} 
                      onValueChange={value => setForm({...form, bloomLevel: value as BloomLevel})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Bloom's level" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOM_LEVELS.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="chapter">Chapter</Label>
                  <Input 
                    id="chapter" 
                    placeholder="Enter chapter..."
                    value={form.chapter || ''}
                    onChange={e => setForm({...form, chapter: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input 
                    id="topic" 
                    placeholder="Enter topic..."
                    value={form.topic || ''}
                    onChange={e => setForm({...form, topic: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="marks">Marks</Label>
                  <Input 
                    id="marks" 
                    type="number"
                    placeholder="Enter marks..."
                    value={form.marks || 1}
                    onChange={e => setForm({...form, marks: parseInt(e.target.value) || 1})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="answer">Answer</Label>
                  <Textarea 
                    id="answer" 
                    placeholder="Enter answer..."
                    className="min-h-[80px]"
                    value={form.answer || ''}
                    onChange={e => setForm({...form, answer: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="options">Options (for MCQ, comma separated)</Label>
                  <Input 
                    id="options" 
                    placeholder="Enter options, separated by commas..."
                    value={(form.options || []).join(',')}
                    onChange={e => setForm({...form, options: e.target.value.split(',').map(o => o.trim())})}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Input 
                    id="hasImage" 
                    type="checkbox"
                    checked={form.hasImage || false}
                    onChange={e => setForm({...form, hasImage: e.target.checked})}
                  />
                  <Label htmlFor="hasImage">Has Image</Label>
                </div>
                
                {form.hasImage && (
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input 
                      id="imageUrl" 
                      placeholder="Enter image URL..."
                      value={form.imageUrl || ''}
                      onChange={e => setForm({...form, imageUrl: e.target.value})}
                    />
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button type="submit" className="bg-educate-400 hover:bg-educate-500">
                  {editingQuestion ? 'Update Question' : 'Add Question'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default QuestionBankPage;
