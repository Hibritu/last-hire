"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Send,
  Clock,
  Bell,
  Users,
  Building2,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  Trash2,
  Edit
} from "lucide-react";

export default function Notifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "announcement",
    target: "all",
    priority: "normal"
  });

  const notifications = [
    {
      id: 1,
      title: "System Maintenance Notice",
      message: "We will be performing scheduled maintenance on January 25th, 2024 from 2:00 AM to 4:00 AM EAT. During this time, the platform may be temporarily unavailable.",
      type: "announcement",
      target: "all",
      priority: "high",
      status: "sent",
      sentBy: "Admin User",
      sentDate: "2024-01-20",
      recipients: "All Users",
      readCount: 1247
    },
    {
      id: 2,
      title: "New Feature: Advanced Job Search",
      message: "We're excited to announce our new advanced job search feature! Job seekers can now filter jobs by salary range, experience level, and more.",
      type: "announcement",
      target: "jobseekers",
      priority: "normal",
      status: "sent",
      sentBy: "Admin User",
      sentDate: "2024-01-18",
      recipients: "Job Seekers",
      readCount: 892
    },
    {
      id: 3,
      title: "Employer Verification Reminder",
      message: "Please ensure your business license and tax certificates are up to date. Accounts with expired documents will be temporarily suspended.",
      type: "reminder",
      target: "employers",
      priority: "high",
      status: "scheduled",
      sentBy: "Admin User",
      sentDate: "2024-01-22",
      recipients: "Employers",
      readCount: 0
    },
    {
      id: 4,
      title: "Welcome to New Users",
      message: "Welcome to HireHub Ethiopia! We're here to connect talented professionals with great opportunities. Complete your profile to get started.",
      type: "welcome",
      target: "newusers",
      priority: "normal",
      status: "draft",
      sentBy: "Admin User",
      sentDate: "2024-01-21",
      recipients: "New Users",
      readCount: 0
    },
    {
      id: 5,
      title: "Payment System Update",
      message: "We've updated our payment system to support more payment methods. Premium job postings now support mobile money and bank transfers.",
      type: "update",
      target: "employers",
      priority: "normal",
      status: "sent",
      sentBy: "Admin User",
      sentDate: "2024-01-17",
      recipients: "Employers",
      readCount: 156
    }
  ];

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "sent":
        return <Badge variant="default">Sent</Badge>;
      case "scheduled":
        return <Badge variant="secondary">Scheduled</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "normal":
        return <Badge variant="default">Normal</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "announcement":
        return <Bell className="h-4 w-4" />;
      case "reminder":
        return <Clock className="h-4 w-4" />;
      case "welcome":
        return <Users className="h-4 w-4" />;
      case "update":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const handleCreateNotification = () => {
    console.log("Creating notification:", newNotification);
    // Implement actual creation logic here
    setShowCreateDialog(false);
    setNewNotification({
      title: "",
      message: "",
      type: "announcement",
      target: "all",
      priority: "normal"
    });
  };

  const handleNotificationAction = (action, notificationId) => {
    console.log(`${action} notification ${notificationId}`);
    // Implement actual actions here
  };

  const getNotificationsByStatus = (status) => {
    if (status === "all") return filteredNotifications;
    return filteredNotifications.filter(notification => notification.status === status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications & Announcements</h1>
          <p className="text-gray-600">Send system-wide announcements and communicate with users</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Notification</DialogTitle>
              <DialogDescription>Send a notification to users on the platform</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter notification title..."
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter notification message..."
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    className="w-full p-2 border rounded-md"
                    value={newNotification.type}
                    onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                  >
                    <option value="announcement">Announcement</option>
                    <option value="reminder">Reminder</option>
                    <option value="welcome">Welcome</option>
                    <option value="update">Update</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="target">Target Audience</Label>
                  <select
                    id="target"
                    className="w-full p-2 border rounded-md"
                    value={newNotification.target}
                    onChange={(e) => setNewNotification({...newNotification, target: e.target.value})}
                  >
                    <option value="all">All Users</option>
                    <option value="jobseekers">Job Seekers</option>
                    <option value="employers">Employers</option>
                    <option value="newusers">New Users</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    className="w-full p-2 border rounded-md"
                    value={newNotification.priority}
                    onChange={(e) => setNewNotification({...newNotification, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateNotification}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search notifications by title, message, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All ({filteredNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="sent">
            Sent ({getNotificationsByStatus("sent").length})
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            Scheduled ({getNotificationsByStatus("scheduled").length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Drafts ({getNotificationsByStatus("draft").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>All system notifications and announcements</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Notification</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getNotificationsByStatus(activeTab).map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            {getTypeIcon(notification.type)}
                          </div>
                          <div>
                            <div className="font-medium">{notification.title}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {notification.message}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {notification.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{notification.recipients}</div>
                          <div className="text-gray-500">{notification.readCount} read</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(notification.priority)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(notification.status)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {notification.sentDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedNotification(notification)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          {notification.status === "draft" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleNotificationAction('edit', notification.id)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleNotificationAction('delete', notification.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notification Detail Dialog */}
      <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Notification Details</DialogTitle>
            <DialogDescription>Complete information about the selected notification</DialogDescription>
          </DialogHeader>
          {selectedNotification && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  {getTypeIcon(selectedNotification.type)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedNotification.title}</h3>
                  <p className="text-gray-600">Sent by {selectedNotification.sentBy}</p>
                  {getStatusBadge(selectedNotification.status)}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Message Content</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm">{selectedNotification.message}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Notification Details</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Type</label>
                      <p className="text-sm capitalize">{selectedNotification.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Target Audience</label>
                      <p className="text-sm">{selectedNotification.recipients}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Priority</label>
                      <div className="mt-1">{getPriorityBadge(selectedNotification.priority)}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Delivery Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Sent Date</label>
                      <p className="text-sm">{selectedNotification.sentDate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Read Count</label>
                      <p className="text-sm">{selectedNotification.readCount} users</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <div className="mt-1">{getStatusBadge(selectedNotification.status)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                {selectedNotification.status === "draft" && (
                  <Button variant="default" onClick={() => handleNotificationAction('send', selectedNotification.id)}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Now
                  </Button>
                )}
                <Button variant="outline" onClick={() => handleNotificationAction('duplicate', selectedNotification.id)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
                <Button variant="outline" onClick={() => handleNotificationAction('edit', selectedNotification.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" onClick={() => handleNotificationAction('delete', selectedNotification.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}