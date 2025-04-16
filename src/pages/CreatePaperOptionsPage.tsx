
import { Layout } from "@/components/Layout";
import { CreatePaperOptions } from "@/components/paper/CreatePaperOptions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CreatePaperOptionsPage = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Create Question Paper</h1>
            <p className="text-gray-600">Choose how you want to create your question paper</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        
        <CreatePaperOptions />
        
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Need Help Getting Started?</h2>
          <p className="text-gray-600 mb-4">
            Not sure which option to choose? Here's a quick guide:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-2 text-educate-600">Choose Manual Builder if you:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Need complete control over every aspect of the paper</li>
                <li>Want to create unique, custom questions</li>
                <li>Have specific formatting requirements</li>
                <li>Need to follow a particular paper structure</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-2 text-educate-600">Choose AI Generation if you:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Need to create a paper quickly</li>
                <li>Want balanced difficulty distribution</li>
                <li>Need curriculum-aligned questions</li>
                <li>Prefer a time-saving approach</li>
              </ul>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mt-4">
            Note: You can always edit any paper after creation, regardless of which method you choose.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePaperOptionsPage;
