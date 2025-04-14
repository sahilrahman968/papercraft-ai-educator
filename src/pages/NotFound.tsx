
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-20">
        <div className="rounded-full bg-red-100 p-6 mb-6">
          <FileQuestion className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-x-4">
          <Button asChild className="bg-educate-400 hover:bg-educate-500">
            <Link to="/">Return to Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/question-papers">View Question Papers</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
