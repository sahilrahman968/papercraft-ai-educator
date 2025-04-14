import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useData } from '@/context/DataContext';
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
import { Search, Filter, Edit, Trash, Download, FilePlus, Wand2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { QuestionPaper } from '@/types';
import { generatePDF } from '@/lib/pdfGenerator';
import { cn } from '@/lib/utils';

const QuestionPapersPage: React.FC = () => {
  const { questionPapers, deleteQuestionPaper, user } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    board: '',
    class: '',
    subject: '',
  });
  const [viewPaper, setViewPaper] = useState<QuestionPaper | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [exportPassword, setExportPassword] = useState('');
  const [paperToExport, setPaperToExport] = useState<QuestionPaper | null>(null);
  
  const filteredPapers = questionPapers.filter(paper => {
    const matchesSearch = 
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      paper.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBoard = filters.board ? paper.board === filters.board : true;
    const matchesClass = filters.class ? paper.class === filters.class : true;
    const matchesSubject = filters.subject ? paper.subject === filters.subject : true;
    
    const hasSubjectAccess = user?.subjects.includes(paper.subject);

    return matchesSearch && matchesBoard && matchesClass && matchesSubject && hasSubjectAccess;
  });
  
  const sortedPapers = [...filteredPapers].sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  );
  
  const handleResetFilters = () => {
    setFilters({
      board: '',
      class: '',
      subject: '',
    });
    setSearchTerm('');
  };
  
  const handleViewPaper = (paper: QuestionPaper) => {
    setViewPaper(paper);
    setIsViewDialogOpen(true);
  };
  
  const handleDeletePaper = (paperId: string) => {
    if (window.confirm('Are you sure you want to delete this question paper?')) {
      deleteQuestionPaper(paperId);
    }
  };
  
  const handleExportPDF = (paper: QuestionPaper) => {
    setPaperToExport(paper);
    setIsPasswordDialogOpen(true);
  };
  
  const proceedWithExport = () => {
    if (paperToExport) {
      generatePDF(paperToExport, exportPassword).then(() => {
        setIsPasswordDialogOpen(false);
        setExportPassword('');
        setPaperToExport(null);
      });
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Question Papers</h1>
            <p className="text-gray-600">Manage and explore your created question papers</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-educate-400 hover:bg-educate-500">
              <Link to="/create-paper">
                <FilePlus className="mr-2 h-4 w-4" />
                Create Manually
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/generate-paper">
                <Wand2 className="mr-2 h-4 w-4" />
                Generate with AI
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search papers..."
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
                    <select 
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-xs border-gray-300 focus:outline-none focus:ring-educate-500 focus:border-educate-500 rounded-md"
                      value={filters.board} 
                      onChange={(e) => setFilters({...filters, board: e.target.value})}
                    >
                      <option value="">All boards</option>
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="State">State</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Class</label>
                    <select 
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-xs border-gray-300 focus:outline-none focus:ring-educate-500 focus:border-educate-500 rounded-md"
                      value={filters.class} 
                      onChange={(e) => setFilters({...filters, class: e.target.value})}
                    >
                      <option value="">All classes</option>
                      <option value="8">Class 8</option>
                      <option value="9">Class 9</option>
                      <option value="10">Class 10</option>
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Subject</label>
                    <select 
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-xs border-gray-300 focus:outline-none focus:ring-educate-500 focus:border-educate-500 rounded-md"
                      value={filters.subject} 
                      onChange={(e) => setFilters({...filters, subject: e.target.value})}
                    >
                      <option value="">All subjects</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="English">English</option>
                      <option value="History">History</option>
                      <option value="Geography">Geography</option>
                    </select>
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
        
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPapers.length > 0 ? (
              sortedPapers.map(paper => (
                <Card key={paper.id} className="overflow-hidden hover:shadow-md transition-all">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{paper.title}</CardTitle>
                        <CardDescription>
                          Created {paper.createdAt.toLocaleDateString()}
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
                          <DropdownMenuItem onClick={() => handleViewPaper(paper)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/edit-paper/${paper.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExportPDF(paper)}>
                            <Download className="mr-2 h-4 w-4" />
                            Export PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeletePaper(paper.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-2">
                    <div className="flex justify-between mb-4 text-sm">
                      <div>
                        <span className="font-medium">Marks:</span> {paper.totalMarks}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {paper.duration} min
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap mb-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {paper.board}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        Class {paper.class}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {paper.subject}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Sections:</span> {paper.sections.length}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Questions:</span> {paper.sections.reduce((sum, section) => sum + section.questions.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <span className="font-medium">Status:</span>
                      <span className={cn(
                        "ml-2 px-2 py-0.5 rounded-full text-xs",
                        paper.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      )}>
                        {paper.isApproved ? "Approved" : "Pending"}
                      </span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-2 border-t flex gap-2">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link to={`/edit-paper/${paper.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-educate-400 hover:bg-educate-500"
                      onClick={() => handleExportPDF(paper)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
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
                <h3 className="text-lg font-medium text-gray-900">No question papers found</h3>
                <p className="mt-2 text-gray-600 max-w-md mx-auto">
                  {questionPapers.length === 0 
                    ? "You haven't created any question papers yet. Create your first paper to get started!" 
                    : "No papers match the current search and filters. Try adjusting your criteria."}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  {questionPapers.length === 0 ? (
                    <>
                      <Button asChild className="bg-educate-400 hover:bg-educate-500">
                        <Link to="/create-paper">
                          <FilePlus className="mr-2 h-4 w-4" />
                          Create Manually
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link to="/generate-paper">
                          <Wand2 className="mr-2 h-4 w-4" />
                          Generate with AI
                        </Link>
                      </Button>
                    </>
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
        
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {viewPaper && (
              <>
                <DialogHeader>
                  <DialogTitle>{viewPaper.title}</DialogTitle>
                  <DialogDescription>
                    {viewPaper.board} | Class {viewPaper.class} | {viewPaper.subject}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-500">Total Marks</div>
                      <div>{viewPaper.totalMarks}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Duration</div>
                      <div>{viewPaper.duration} minutes</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Status</div>
                      <div className={cn(
                        "px-2 py-0.5 rounded-full text-xs inline-block",
                        viewPaper.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      )}>
                        {viewPaper.isApproved ? "Approved" : "Pending"}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Created On</div>
                      <div>{viewPaper.createdAt.toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Sections</div>
                      <div>{viewPaper.sections.length}</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-500">Questions</div>
                      <div>{viewPaper.sections.reduce((sum, section) => sum + section.questions.length, 0)}</div>
                    </div>
                  </div>
                  
                  {viewPaper.instructions && viewPaper.instructions.length > 0 && (
                    <div className="rounded-lg border p-4 bg-gray-50">
                      <div className="font-medium mb-2">Instructions</div>
                      <ol className="list-decimal pl-5 space-y-1">
                        {viewPaper.instructions.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    {viewPaper.sections.map((section, sectionIndex) => (
                      <div key={section.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-100 p-3 font-medium">
                          {section.title}
                          {section.description && (
                            <div className="text-sm font-normal text-gray-600 mt-1">
                              {section.description}
                            </div>
                          )}
                        </div>
                        
                        <div className="divide-y">
                          {section.questions.map((question, questionIndex) => (
                            <div key={question.id} className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="font-medium">
                                  Q{sectionIndex + 1}.{questionIndex + 1}
                                </div>
                                <div className="text-sm font-medium">
                                  {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                                </div>
                              </div>
                              <div className="mt-2">{question.text}</div>
                              
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
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <DialogFooter className="gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsViewDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button asChild>
                    <Link to={`/edit-paper/${viewPaper.id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Paper
                    </Link>
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
        
        <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Enter Password Protection</DialogTitle>
              <DialogDescription>
                Set a password to protect the exported PDF. This will be required to open the document.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={exportPassword}
                onChange={(e) => setExportPassword(e.target.value)}
                className="mb-2"
              />
              <p className="text-xs text-gray-500">
                School admin may have set a default password policy.
              </p>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsPasswordDialogOpen(false);
                  setExportPassword('');
                  setPaperToExport(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={proceedWithExport}
                disabled={!exportPassword.trim()}
                className="bg-educate-400 hover:bg-educate-500"
              >
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default QuestionPapersPage;
