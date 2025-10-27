import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import CentralizedAuthService from "../services/authService";
import { LoginRequest, UserRole, APP_REDIRECTS } from "../types/auth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [targetApp, setTargetApp] = useState<string>("");

  // Check if user is already authenticated on component mount
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const fromLogout = urlParams.get('from') === 'logout';
      const fromApp = urlParams.get('from') === 'app';
      
      if ((fromLogout || fromApp) && isMounted) {
        console.log('🔄 [LOGIN] User came from logout/app redirect, staying on login page');
        // Clear the URL parameter
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (CentralizedAuthService.isAuthenticated() && !fromLogout && !fromApp && isMounted) {
        console.log('🔄 [LOGIN] User already authenticated, checking for redirect...');
        CentralizedAuthService.checkAuthAndRedirect();
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔐 [LOGIN] Attempting login for:', email);
      
      const loginData: LoginRequest = { email, password };
      const response = await CentralizedAuthService.login(loginData);
      
      console.log('✅ [LOGIN] Login successful for user:', response.user.email);
      console.log('👤 [LOGIN] User role:', response.user.role);
      
      // Show success message with redirect info
      const role = response.user.role as UserRole;
      const appConfig = APP_REDIRECTS[role];
      
      if (appConfig) {
        setRedirecting(true);
        setTargetApp(appConfig.appName);
        
        toast.success(
          `Welcome back, ${response.user.first_name}! Redirecting to ${appConfig.appName}...`,
          { duration: 3000 }
        );
        
        // Delay to show the success message before redirect
        setTimeout(() => {
          console.log('🔄 [LOGIN] Redirect timer completed');
          // The redirect is handled automatically by the auth service
        }, 2000);
      } else {
        toast.success(`Welcome back, ${response.user.first_name}!`);
        setIsLoading(false);
      }
      
    } catch (error: any) {
      console.error('❌ [LOGIN] Login failed:', error);

      // Handle unverified account - backend returns 401 with needsVerification flag
      const needsVerification = error?.response?.data?.needsVerification;
      const emailFromServer = error?.response?.data?.email as string | undefined;
      
      if (needsVerification && emailFromServer) {
        toast.warning('Email not verified', { 
          description: 'Please enter the OTP sent to your email to verify your account.' 
        });
        navigate(`/verify-email?email=${encodeURIComponent(emailFromServer)}`);
        return;
      }

      // Handle other errors
      const errorMessage = error?.response?.data?.error || 
                          error?.response?.data?.message || 
                          error?.message || 
                          'Login failed. Please check your credentials.';
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-gradient-card backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-slide-up">
            {redirecting ? `Redirecting to ${targetApp}` : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-muted-foreground animate-slide-up [animation-delay:0.1s]">
            {redirecting 
              ? 'Please wait while we redirect you to your dashboard...' 
              : 'Sign in to access your HireHub account'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2 animate-slide-up [animation-delay:0.2s]">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || redirecting}
                className="transition-all duration-300 focus:scale-105"
              />
            </div>
            
            <div className="space-y-2 animate-slide-up [animation-delay:0.3s]">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || redirecting}
                  className="pr-10 transition-all duration-300 focus:scale-105"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || redirecting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:scale-105 transition-all duration-300 animate-slide-up [animation-delay:0.4s]"
              disabled={isLoading || redirecting}
            >
              {redirecting ? (
                <div className="flex items-center space-x-2">
                  <ArrowRight className="w-4 h-4 animate-pulse" />
                  <span>Redirecting to {targetApp}...</span>
                </div>
              ) : isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {!redirecting && (
            <>
              <div className="text-center animate-slide-up [animation-delay:0.5s]">
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-primary hover:text-primary-light transition-colors hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>

              <div className="text-center animate-slide-up [animation-delay:0.6s]">
                <Link
                  to="/forgot-password"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            </>
          )}
          
          {redirecting && (
            <div className="text-center animate-slide-up [animation-delay:0.5s]">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0s]" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.1s]" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                You will be redirected automatically in a few seconds
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
