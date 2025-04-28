
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface CoursesHeaderProps {
  role: string;
  quote: string;
  onRoleChange: (role: string) => void;
  onProfileClick: () => void;
  userInitial: string;
}

export function CoursesHeader({ role, quote, onRoleChange, onProfileClick, userInitial }: CoursesHeaderProps) {
  return (
    <header className="header-glass sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <span className="text-primary">Hello,</span>{' '}
              <Select value={role} onValueChange={onRoleChange}>
                <SelectTrigger className="inline-flex w-auto text-2xl font-bold border-none bg-transparent p-0 focus:ring-0 ml-1 text-secondary">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-card z-40 shadow-lg border border-border rounded-lg">
                  <SelectItem value="Learner">Learner</SelectItem>
                  <SelectItem value="Teacher">Teacher</SelectItem>
                  <SelectItem value="Teaching Assistant">Teaching Assistant</SelectItem>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </h1>
            <p className="text-sm text-gray-500">{quote}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full transition-all hover:bg-primary/20"
          onClick={onProfileClick}
          title="Your Profile"
        >
          <span className="sr-only">User menu</span>
          <div className="w-9 h-9 rounded-full bg-primary text-white grid place-items-center font-semibold border-2 border-white shadow-inner">
            {userInitial}
          </div>
        </Button>
      </div>
    </header>
  );
}
