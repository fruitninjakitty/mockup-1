
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileFormProps } from "./types";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileForm({ profile, isLoading, avatarFile, onProfileChange, onAvatarChange }: ProfileFormProps) {
  return (
    <div className="grid gap-4 py-4">
      {/* Avatar Upload */}
      <ProfileAvatar 
        avatarUrl={profile.avatarUrl} 
        fullName={profile.fullName}
        onAvatarChange={onAvatarChange}
        isLoading={isLoading}
      />
      
      {/* Display info */}
      <div className="grid grid-cols-4 items-center gap-4">
        <span className="text-right font-medium">Name</span>
        <div className="col-span-3">
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Input
              value={profile.fullName || ""}
              className="bg-muted"
              readOnly
            />
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <span className="text-right font-medium">Email</span>
        <div className="col-span-3">
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Input
              value={profile.email || ""}
              className="bg-muted"
              readOnly
            />
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <span className="text-right font-medium">Role(s)</span>
        <div className="col-span-3">
          {isLoading ? (
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.userRoles?.map((role, index) => (
                <div key={index} className="px-3 py-1 bg-secondary/10 rounded-full text-secondary text-sm">
                  {role}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {profile.schoolCode && (
        <div className="grid grid-cols-4 items-center gap-4">
          <span className="text-right font-medium">School Code</span>
          <div className="col-span-3">
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Input
                value={profile.schoolCode}
                className="bg-muted"
                readOnly
              />
            )}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-4 items-start gap-4">
        <span className="text-right font-medium pt-2">Bio</span>
        {isLoading ? (
          <div className="col-span-3">
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <Textarea
            value={profile.bio || ""}
            onChange={(e) => onProfileChange("bio", e.target.value)}
            placeholder="Tell us a bit about yourself..."
            className="col-span-3"
            rows={3}
            disabled={isLoading}
          />
        )}
      </div>
    </div>
  );
}
