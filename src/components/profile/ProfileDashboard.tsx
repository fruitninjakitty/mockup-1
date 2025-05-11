
import { useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, User, X, Loader } from "lucide-react";
import { UserProfile } from "./types";
import { ProfileForm } from "./ProfileForm";
import { useProfileManager } from "./useProfileManager";
import { Progress } from "@/components/ui/progress";

interface ProfileDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export { type UserProfile };

export function ProfileDashboard({ 
  isOpen, 
  onClose, 
  initialProfile,
  onSave 
}: ProfileDashboardProps) {
  // Ensure initialProfile always has userRoles with at least "Learner" as default
  const safeInitialProfile = {
    ...initialProfile,
    userRoles: initialProfile.userRoles?.length ? initialProfile.userRoles : ["Learner"]
  };
  
  const {
    profile, 
    isLoading, 
    avatarFile,
    fetchUserProfile,
    handleChange,
    handleAvatarChange,
    saveProfile
  } = useProfileManager(safeInitialProfile, onSave);
  
  // Fetch user data when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);
  
  const handleSave = async () => {
    const success = await saveProfile();
    if (success) {
      onClose();
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
        
        {isLoading && (
          <div className="py-2">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Loader className="h-3 w-3 mr-2 animate-spin" />
              <span>Loading your profile</span>
            </div>
            <Progress value={75} className="h-1" />
          </div>
        )}
        
        <ProfileForm 
          profile={profile}
          isLoading={isLoading}
          avatarFile={avatarFile}
          onProfileChange={handleChange}
          onAvatarChange={handleAvatarChange}
        />
        
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
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </>
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
