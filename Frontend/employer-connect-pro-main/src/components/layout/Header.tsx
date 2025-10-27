import { useState, useEffect } from "react";
import { Bell, Menu, Moon, Sun, User, LogOut, UserCircle, Building, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import EmployerAuthService from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";
import { authUtils } from "@/lib/api";

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface HeaderProps {
  onTabChange?: (tab: string) => void;
}

export function Header({ onTabChange }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Fetch real notifications count from backend
  useEffect(() => {
    const fetchNotificationsCount = async () => {
      try {
        const response = await fetch('/api/notifications', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          const notifications = data.data || [];
          setUnreadCount(notifications.filter((n: any) => !n.read).length);
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
        setUnreadCount(0);
      }
    };

    fetchNotificationsCount();
  }, []);

  // Load current user from token on mount
  useEffect(() => {
    const loadUserFromToken = () => {
      try {
        const email = authUtils.getCurrentUserEmail();
        const userId = authUtils.getCurrentUserId();
        
        if (email && userId) {
          // Try to get user data from backend
          EmployerAuthService.getCurrentUser().then((user) => {
            if (user) {
              setCurrentUser({
                id: user.id,
                name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Employer',
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name
              });
            }
          }).catch((err) => {
            console.error('Failed to load user from backend:', err);
            // Fallback to token data
            setCurrentUser({
              id: userId,
              name: 'Employer',
              email: email
            });
          });
        }
      } catch (error) {
        console.error('Failed to parse user from token:', error);
      }
    };

    loadUserFromToken();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    try {
      console.log('🔓 [EMPLOYER HEADER] Logout requested');
      
      toast({
        title: "Logging out...",
        description: "Redirecting to HireHub Ethiopia authentication hub",
      });
      
      // Use the centralized logout from auth service
      await EmployerAuthService.logout();
    } catch (error) {
      console.error('❌ [EMPLOYER HEADER] Logout error:', error);
      toast({
        title: "Logout Error",
        description: "There was an issue logging out. Redirecting anyway.",
        variant: "destructive",
      });
      
      // Fallback: redirect to auth hub manually
      setTimeout(() => {
        window.location.href = 'http://localhost:3002/login?from=logout';
      }, 1000);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-sm font-bold text-white">🇪🇹</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-primary leading-tight">HireHub Ethiopia</h1>
              <span className="text-xs text-muted-foreground leading-none">Employer Portal</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{currentUser?.name || 'Loading...'}</p>
                  <p className="text-sm text-muted-foreground">
                    {currentUser?.email || 'Loading...'}
                  </p>
                  <p className="text-xs text-primary font-medium">
                    🇪🇹 Employer Account
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onTabChange?.('profile')}>
                <UserCircle className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTabChange?.('profile')}>
                <Building className="mr-2 h-4 w-4" />
                Company Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTabChange?.('payments')}>
                <CreditCard className="mr-2 h-4 w-4" />
                Billing & Payments
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout from HireHub
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}