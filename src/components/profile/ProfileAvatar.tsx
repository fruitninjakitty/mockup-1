
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, Loader } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileAvatarProps {
  avatarUrl?: string;
  fullName: string;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
}

export function ProfileAvatar({ avatarUrl, fullName, onAvatarChange, isLoading = false }: ProfileAvatarProps) {
  const [isUploading, setIsUploading] = useState(false);
  
  const getInitial = () => {
    return fullName ? fullName.charAt(0).toUpperCase() : "U";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    onAvatarChange(e);
    // Reset uploading state after a short delay to simulate upload completion
    setTimeout(() => setIsUploading(false), 800);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mb-4">
        <Skeleton className="w-24 h-24 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex justify-center mb-4">
      <div className="relative">
        <Avatar className="w-24 h-24">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={fullName} />
          ) : (
            <AvatarFallback className="text-xl bg-secondary text-white">
              {isUploading ? <Loader className="h-6 w-6 animate-spin" /> : getInitial()}
            </AvatarFallback>
          )}
        </Avatar>
        <label htmlFor="avatar-upload" className={`absolute bottom-0 right-0 bg-secondary text-white rounded-full p-1 cursor-pointer ${isUploading ? 'animate-pulse' : ''}`}>
          {isUploading ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
          <input 
            id="avatar-upload" 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading || isUploading}
          />
        </label>
      </div>
    </div>
  );
}
