
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

interface ProfileAvatarProps {
  avatarUrl?: string;
  fullName: string;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileAvatar({ avatarUrl, fullName, onAvatarChange }: ProfileAvatarProps) {
  const getInitial = () => {
    return fullName ? fullName.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="flex justify-center mb-4">
      <div className="relative">
        <Avatar className="w-24 h-24">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={fullName} />
          ) : (
            <AvatarFallback className="text-xl bg-secondary text-white">
              {getInitial()}
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
            onChange={onAvatarChange}
          />
        </label>
      </div>
    </div>
  );
}
