
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export const CreatePaperOptions = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 animate-fade-in">
      <Card className="border-2 hover:border-educate-400 transition-all">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-educate-400" />
            Build Manually
          </CardTitle>
          <CardDescription>Create a custom question paper from scratch</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
            <li>Full control over paper structure</li>
            <li>Add custom sections and questions</li>
            <li>Import questions from question bank</li>
            <li>Set custom marking scheme</li>
            <li>Flexible question organization</li>
          </ul>
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
          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
            <li>Intelligent question selection</li>
            <li>Auto-balanced difficulty levels</li>
            <li>Curriculum-aligned content</li>
            <li>Time-saving generation</li>
            <li>Customizable parameters</li>
          </ul>
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
