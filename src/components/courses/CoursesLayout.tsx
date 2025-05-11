
import React from 'react';
import { CoursesHeader } from "@/components/courses/CoursesHeader";
import { ProfileDashboard, UserProfile } from "@/components/profile/ProfileDashboard";
import { UserSearch } from "@/components/search/UserSearch";
import { DisplayRole } from "@/types/roles";

interface CoursesLayoutProps {
  children: React.ReactNode;
  roles: DisplayRole[];
  availableRoles: DisplayRole[];
  currentQuote: string;
  onRoleChange: (role: DisplayRole) => void;
  userProfile: UserProfile;
  isProfileOpen: boolean;
  onProfileClose: () => void;
  onProfileClick: () => void;
  onProfileSave: (profile: UserProfile) => void;
}

export function CoursesLayout({
  children,
  roles,
  availableRoles,
  currentQuote,
  onRoleChange,
  userProfile,
  isProfileOpen,
  onProfileClose,
  onProfileClick,
  onProfileSave
}: CoursesLayoutProps) {
  const showUserSearch = roles.includes("Teacher") || roles.includes("Administrator");
  const userInitial = userProfile.fullName ? userProfile.fullName.charAt(0) : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F4F6] via-[#F8F7FA] to-[#E5DEFF]">
      <CoursesHeader
        roles={roles.length > 0 ? roles : ["Learner"]}
        availableRoles={availableRoles}
        quote={currentQuote}
        onRoleChange={onRoleChange}
        onProfileClick={onProfileClick}
        userInitial={userInitial}
        avatarUrl={userProfile.avatarUrl}
      />

      <ProfileDashboard 
        isOpen={isProfileOpen} 
        onClose={onProfileClose}
        initialProfile={userProfile}
        onSave={onProfileSave}
      />

      <main className="container section-padding">
        {showUserSearch && (
          <section className="mb-8">
            <UserSearch />
          </section>
        )}

        {children}
      </main>
    </div>
  );
}
