
import { Layout } from "@/components/Layout";
import { CreatePaperOptions } from "@/components/paper/CreatePaperOptions";

const CreatePaperOptionsPage = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Create Question Paper</h1>
          <p className="text-gray-600">Choose how you want to create your question paper</p>
        </div>
        
        <CreatePaperOptions />
      </div>
    </Layout>
  );
};

export default CreatePaperOptionsPage;
