
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/context/DataContext';
import { Link } from 'react-router-dom';
import { BookOpen, Database, FileText, FilePlus, Wand2 } from 'lucide-react';

const Index = () => {
  const { user, questionPapers, questions } = useData();
  
  // Get the 3 most recent papers
  const recentPapers = [...questionPapers]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
            <p className="text-gray-600 mt-1">{user?.school} | {user?.role}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-educate-400 hover:bg-educate-500">
              <Link to="/create-paper">
                <FilePlus className="mr-2 h-4 w-4" />
                Create New Paper
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/question-bank">
                <Database className="mr-2 h-4 w-4" />
                Manage Question Bank
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Wand2 className="h-6 w-6 text-educate-400" />
                  Generate with AI
                </CardTitle>
                <CardDescription>
                  Create a complete question paper with AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Select parameters like board, class, subject, and let AI generate a fully structured question paper with appropriate difficulty distribution.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="bg-educate-400 hover:bg-educate-500 w-full">
                  <Link to="/create-paper/generate-paper">Create AI Paper</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-educate-400" />
                  Build Manually
                </CardTitle>
                <CardDescription>
                  Create a custom question paper from scratch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Design your own paper with full control. Add sections, pick questions from the question bank, or write custom questions.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/create-paper/manual">Create Custom Paper</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {/* Quick stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Question Bank</CardTitle>
              <CardDescription>Total questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-educate-400">{questions.length}</div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/question-bank">View Question Bank</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Question Papers</CardTitle>
              <CardDescription>Created papers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-educate-400">{questionPapers.length}</div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/question-papers">View All Papers</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Subjects</CardTitle>
              <CardDescription>Your assigned subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-educate-400">{user?.subjects.length}</div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-wrap gap-2">
                {user?.subjects.map(subject => (
                  <span key={subject} className="px-2 py-1 bg-educate-100 text-educate-700 rounded text-xs">
                    {subject}
                  </span>
                ))}
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Recent Papers */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Question Papers</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {recentPapers.map(paper => (
              <Card key={paper.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{paper.title}</CardTitle>
                  <CardDescription>
                    Created {paper.createdAt.toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-4">
                    <div className="text-sm">
                      <span className="font-medium">Marks:</span> {paper.totalMarks}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Duration:</span> {paper.duration} min
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
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
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to={`/edit-paper/${paper.id}`}>
                      <FileText className="mr-2 h-4 w-4" />
                      Edit Paper
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {recentPapers.length === 0 && (
              <div className="col-span-3 p-8 text-center border rounded-lg bg-gray-50">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No question papers yet</h3>
                <p className="mt-2 text-gray-600 max-w-md mx-auto">
                  Create your first question paper to get started. You can build one manually or use AI assistance.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild className="bg-educate-400 hover:bg-educate-500">
                    <Link to="/create-paper">
                      <FilePlus className="mr-2 h-4 w-4" />
                      Create Manually
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/generate-paper">
                      <Wand2 className="mr-2 h-4 w-4" />
                      AI Generate
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
