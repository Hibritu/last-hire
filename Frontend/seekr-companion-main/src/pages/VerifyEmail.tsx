import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import CentralizedAuthService from "../services/authService";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialEmail = useMemo(() => searchParams.get("email") || "", [searchParams]);

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  
  // Resend OTP states
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
      console.log('📧 [VERIFY] Email from URL:', initialEmail);
    }
  }, [initialEmail]);

  // Cooldown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('🔍 [VERIFY] Submitting verification...');

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!otp || otp.trim().length !== 6) {
      toast.error("Please enter the 6-digit OTP sent to your email");
      return;
    }

    setIsVerifying(true);
    try {
      await CentralizedAuthService.verifyEmail({ email, otp: otp.trim() });
      toast.success("Email verified successfully! You can now sign in.");
      console.log('✅ [VERIFY] Email verified, redirecting to login');
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      console.error('❌ [VERIFY] Verification failed:', error);
      const msg = error?.response?.data?.error || error?.message || "Verification failed";
      toast.error(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Enter a valid email first');
      return;
    }
    setResending(true);
    try {
      console.log('🔄 [VERIFY] Resending OTP to:', email);
      await CentralizedAuthService.resendOtp({ email });
      toast.success('A new verification code has been sent to your email.');
      setCooldown(60);
    } catch (err: any) {
      console.error('❌ [VERIFY] Resend failed:', err);
      const msg = err?.response?.data?.error || err?.message || 'Failed to resend code';
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  const handleGetDebugOtp = async () => {
    if (import.meta.env.VITE_DEBUG !== "true") return;
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    setLoadingOtp(true);
    try {
      console.log('🔍 [VERIFY] Getting debug OTP for:', email);
      const response = await CentralizedAuthService.getDebugOTP(email);
      setOtp(String(response.otp || ""));
      toast.success("Loaded debug OTP: " + response.otp);
    } catch (err: any) {
      console.error('❌ [VERIFY] Debug OTP failed:', err);
      toast.error(err?.response?.data?.error || err?.message || "Failed to load debug OTP");
    } finally {
      setLoadingOtp(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="shadow-2xl border-0 bg-gradient-card backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center animate-scale-in">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-slide-up">
              Verify your email
            </CardTitle>
            <CardDescription className="text-muted-foreground animate-slide-up [animation-delay:0.1s]">
              We sent a 6-digit code to your email. Enter it below to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 animate-slide-up [animation-delay:0.2s]">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isVerifying}
                  className="transition-all duration-300 focus:scale-105"
                />
              </div>

              <div className="space-y-2 animate-slide-up [animation-delay:0.3s]">
                <Label htmlFor="otp">Verification Code (OTP)</Label>
                <div className="flex gap-2">
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    maxLength={6}
                    required
                    disabled={isVerifying}
                    className="transition-all duration-300 focus:scale-105"
                  />
                  {import.meta.env.VITE_DEBUG === "true" && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleGetDebugOtp} 
                      disabled={loadingOtp || isVerifying}
                    >
                      {loadingOtp ? "..." : "Get OTP"}
                    </Button>
                  )}
                </div>
                
                {/* Resend OTP section */}
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-muted-foreground">
                    Didn't receive the code?
                  </p>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={handleResend} 
                    disabled={resending || cooldown > 0 || isVerifying}
                    className="text-xs"
                  >
                    {resending ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Check your spam folder if you don't see the email.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:scale-105 transition-all duration-300 animate-slide-up [animation-delay:0.4s]"
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verify Email</span>
                  </div>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground animate-slide-up [animation-delay:0.5s]">
                Wrong email? <Link to="/signup" className="text-primary hover:underline">Create account again</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
