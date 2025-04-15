
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "@/context/DataContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import QuestionBankPage from "./pages/QuestionBankPage";
import QuestionPapersPage from "./pages/QuestionPapersPage";
import CreatePaperPage from "./pages/CreatePaperPage";
import EditPaperPage from "./pages/EditPaperPage";
import GeneratePaperPage from "./pages/GeneratePaperPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DataProvider>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              
              <Route path="/question-bank" element={
                <ProtectedRoute>
                  <QuestionBankPage />
                </ProtectedRoute>
              } />
              
              <Route path="/question-papers" element={
                <ProtectedRoute>
                  <QuestionPapersPage />
                </ProtectedRoute>
              } />
              
              <Route path="/create-paper" element={
                <ProtectedRoute>
                  <CreatePaperPage />
                </ProtectedRoute>
              } />
              
              <Route path="/edit-paper/:paperId" element={
                <ProtectedRoute>
                  <EditPaperPage />
                </ProtectedRoute>
              } />
              
              <Route path="/generate-paper" element={
                <ProtectedRoute>
                  <GeneratePaperPage />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin-dashboard" element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } />
              
              {/* Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </DataProvider>
  </QueryClientProvider>
);

export default App;
