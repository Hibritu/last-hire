import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, Building, User } from "lucide-react";
import EmployerAuthService from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

export function ProfilePage() {
  const [profileType, setProfileType] = useState<'individual' | 'company'>('company');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [employerProfile, setEmployerProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    website: '',
    phone: '',
    address: '',
    tradeLicense: '',
    nationalId: '',
    individualPhone: ''
  });
  const { toast } = useToast();

  // Fetch real employer profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const user = await EmployerAuthService.getCurrentUser();
        setCurrentUser(user);
        
        // Fetch employer profile if available
        try {
          const response = await fetch('/employers/me', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (response.ok) {
            const profile = await response.json();
            setEmployerProfile(profile);
            setFormData({
              companyName: profile.company_name || user.name || '',
              description: profile.description || '',
              website: profile.website || '',
              phone: profile.phone || user.phone || '',
              address: profile.address || user.location || '',
              tradeLicense: profile.trade_license || '',
              nationalId: profile.national_id || '',
              individualPhone: user.phone || ''
            });
          }
        } catch (err) {
          console.log('No employer profile yet');
          setFormData(prev => ({
            ...prev,
            companyName: user.name || '',
            phone: user.phone || '',
            individualPhone: user.phone || ''
          }));
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = () => {
    // Validate required fields
    if (profileType === 'company' && !formData.companyName.trim()) {
      toast({
        title: "Validation Error",
        description: "Company name is required.",
        variant: "destructive"
      });
      return;
    }
    
    if (profileType === 'individual' && !formData.nationalId.trim()) {
      toast({
        title: "Validation Error",
        description: "National ID is required.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      companyName: mockCurrentUser.name,
      description: '',
      website: '',
      phone: '',
      address: '',
      tradeLicense: '',
      nationalId: '',
      individualPhone: ''
    });
    setIsEditing(false);
    toast({
      title: "Changes Cancelled",
      description: "Your changes have been discarded.",
    });
  };

  const handleFileUpload = (fileType: string) => {
    toast({
      title: "File Upload",
      description: `${fileType} upload functionality would open a file picker here.`,
    });
    // In a real app, this would:
    // 1. Open a file picker
    // 2. Validate file type and size
    // 3. Upload to server
    // 4. Update the UI with upload progress
    // 5. Show success/error message
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">
            Manage your employer profile and verification status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={currentUser?.is_verified ? "default" : "secondary"}>
            {currentUser?.is_verified ? "Verified" : "Pending Verification"}
          </Badge>
          <Button 
            variant={isEditing ? "outline" : "default"}
            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
      </div>

      {/* Profile Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Account Type</CardTitle>
          <CardDescription>
            Choose your account type to customize your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              variant={profileType === 'company' ? 'default' : 'outline'}
              onClick={() => setProfileType('company')}
              className="h-20 w-full flex-col gap-2"
              disabled={!isEditing}
            >
              <Building className="h-6 w-6" />
              Company
            </Button>
            <Button
              variant={profileType === 'individual' ? 'default' : 'outline'}
              onClick={() => setProfileType('individual')}
              className="h-20 w-full flex-col gap-2"
              disabled={!isEditing}
            >
              <User className="h-6 w-6" />
              Individual
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Company Profile */}
      {profileType === 'company' && (
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Provide your company details and upload required documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Input
                  id="sector"
                  value={employerProfile?.sector || ''}
                  disabled={!isEditing}
                  placeholder="e.g., Technology"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                disabled={!isEditing}
              />
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Logo</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Upload company logo (JPG, PNG)
                  </p>
                  <Button variant="outline" size="sm" className="mt-2" disabled={!isEditing} onClick={() => handleFileUpload('Company Logo')}>
                    Choose File
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Business License</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Upload business license (PDF, JPG)
                  </p>
                  <Button variant="outline" size="sm" className="mt-2" disabled={!isEditing} onClick={() => handleFileUpload('Business License')}>
                    Choose File
                  </Button>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Individual Profile */}
      {profileType === 'individual' && (
        <Card>
          <CardHeader>
            <CardTitle>Individual Information</CardTitle>
            <CardDescription>
              Provide your personal details for verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nationalId">National ID</Label>
                <Input
                  id="nationalId"
                  placeholder="Enter your national ID"
                  disabled={!isEditing}
                  value={formData.nationalId}
                  onChange={(e) => setFormData({...formData, nationalId: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="individualPhone">Phone Number</Label>
                <Input
                  id="individualPhone"
                  placeholder="+251911234567"
                  disabled={!isEditing}
                  value={formData.individualPhone}
                  onChange={(e) => setFormData({...formData, individualPhone: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>National ID Document</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Upload national ID (PDF, JPG)
                </p>
                <Button variant="outline" size="sm" className="mt-2" disabled={!isEditing} onClick={() => handleFileUpload('National ID Document')}>
                  Choose File
                </Button>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}