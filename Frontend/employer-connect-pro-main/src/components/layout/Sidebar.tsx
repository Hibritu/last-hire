import { 
  Briefcase, 
  MessageSquare, 
  Bell, 
  User, 
  PlusCircle, 
  FileText,
  CreditCard,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'post-job', label: 'Post Job', icon: PlusCircle },
  { id: 'jobs', label: 'My Jobs', icon: Briefcase },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'chat', label: 'Messages', icon: MessageSquare },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'payments', label: 'Payments', icon: CreditCard },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-64 border-r bg-card h-[calc(100vh-4rem)]">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">Employer Panel</h2>
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  activeTab === item.id && "bg-primary text-primary-foreground"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}