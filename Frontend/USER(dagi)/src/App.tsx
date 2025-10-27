import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useSearchParams } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { tokenManager } from "@/lib/api";
import Index from "./pages/Index";
import BrowseJobs from "./pages/BrowseJobs";
import BrowseFreelancers from "./pages/BrowseFreelancers";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";
import JobDetails from "./pages/JobDetails";
import NotFound from "./pages/NotFound";
import Messages from "./pages/Messages";
import Messaging from "./pages/Messaging";

const queryClient = new QueryClient();

// Component to handle auth token from URL
const TokenHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if token is in URL (from Auth Hub redirect)
    const urlToken = searchParams.get('token');
    
    if (urlToken) {
      console.log('🔐 [JOB SEEKER] Received token from Auth Hub, storing...');
      tokenManager.set(urlToken);
      
      // Remove token from URL for security
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
      
      console.log('✅ [JOB SEEKER] Token stored successfully');
    }
  }, [searchParams, navigate]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <TokenHandler />
          <div className="min-h-screen bg-background">
            <Navigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/browse" element={<BrowseJobs />} />
              <Route path="/freelancers" element={<BrowseFreelancers />} />
              <Route path="/applications" element={<MyApplications />} />
              <Route path="/messaging" element={<Messages />} />
              <Route path="/messaging/:id" element={<Messaging />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/job/:id" element={<JobDetails />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
