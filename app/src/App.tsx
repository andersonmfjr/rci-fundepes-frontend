import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Contracts from "./pages/Contracts";
import ContractDetail from "./pages/ContractDetail";
import BiOverview from "./pages/BiOverview";
import BiDetails from "./pages/BiDetails";
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
                isAuthenticated ? (
                  <Navigate to="/contracts" replace />
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/contracts"
              element={
                <ProtectedRoute>
                  <Contracts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contracts/:id"
              element={
                <ProtectedRoute>
                  <ContractDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bi"
              element={
                <ProtectedRoute>
                  <BiOverview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bi/:id"
              element={
                <ProtectedRoute>
                  <BiDetails />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/contracts" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
