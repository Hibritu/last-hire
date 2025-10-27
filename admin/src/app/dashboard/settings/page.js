"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Bell,
  Users,
  Building2,
  CreditCard,
  Database,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    // General Settings
    platformName: "HireHub Ethiopia",
    platformDescription: "Connecting talented professionals with great opportunities in Ethiopia",
    contactEmail: "admin@hirehub.et",
    supportPhone: "+251 911 123 456",
    timezone: "Africa/Addis_Ababa",
    language: "English",

    // Security Settings
    requireTwoFactor: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    enableAuditLog: true,

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    maintenanceMode: false,

    // User Management
    autoApproveUsers: false,
    requireEmailVerification: true,
    requirePhoneVerification: false,
    maxProfilePhotos: 5,

    // Employer Settings
    requireBusinessVerification: true,
    requireTaxCertificate: true,
    maxJobPostings: 10,
    premiumJobPrice: 299.99,

    // Payment Settings
    enablePayments: true,
    supportedCurrencies: ["USD", "ETB"],
    paymentMethods: ["Credit Card", "PayPal", "Bank Transfer"],
    refundPolicy: "7 days",

    // System Settings
    maxFileSize: 10,
    allowedFileTypes: ["jpg", "png", "pdf", "doc"],
    backupFrequency: "Daily",
    logRetention: "90 days"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log("Saving settings:", settings);
    // Implement actual save logic here
  };

  const handleResetSettings = () => {
    console.log("Resetting settings to defaults");
    // Implement reset logic here
  };

  const handleTestEmail = () => {
    console.log("Testing email configuration");
    // Implement email test logic here
  };

  const handleBackupNow = () => {
    console.log("Creating manual backup");
    // Implement backup logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600">Configure platform settings and system preferences</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleResetSettings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Platform Settings</CardTitle>
              <CardDescription>Basic platform configuration and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={settings.platformName}
                    onChange={(e) => handleSettingChange('platformName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={settings.supportPhone}
                    onChange={(e) => handleSettingChange('supportPhone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    className="w-full p-2 border rounded-md"
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  >
                    <option value="Africa/Addis_Ababa">Africa/Addis_Ababa</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="platformDescription">Platform Description</Label>
                <Input
                  id="platformDescription"
                  value={settings.platformDescription}
                  onChange={(e) => handleSettingChange('platformDescription', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Configuration</CardTitle>
              <CardDescription>Platform security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireTwoFactor">Require Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Force all users to enable 2FA</p>
                  </div>
                  <Switch
                    id="requireTwoFactor"
                    checked={settings.requireTwoFactor}
                    onCheckedChange={(checked) => handleSettingChange('requireTwoFactor', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableAuditLog">Enable Audit Logging</Label>
                    <p className="text-sm text-gray-500">Log all administrative actions</p>
                  </div>
                  <Switch
                    id="enableAuditLog"
                    checked={settings.enableAuditLog}
                    onCheckedChange={(checked) => handleSettingChange('enableAuditLog', checked)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="adminPassword">Admin Password</Label>
                <div className="flex space-x-2">
                  <Input
                    id="adminPassword"
                    type={showPassword ? "text" : "password"}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter new admin password"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how notifications are sent to users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Send notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Send notifications via SMS</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Send push notifications to mobile apps</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">Enable maintenance mode for system updates</p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline" onClick={handleTestEmail}>
                  <Bell className="h-4 w-4 mr-2" />
                  Test Email Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management Settings */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management Settings</CardTitle>
              <CardDescription>Configure how users are managed on the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoApproveUsers">Auto-approve New Users</Label>
                    <p className="text-sm text-gray-500">Automatically approve new user registrations</p>
                  </div>
                  <Switch
                    id="autoApproveUsers"
                    checked={settings.autoApproveUsers}
                    onCheckedChange={(checked) => handleSettingChange('autoApproveUsers', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                    <p className="text-sm text-gray-500">Users must verify their email address</p>
                  </div>
                  <Switch
                    id="requireEmailVerification"
                    checked={settings.requireEmailVerification}
                    onCheckedChange={(checked) => handleSettingChange('requireEmailVerification', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requirePhoneVerification">Require Phone Verification</Label>
                    <p className="text-sm text-gray-500">Users must verify their phone number</p>
                  </div>
                  <Switch
                    id="requirePhoneVerification"
                    checked={settings.requirePhoneVerification}
                    onCheckedChange={(checked) => handleSettingChange('requirePhoneVerification', checked)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxProfilePhotos">Maximum Profile Photos</Label>
                  <Input
                    id="maxProfilePhotos"
                    type="number"
                    value={settings.maxProfilePhotos}
                    onChange={(e) => handleSettingChange('maxProfilePhotos', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
              <CardDescription>Configure payment methods and pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enablePayments">Enable Payments</Label>
                    <p className="text-sm text-gray-500">Allow users to make payments on the platform</p>
                  </div>
                  <Switch
                    id="enablePayments"
                    checked={settings.enablePayments}
                    onCheckedChange={(checked) => handleSettingChange('enablePayments', checked)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="premiumJobPrice">Premium Job Price (USD)</Label>
                  <Input
                    id="premiumJobPrice"
                    type="number"
                    step="0.01"
                    value={settings.premiumJobPrice}
                    onChange={(e) => handleSettingChange('premiumJobPrice', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxJobPostings">Maximum Job Postings</Label>
                  <Input
                    id="maxJobPostings"
                    type="number"
                    value={settings.maxJobPostings}
                    onChange={(e) => handleSettingChange('maxJobPostings', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="refundPolicy">Refund Policy</Label>
                <Input
                  id="refundPolicy"
                  value={settings.refundPolicy}
                  onChange={(e) => handleSettingChange('refundPolicy', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Platform system and maintenance settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <select
                    id="backupFrequency"
                    className="w-full p-2 border rounded-md"
                    value={settings.backupFrequency}
                    onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="logRetention">Log Retention Period</Label>
                  <select
                    id="logRetention"
                    className="w-full p-2 border rounded-md"
                    value={settings.logRetention}
                    onChange={(e) => handleSettingChange('logRetention', e.target.value)}
                  >
                    <option value="30 days">30 days</option>
                    <option value="90 days">90 days</option>
                    <option value="1 year">1 year</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                <Input
                  id="allowedFileTypes"
                  value={settings.allowedFileTypes.join(", ")}
                  onChange={(e) => handleSettingChange('allowedFileTypes', e.target.value.split(", "))}
                  placeholder="jpg, png, pdf, doc"
                />
              </div>

              <div className="pt-4">
                <Button variant="outline" onClick={handleBackupNow}>
                  <Database className="h-4 w-4 mr-2" />
                  Create Manual Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">All settings are up to date</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Last saved: Never</Badge>
              <Badge variant="outline">Auto-save: Enabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}