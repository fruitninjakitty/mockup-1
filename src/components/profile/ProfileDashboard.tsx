
import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, User, X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  fullName: string;
  email: string;
  userRoles?: string[];
  schoolCode?: string;
  bio?: string;
  avatarUrl?: string;
}

interface ProfileDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export function ProfileDashboard({ 
  isOpen, 
  onClose, 
  initialProfile,
  onSave 
}: ProfileDashboardProps) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  // Fetch user data from Supabase on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data: userProfile, error } = await supabase
          .from('profiles')
          .select('full_name, email, role, bio')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        if (userProfile) {
          // Split full name into first and last name if available
          let firstName = "", lastName = "";
          if (userProfile.full_name) {
            const nameParts = userProfile.full_name.split(' ');
            firstName = nameParts[0] || "";
            lastName = nameParts.slice(1).join(' ') || "";
          }

          const updatedProfile = {
            firstName,
            lastName,
            fullName: userProfile.full_name || "",
            email: userProfile.email || "",
            userRoles: [userProfile.role],
            bio: userProfile.bio || "",
          };
          
          setProfile(updatedProfile);
          onSave(updatedProfile);
        }
      } catch (error) {
        console.error("Error in fetchUserProfile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);
  
  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => {
      // Update fullName automatically when firstName or lastName changes
      if (field === "firstName" || field === "lastName") {
        const updatedFirstName = field === "firstName" ? value : prev.firstName || "";
        const updatedLastName = field === "lastName" ? value : prev.lastName || "";
        
        return {
          ...prev,
          [field]: value,
          fullName: `${updatedFirstName} ${updatedLastName}`.trim()
        };
      }
      
      return { ...prev, [field]: value };
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return null;
    
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile);
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error("Avatar upload error:", error);
      return null;
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      const userId = session.user.id;
      let avatarUrl = profile.avatarUrl;
      
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(userId);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: profile.fullName,
          bio: profile.bio,
          avatar_url: avatarUrl
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }
      
      const updatedProfile = {
        ...profile,
        avatarUrl
      };
      
      // Save to localStorage for persistence
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      
      // Call the parent's onSave
      onSave(updatedProfile);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
        duration: 3000,
      });
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-secondary" />
            Your Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Avatar Upload */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                {profile.avatarUrl ? (
                  <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
                ) : (
                  <AvatarFallback className="text-xl bg-secondary text-white">
                    {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-secondary text-white rounded-full p-1 cursor-pointer">
                <Upload size={16} />
                <input 
                  id="avatar-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </div>
          
          {/* Display info */}
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-medium">Name</span>
            <div className="col-span-3">
              <Input
                value={profile.fullName || ""}
                className="bg-muted"
                readOnly
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-medium">Email</span>
            <div className="col-span-3">
              <Input
                value={profile.email || ""}
                className="bg-muted"
                readOnly
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-medium">Role(s)</span>
            <div className="col-span-3">
              <div className="flex flex-wrap gap-2">
                {profile.userRoles?.map((role, index) => (
                  <div key={index} className="px-3 py-1 bg-secondary/10 rounded-full text-secondary text-sm">
                    {role}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {profile.schoolCode && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">School Code</span>
              <div className="col-span-3">
                <Input
                  value={profile.schoolCode}
                  className="bg-muted"
                  readOnly
                />
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-4 items-start gap-4">
            <span className="text-right font-medium pt-2">Bio</span>
            <Textarea
              value={profile.bio || ""}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Tell us a bit about yourself..."
              className="col-span-3"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="gap-2" disabled={isLoading}>
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="gap-2 bg-secondary hover:bg-secondary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-pulse">Saving...</span>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
