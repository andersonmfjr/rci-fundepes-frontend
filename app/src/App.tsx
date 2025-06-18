import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import ProjectForm from "./pages/ProjectForm";
import ProjectDetail from "./pages/ProjectDetail";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { authService } from "./lib/auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/projects" replace /> : <Login />
              } 
            />
            <Route 
              path="/projects" 
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/projects/new" 
              element={
                <ProtectedRoute>
                  <ProjectForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/projects/:id" 
              element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/projects/:id/edit" 
              element={
                <ProtectedRoute>
                  <ProjectForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/" 
              element={<Navigate to="/projects" replace />} 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
