
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { UserProfile } from "../types";
import { SchoolCodeField } from "@/components/common/FormFields/SchoolCodeField";

interface ProfileInfoFieldsProps {
  profile: UserProfile;
  isLoading: boolean;
  onProfileChange: (field: keyof UserProfile, value: string) => void;
}

export function ProfileInfoFields({ profile, isLoading, onProfileChange }: ProfileInfoFieldsProps) {
  return (
    <>
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
      
      <div className="grid grid-cols-4 items-center gap-4">
        <span className="text-right font-medium">School Code</span>
        <div className="col-span-3">
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <SchoolCodeField
              schoolCode={profile.schoolCode || ""}
              onSchoolCodeChange={(value) => onProfileChange("schoolCode", value)}
              placeholder="Enter school code"
              label=""
            />
          )}
        </div>
      </div>
      
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
    </>
  );
}
