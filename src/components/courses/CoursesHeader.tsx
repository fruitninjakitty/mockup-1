
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { LogOut, PlusCircle, XCircle } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DisplayRole } from '@/types/roles';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface CoursesHeaderProps {
  roles: DisplayRole[];
  availableRoles: DisplayRole[];
  quote: string;
  onRoleChange: (role: DisplayRole) => void;
  onProfileClick: () => void;
  userInitial: string;
  avatarUrl?: string;
  onAddRole?: (role: DisplayRole) => void;
  onRemoveRole?: (role: DisplayRole) => void;
}

export function CoursesHeader({ 
  roles, 
  availableRoles, 
  quote, 
  onRoleChange, 
  onProfileClick, 
  userInitial,
  avatarUrl,
  onAddRole,
  onRemoveRole
}: CoursesHeaderProps) {
  const { signOut } = useAuth();
  
  // Ensure we have at least a default role
  const displayRoles = roles.length > 0 ? roles : ["Learner"];
  const displayAvailableRoles = availableRoles.length > 0 ? availableRoles : ["Learner"];
  
  // Calculate roles that can be added (available but not current)
  const addableRoles = displayAvailableRoles.filter(
    role => !displayRoles.includes(role)
  );
  
  // Primary role is always the first one
  const primaryRole = displayRoles[0];
  // Secondary roles are all others
  const secondaryRoles = displayRoles.slice(1);
  
  return (
    <header className="header-glass sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold flex items-center">
              <span className="text-primary">Hello,</span>{' '}
              {displayRoles.length > 0 && displayAvailableRoles.length > 1 ? (
                <Select 
                  value={primaryRole} 
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
                <span className="text-secondary ml-1">{primaryRole}</span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">{quote}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Secondary roles display */}
          <div className="flex flex-wrap gap-1">
            {secondaryRoles.map((role, index) => (
              <div key={index} className="px-2 py-1 bg-secondary/10 rounded-full text-secondary text-xs flex items-center gap-1">
                {role}
                {onRemoveRole && (
                  <button 
                    onClick={() => onRemoveRole(role)}
                    className="hover:text-red-500 transition-colors"
                    aria-label={`Remove ${role} role`}
                  >
                    <XCircle size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Role management dropdown - only show if there are roles to add */}
          {onAddRole && addableRoles.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full" title="Manage roles">
                  <PlusCircle size={18} />
                  <span className="sr-only">Add role</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                  Add Role
                </div>
                <DropdownMenuSeparator />
                {addableRoles.map(role => (
                  <DropdownMenuItem 
                    key={role} 
                    onClick={() => onAddRole(role)}
                    className="cursor-pointer"
                  >
                    {role}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
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
