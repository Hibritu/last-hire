import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import EmployerAuthService from "./services/authService";
import JobService from "./services/jobService";
import PaymentService from "./services/paymentService";
import { tokenManager } from "./lib/api";
import { ThemeProvider } from "./components/theme-provider";

const queryClient = new QueryClient();

// Development Banner Component - Removed for production

// Authentication wrapper component
const AuthenticatedApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 [EMPLOYER APP] Initializing HireHub Employer Connect Pro...');
        
        // Check if token is in URL (from Auth Hub redirect)
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        
        if (urlToken) {
          console.log('🔐 [EMPLOYER APP] Received token from Auth Hub, storing...');
          tokenManager.set(urlToken);
          
          // Remove token from URL for security
          const newUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, document.title, newUrl);
          
          console.log('✅ [EMPLOYER APP] Token stored successfully');
        }
        
        // Initialize services
        await EmployerAuthService.checkBackendAvailability();
        await JobService.initialize();
        await PaymentService.initialize();
        
        console.log('📋 [EMPLOYER APP] Services initialized');
        
        // Check if user is authenticated
        const hasToken = tokenManager.get();
        if (hasToken) {
          console.log('✅ [EMPLOYER APP] Token found, checking authentication...');
          const isAuth = EmployerAuthService.isAuthenticated();
          const role = EmployerAuthService.getCurrentUserRole();
          
          if (isAuth && (role === 'employer' || role === 'admin')) {
            console.log('✅ [EMPLOYER APP] User authenticated as:', role);
            setIsAuthenticated(true);
          } else {
            console.log('❌ [EMPLOYER APP] Invalid role or not authenticated');
            setIsAuthenticated(false);
          }
        } else {
          console.log('⚠️ [EMPLOYER APP] No token found, redirecting to login...');
          setIsAuthenticated(false);
        }
        
        setAuthChecked(true);
        
      } catch (error) {
        console.error('❌ [EMPLOYER APP] Initialization error:', error);
        setIsAuthenticated(false);
        setAuthChecked(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeApp();
  }, []);
  
  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-xl font-semibold text-foreground">Loading HireHub Employer Portal...</h2>
          <p className="text-muted-foreground">🇪🇹 Connecting to HireHub Ethiopia servers...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login page if not authenticated
  if (!isAuthenticated && authChecked) {
    console.log('❌ [EMPLOYER APP] Not authenticated, redirecting to login...');
    window.location.href = '/debug-auth.html';
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-xl font-semibold text-foreground">Redirecting to Login...</h2>
          <p className="text-muted-foreground">🔐 Please log in to access the Employer Portal</p>
        </div>
      </div>
    );
  }
  
  console.log('✅ [EMPLOYER APP] User authenticated, rendering app');
  
  // Render the authenticated app
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/payments/return" element={<Dashboard />} /> {/* Handle payment returns */}
            <Route path="/payments/cancel" element={<Dashboard />} /> {/* Handle payment cancels */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="hirehub-employer-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthenticatedApp />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
