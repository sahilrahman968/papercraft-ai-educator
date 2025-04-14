
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/context/DataContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import QuestionBankPage from "./pages/QuestionBankPage";
import QuestionPapersPage from "./pages/QuestionPapersPage";
import CreatePaperPage from "./pages/CreatePaperPage";
import EditPaperPage from "./pages/EditPaperPage";
import GeneratePaperPage from "./pages/GeneratePaperPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/question-bank" element={<QuestionBankPage />} />
            <Route path="/question-papers" element={<QuestionPapersPage />} />
            <Route path="/create-paper" element={<CreatePaperPage />} />
            <Route path="/edit-paper/:paperId" element={<EditPaperPage />} />
            <Route path="/generate-paper" element={<GeneratePaperPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DataProvider>
  </QueryClientProvider>
);

export default App;
