
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DisplayRole } from '@/types/roles';

interface CoursesHeaderProps {
  roles: DisplayRole[];
  availableRoles: DisplayRole[];
  quote: string;
  onRoleChange: (role: DisplayRole) => void;
  onProfileClick: () => void;
  userInitial: string;
  avatarUrl?: string;
}

export function CoursesHeader({ 
  roles, 
  availableRoles, 
  quote, 
  onRoleChange, 
  onProfileClick, 
  userInitial,
  avatarUrl
}: CoursesHeaderProps) {
  const { signOut } = useAuth();
  
  // Ensure we have at least a default role
  const displayRoles = roles.length > 0 ? roles : ["Learner"];
  const displayAvailableRoles = availableRoles.length > 0 ? availableRoles : ["Learner"];
  
  return (
    <header className="header-glass sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold flex items-center">
              <span className="text-primary">Hello,</span>{' '}
              {displayRoles.length > 0 && displayAvailableRoles.length > 1 ? (
                <Select 
                  value={displayRoles[0]} 
                  onValueChange={onRoleChange}
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
            <p className="text-xs sm:text-sm text-muted-foreground">{quote}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-wrap gap-1">
            {displayRoles.length > 1 && displayRoles.slice(1).map((role, index) => (
              <div key={index} className="px-2 py-1 bg-secondary/10 rounded-full text-secondary text-xs">
                {role}
              </div>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={signOut} 
            className="rounded-full"
            title="Sign out"
          >
            <LogOut size={18} className="text-gray-600" />
            <span className="sr-only">Sign out</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full transition-all hover:bg-primary/20"
            onClick={onProfileClick}
            title="Your Profile"
          >
            <span className="sr-only">User menu</span>
            <Avatar className="h-9 w-9">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt="User" />
              ) : (
                <AvatarFallback className="bg-primary text-white font-semibold">
                  {userInitial || '?'}
                </AvatarFallback>
              )}
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  );
}
