"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { AdminAuthService } from "@/services/authService";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@hirehub.et");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    if (AdminAuthService.isTokenValid()) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Call real backend API
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim(), 
          password: password.trim() 
        })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Check if user is admin
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        
        if (payload.role !== 'admin') {
          setError('Access denied. Admin role required.');
          setIsLoading(false);
          return;
        }

        // Store token
        localStorage.setItem('hirehub_token', data.token);
        if (data.refresh_token) {
          localStorage.setItem('hirehub_refresh_token', data.refresh_token);
        }

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setError(data.error || 'Login failed');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">H</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            HireHub Ethiopia
          </CardTitle>
          <CardDescription className="text-gray-600">
            Admin Dashboard Access
          </CardDescription>
          <Badge variant="secondary" className="mt-2">
            Secure Admin Portal
          </Badge>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@hirehub.et"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In to Admin Panel"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-gray-500">
              Admin Credentials: admin@hirehub.et / admin123
            </p>
            <p className="text-xs text-gray-400">
              Only users with admin role can access this panel
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}