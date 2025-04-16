
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, FileText, BookOpen, PenSquare, List, BarChart } from "lucide-react";
import { Link } from "react-router-dom";

export const CreatePaperOptions = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 animate-fade-in">
      <Card className="border-2 hover:border-educate-400 transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <PenSquare className="h-6 w-6 text-educate-400" />
            Build Manually
          </CardTitle>
          <CardDescription>Create a custom question paper from scratch</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">
              Design a complete question paper with full control over every aspect.
              Add custom sections and questions according to your requirements.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-md">
                <div className="flex items-start space-x-2">
                  <List className="h-5 w-5 text-educate-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Flexible Structure</h4>
                    <p className="text-xs text-gray-500">Create custom sections with specific instructions</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-md">
                <div className="flex items-start space-x-2">
                  <BookOpen className="h-5 w-5 text-educate-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Question Bank</h4>
                    <p className="text-xs text-gray-500">Select from existing questions in your library</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-md">
                <div className="flex items-start space-x-2">
                  <FileText className="h-5 w-5 text-educate-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Custom Questions</h4>
                    <p className="text-xs text-gray-500">Write your own questions with rich formatting</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-md">
                <div className="flex items-start space-x-2">
                  <BarChart className="h-5 w-5 text-educate-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Marking Scheme</h4>
                    <p className="text-xs text-gray-500">Define custom marks for each question</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full bg-educate-400 hover:bg-educate-500">
            <Link to="/create-paper/manual">Create Custom Paper</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-2 hover:border-educate-400 transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Wand2 className="h-6 w-6 text-educate-400" />
            Generate with AI
          </CardTitle>
          <CardDescription>Let AI create a complete question paper</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">
              Save time by letting our AI system generate a complete question paper based 
              on your specifications. Perfect for when you need a paper quickly.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-md">
                <div className="flex items-start space-x-2">
                  <Wand2 className="h-5 w-5 text-educate-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Smart Selection</h4>
                    <p className="text-xs text-gray-500">AI picks questions based on your criteria</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-md">
                <div className="flex items-start space-x-2">
                  <BarChart className="h-5 w-5 text-educate-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Balanced Difficulty</h4>
                    <p className="text-xs text-gray-500">Customizable easy/medium/hard ratio</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-md">
                <div className="flex items-start space-x-2">
                  <BookOpen className="h-5 w-5 text-educate-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Curriculum Aligned</h4>
                    <p className="text-xs text-gray-500">Questions match your selected syllabus</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-md">
                <div className="flex items-start space-x-2">
                  <FileText className="h-5 w-5 text-educate-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Full Paper</h4>
                    <p className="text-xs text-gray-500">Complete with sections and instructions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link to="/create-paper/generate-paper">Generate with AI</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
