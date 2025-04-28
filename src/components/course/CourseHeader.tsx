
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/components/profile/ProfileDashboard";

interface CourseHeaderProps {
  userProfile: UserProfile;
  onProfileClick: () => void;
}

export function CourseHeader({ userProfile, onProfileClick }: CourseHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/courses")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-primary">Foundations of Cryptography</h1>
            <p className="text-sm">
              <span className="text-gray-600">Learn the basic paradigm and principles of modern cryptography - </span>
              <span className="text-[#43BC88]">Learner</span>
            </p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          onClick={onProfileClick}
        >
          <span className="sr-only">User menu</span>
          <div className="w-8 h-8 rounded-full bg-secondary text-white grid place-items-center">
            {userProfile.firstName ? userProfile.firstName.charAt(0) : 
             (userProfile.fullName ? userProfile.fullName.charAt(0) : "J")}
          </div>
        </Button>
      </div>
    </header>
  );
}
