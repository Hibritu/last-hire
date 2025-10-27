import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Users, 
  CreditCard, 
  Settings,
  Filter
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function NotificationsPage() {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    applications: true,
    payments: true,
    system: true
  });
  const { toast } = useToast();

  // Fetch real notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/notifications', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.data || []);
        } else {
          setNotifications([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to load notifications:', err);
        setNotifications([]);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    toast({
      title: "Marked as read",
      description: "Notification has been marked as read.",
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: "All your notifications have been marked as read.",
    });
  };

  const toggleSetting = (setting: 'applications' | 'payments' | 'system') => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
    const isEnabled = !settings[setting];
    toast({
      title: `${setting.charAt(0).toUpperCase() + setting.slice(1)} notifications ${isEnabled ? 'enabled' : 'disabled'}`,
      description: `You will ${isEnabled ? 'now' : 'no longer'} receive ${setting} notifications.`,
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <Users className="h-4 w-4" />;
      case 'payment':
        return <CreditCard className="h-4 w-4" />;
      case 'system':
        return <Settings className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'application':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'payment':
        return 'text-success bg-success/10';
      case 'system':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your hiring activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="secondary">
              {unreadCount} unread
            </Badge>
          )}
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
        </div>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter notifications" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Notifications</SelectItem>
                <SelectItem value="unread">Unread Only</SelectItem>
                <SelectItem value="application">Applications</SelectItem>
                <SelectItem value="payment">Payments</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <Card key={notification.id} className={cn(
            "transition-colors",
            !notification.read && "border-primary/50 bg-primary/5"
          )}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-2 rounded-full",
                  getNotificationColor(notification.type)
                )}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {notification.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                    
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <Check className="mr-2 h-3 w-3" />
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">No notifications found</h3>
                <p className="text-muted-foreground">
                  {filter === 'unread' 
                    ? "You're all caught up! No unread notifications."
                    : filter !== 'all'
                    ? `No ${filter} notifications found.`
                    : "You don't have any notifications yet."
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">New Applications</h4>
              <p className="text-sm text-muted-foreground">
                Get notified when someone applies to your jobs
              </p>
            </div>
            <Button 
              variant={settings.applications ? "default" : "outline"} 
              size="sm"
              onClick={() => toggleSetting('applications')}
            >
              {settings.applications ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Payment Updates</h4>
              <p className="text-sm text-muted-foreground">
                Receive updates about payment status
              </p>
            </div>
            <Button 
              variant={settings.payments ? "default" : "outline"} 
              size="sm"
              onClick={() => toggleSetting('payments')}
            >
              {settings.payments ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">System Updates</h4>
              <p className="text-sm text-muted-foreground">
                Important updates about the platform
              </p>
            </div>
            <Button 
              variant={settings.system ? "default" : "outline"} 
              size="sm"
              onClick={() => toggleSetting('system')}
            >
              {settings.system ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}