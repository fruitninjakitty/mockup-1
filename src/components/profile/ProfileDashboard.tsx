
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Check, User, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  fullName: string;
  email: string;
  userType?: "student" | "teacher" | "assistant";
  schoolCode?: string;
  learningGoal: string;
  focusArea: string;
  learningSchedule: string;
  bio?: string;
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
  const { toast } = useToast();
  
  // Check for profile data in localStorage on mount
  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      // Merge with any existing profile data and update state
      setProfile(prev => ({ ...prev, ...parsedProfile }));
      // Also update the parent component
      onSave({ ...initialProfile, ...parsedProfile });
    }
  }, []);
  
  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    
    // If updating first or last name, also update the full name
    if (field === "firstName" || field === "lastName") {
      const updatedFirstName = field === "firstName" ? value : profile.firstName || "";
      const updatedLastName = field === "lastName" ? value : profile.lastName || "";
      setProfile(prev => ({ 
        ...prev, 
        fullName: `${updatedFirstName} ${updatedLastName}`.trim() 
      }));
    }
  };

  const handleSave = () => {
    // Save to localStorage for persistence
    localStorage.setItem("userProfile", JSON.stringify(profile));
    
    // Call the parent's onSave
    onSave(profile);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
      duration: 3000,
    });
    onClose();
  };

  const learningGoals = [
    { id: "professional", label: "Professional growth" },
    { id: "staying-sharp", label: "Staying sharp" },
    { id: "excelling", label: "Excelling in school" },
    { id: "child", label: "Helping my child learn" },
    { id: "students", label: "Helping my students learn" }
  ];

  const focusAreas = [
    { id: "skills", label: "Learning specific skills" },
    { id: "curiosity", label: "Following my curiosity" },
    { id: "problem-solving", label: "Building my problem-solving skills" },
    { id: "basics", label: "Brushing up on the basics" },
    { id: "other", label: "Something else" }
  ];

  const schedules = [
    { id: "morning", label: "Morning routine" },
    { id: "lunch", label: "Quick break" },
    { id: "evening", label: "Nightly ritual" },
    { id: "other", label: "Another time" }
  ];

  const userTypes = [
    { id: "student", label: "Student" },
    { id: "teacher", label: "Teacher" },
    { id: "assistant", label: "Teaching Assistant" }
  ];

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
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="firstName" className="text-right font-medium">
              First Name
            </label>
            <Input
              id="firstName"
              value={profile.firstName || ""}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="lastName" className="text-right font-medium">
              Last Name
            </label>
            <Input
              id="lastName"
              value={profile.lastName || ""}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="email" className="text-right font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="userType" className="text-right font-medium">
              User Type
            </label>
            <Select 
              value={profile.userType || "student"} 
              onValueChange={(value) => handleChange("userType", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select your user type" />
              </SelectTrigger>
              <SelectContent>
                {userTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="schoolCode" className="text-right font-medium">
              School Code
            </label>
            <Input
              id="schoolCode"
              value={profile.schoolCode || ""}
              onChange={(e) => handleChange("schoolCode", e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="learningGoal" className="text-right font-medium">
              Learning Goal
            </label>
            <Select 
              value={profile.learningGoal} 
              onValueChange={(value) => handleChange("learningGoal", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select your top goal" />
              </SelectTrigger>
              <SelectContent>
                {learningGoals.map(goal => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="focusArea" className="text-right font-medium">
              Focus Area
            </label>
            <Select 
              value={profile.focusArea} 
              onValueChange={(value) => handleChange("focusArea", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select your focus area" />
              </SelectTrigger>
              <SelectContent>
                {focusAreas.map(focus => (
                  <SelectItem key={focus.id} value={focus.id}>
                    {focus.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="learningSchedule" className="text-right font-medium">
              Learning Time
            </label>
            <Select 
              value={profile.learningSchedule} 
              onValueChange={(value) => handleChange("learningSchedule", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select your preferred time" />
              </SelectTrigger>
              <SelectContent>
                {schedules.map(schedule => (
                  <SelectItem key={schedule.id} value={schedule.id}>
                    {schedule.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <label htmlFor="bio" className="text-right font-medium pt-2">
              Bio
            </label>
            <Textarea
              id="bio"
              value={profile.bio || ""}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Tell us a bit about yourself..."
              className="col-span-3"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="gap-2">
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2 bg-secondary hover:bg-secondary/90">
            <Check className="h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
