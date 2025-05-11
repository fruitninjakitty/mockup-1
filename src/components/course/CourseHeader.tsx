
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/components/profile/ProfileDashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface CourseHeaderProps {
  course: Course;
  userProfile: UserProfile;
  onProfileClick: () => void;
}

export function CourseHeader({ course, userProfile, onProfileClick }: CourseHeaderProps) {
  const navigate = useNavigate();

  // Get the initial from userProfile
  const getInitial = () => {
    if (userProfile.firstName) return userProfile.firstName.charAt(0);
    if (userProfile.fullName) return userProfile.fullName.charAt(0);
    return "U";
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/courses")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-primary">{course.title}</h1>
            <p className="text-sm">
              <span className="text-gray-600">{course.description} - </span>
              <span className="text-[#43BC88]">
                {userProfile.userRoles && userProfile.userRoles.length > 0 ? userProfile.userRoles[0] : "Learner"}
              </span>
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
          <Avatar className="h-8 w-8">
            {userProfile.avatarUrl ? (
              <AvatarImage src={userProfile.avatarUrl} alt="User avatar" />
            ) : (
              <AvatarFallback className="bg-secondary text-white">
                {getInitial()}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </div>
    </header>
  );
}
