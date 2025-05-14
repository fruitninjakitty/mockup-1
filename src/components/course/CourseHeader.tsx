
import React from 'react';
import { Course } from "@/types/course-types";
import { UserProfile } from "@/components/profile/ProfileDashboard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DisplayRole } from '@/types/roles';

interface CourseHeaderProps {
  course: Course;
  userProfile: UserProfile;
  onProfileClick: () => void;
  roles: DisplayRole[];
  availableRoles: DisplayRole[];
  quote: string;
  onRoleChange: (role: DisplayRole) => void;
}

export function CourseHeader({ 
  course, 
  userProfile, 
  onProfileClick,
  roles,
  availableRoles,
  quote,
  onRoleChange
}: CourseHeaderProps) {
  const userInitial = userProfile.fullName ? userProfile.fullName.charAt(0) : "?";
  
  // Ensure we always have a role to display
  const displayRoles = roles.length > 0 ? roles : [("Learner" as DisplayRole)];
  const displayAvailableRoles = availableRoles.length > 0 ? availableRoles : [("Learner" as DisplayRole)];

  return (
    <header className="sticky top-0 z-30 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
              <span className="text-primary">Hello,</span>{' '}
              {displayRoles.length > 0 && displayAvailableRoles.length > 1 ? (
                <Select 
                  value={displayRoles[0]} 
                  onValueChange={(value) => onRoleChange(value as DisplayRole)}
                >
                  <SelectTrigger className="inline-flex w-auto text-xl sm:text-2xl font-semibold border-none bg-transparent p-0 focus:ring-0 ml-1 text-secondary">
                    <SelectValue placeholder="Learner" />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-40 shadow-lg border border-border rounded-lg">
                    {displayAvailableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className="text-secondary ml-1">{displayRoles[0]}</span>
              )}
            </h1>
            {quote && <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{quote}</p>}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="px-2">
            <span className="text-sm font-medium line-clamp-1">{course.title}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full transition-all hover:bg-primary/20"
            onClick={onProfileClick}
            title="Your Profile"
          >
            <span className="sr-only">User menu</span>
            <Avatar className="h-8 w-8">
              {userProfile.avatarUrl ? (
                <AvatarImage src={userProfile.avatarUrl} alt={userProfile.fullName || "User"} />
              ) : (
                <AvatarFallback className="bg-primary text-white text-sm font-semibold">
                  {userInitial}
                </AvatarFallback>
              )}
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  );
}
