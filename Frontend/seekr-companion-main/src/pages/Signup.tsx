import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, UserPlus, Users, Briefcase } from "lucide-react";
import { toast } from "sonner";
import CentralizedAuthService from "../services/authService";
import { RegisterRequest } from "../types/auth";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "" as "job_seeker" | "employer" | "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already authenticated on component mount
  useEffect(() => {
    if (CentralizedAuthService.isAuthenticated()) {
      console.log('🔄 [SIGNUP] User already authenticated, checking for redirect...');
      CentralizedAuthService.checkAuthAndRedirect();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value as "job_seeker" | "employer",
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    if (!formData.role) {
      toast.error("Please select your role (Job Seeker or Employer)");
      return;
    }

    if (!acceptedTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      console.log('📝 [SIGNUP] Attempting registration for:', formData.email);
      
      const registerData: RegisterRequest = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
        role: formData.role,
      };
      
      const response = await CentralizedAuthService.register(registerData);
      
      console.log('✅ [SIGNUP] Registration successful for user:', response.user.email);
      console.log('📦 [SIGNUP] Response needsVerification:', response.needsVerification);
      
      // With the new backend flow, no token is returned - always verify email first
      if (response.needsVerification) {
        toast.success(
          `Account created successfully! Please check your email to verify your account.`,
          { duration: 5000 }
        );
        
        // ✅ Single setTimeout - redirect to verify email page with prefilled email
        setTimeout(() => {
          console.log('🔄 [SIGNUP] Redirecting to verify-email page');
          navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        }, 1500);
      } else {
        // Fallback in case backend changes behavior
        console.log('⚠️ [SIGNUP] No needsVerification flag, redirecting to login');
        toast.success(`Welcome to HireHub, ${response.user.first_name}!`);
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (error: any) {
      console.error('❌ [SIGNUP] Registration failed:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      // Handle specific error cases
      if (error?.response?.status === 409) {
        const errorData = error?.response?.data;
        if (errorData?.field === 'email') {
          errorMessage = 'This email is already registered. Please use a different email or try logging in instead.';
        } else if (errorData?.field === 'phone') {
          errorMessage = 'This phone number is already registered. Please use a different phone number.';
        } else {
          errorMessage = errorData?.message || 'This email or phone number is already registered.';
        }
      } else {
        errorMessage = error?.response?.data?.message || 
                      error?.message || 
                      'Registration failed. Please try again.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-2xl border-0 bg-gradient-card backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center animate-scale-in">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-slide-up">
              Join HireHub Ethiopia
            </CardTitle>
            <CardDescription className="text-muted-foreground animate-slide-up [animation-delay:0.1s]">
              Create your account to start your journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 animate-slide-up [animation-delay:0.2s]">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="transition-all duration-300 focus:scale-105"
                  />
                </div>
                <div className="space-y-2 animate-slide-up [animation-delay:0.3s]">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="transition-all duration-300 focus:scale-105"
                  />
                </div>
              </div>

              <div className="space-y-2 animate-slide-up [animation-delay:0.4s]">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="transition-all duration-300 focus:scale-105"
                />
              </div>

              <div className="space-y-2 animate-slide-up [animation-delay:0.45s]">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+251 912 345 678"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="transition-all duration-300 focus:scale-105"
                />
              </div>

              <div className="space-y-2 animate-slide-up [animation-delay:0.47s]">
                <Label htmlFor="role">I am a *</Label>
                <Select value={formData.role} onValueChange={handleRoleChange} disabled={isLoading}>
                  <SelectTrigger className="transition-all duration-300 focus:scale-105">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="job_seeker">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>Job Seeker - Looking for opportunities</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="employer">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-4 h-4" />
                        <span>Employer - Hiring talent</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 animate-slide-up [animation-delay:0.5s]">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password (min 6 characters)"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="pr-10 transition-all duration-300 focus:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2 animate-slide-up [animation-delay:0.6s]">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="pr-10 transition-all duration-300 focus:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 animate-slide-up [animation-delay:0.7s]">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  disabled={isLoading}
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:text-primary-light transition-colors hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:text-primary-light transition-colors hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:scale-105 transition-all duration-300 animate-slide-up [animation-delay:0.8s]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="text-center animate-slide-up [animation-delay:0.9s]">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary-light transition-colors hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
