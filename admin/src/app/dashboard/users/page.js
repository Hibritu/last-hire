"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  UserX,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download,
  AlertTriangle
} from "lucide-react";
import { AdminService } from "@/services/adminService";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getAllUsers({ role: 'job_seeker', limit: 100 });
      setUsers(data.users || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getAllUsers({ 
        role: 'job_seeker', 
        search: searchTerm,
        limit: 100 
      });
      setUsers(data.users || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to search users:', error);
      setLoading(false);
    }
  };

  const handleUserAction = async (action, userId) => {
    try {
      setActionLoading(true);
      let status = action;
      
      if (action === 'suspend') status = 'suspended';
      if (action === 'activate') status = 'active';
      if (action === 'verify') status = 'verified';

      await AdminService.updateUserStatus(userId, status);
      
      // Refresh users list
      await fetchUsers();
      setActionLoading(false);
      alert(`User ${action}ed successfully`);
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      setActionLoading(false);
      alert(`Failed to ${action} user`);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (user) => {
    if (!user.is_active) {
      return <Badge variant="destructive">Suspended</Badge>;
    } else if (!user.is_verified) {
      return <Badge variant="secondary">Pending</Badge>;
    } else {
      return <Badge variant="default">Active</Badge>;
    }
  };

  const getUserInitials = (user) => {
    const first = user.first_name || '';
    const last = user.last_name || '';
    return `${first[0] || ''}${last[0] || ''}`.toUpperCase() || 'U';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage job seekers and their accounts</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Users
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (e.target.value === '') fetchUsers();
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleSearch}>Search</Button>
            <Button variant="outline" onClick={fetchUsers}>
              <Filter className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Job Seekers ({filteredUsers.length})</CardTitle>
          <CardDescription>All registered job seekers on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.profile_picture} alt={`${user.first_name} ${user.last_name}`} />
                          <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.first_name} {user.last_name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-3 w-3 mr-1 text-gray-400" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{user.applicationCount || 0}</div>
                        <div className="text-gray-500">Applications</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={actionLoading}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          {user.is_active ? (
                            <DropdownMenuItem onClick={() => handleUserAction('suspend', user.id)}>
                              <UserX className="h-4 w-4 mr-2" />
                              Suspend Account
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleUserAction('activate', user.id)}>
                              <Shield className="h-4 w-4 mr-2" />
                              Activate Account
                            </DropdownMenuItem>
                          )}
                          {!user.is_verified && (
                            <DropdownMenuItem onClick={() => handleUserAction('verify', user.id)}>
                              <Shield className="h-4 w-4 mr-2" />
                              Verify Account
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Profile Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>Detailed information about the selected user</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedUser.profile_picture} alt={`${selectedUser.first_name} ${selectedUser.last_name}`} />
                  <AvatarFallback className="text-2xl">
                    {getUserInitials(selectedUser)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.first_name} {selectedUser.last_name}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  {getStatusBadge(selectedUser)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-sm">{selectedUser.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="text-sm">{selectedUser.gender || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Join Date</label>
                  <p className="text-sm">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Applications</label>
                  <p className="text-sm">{selectedUser.applicationCount || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Verified</label>
                  <p className="text-sm">{selectedUser.is_verified ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="text-sm">{selectedUser.is_active ? 'Active' : 'Suspended'}</p>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                {selectedUser.is_active ? (
                  <Button variant="outline" onClick={() => handleUserAction('suspend', selectedUser.id)} disabled={actionLoading}>
                    <UserX className="h-4 w-4 mr-2" />
                    Suspend Account
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => handleUserAction('activate', selectedUser.id)} disabled={actionLoading}>
                    <Shield className="h-4 w-4 mr-2" />
                    Activate Account
                  </Button>
                )}
                {!selectedUser.is_verified && (
                  <Button variant="outline" onClick={() => handleUserAction('verify', selectedUser.id)} disabled={actionLoading}>
                    <Shield className="h-4 w-4 mr-2" />
                    Verify Account
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
