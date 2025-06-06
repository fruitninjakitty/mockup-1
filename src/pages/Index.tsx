
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DisplayRole } from '@/types/roles';
import { displayRoleToDbRole, dbRoleToDisplayRole } from '@/utils/roleUtils';
import { Database } from "@/integrations/supabase/types";
import { PointsDisplay } from '@/components/gamification/PointsDisplay';
import { useGamification } from '@/hooks/useGamification';

type DatabaseRole = Database["public"]["Enums"]["user_role"];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [roles, setRoles] = useState<DisplayRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<DisplayRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quote, setQuote] = useState("");
  const { stats } = useGamification();

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          // Redirect to login if not authenticated
          navigate('/');
          return;
        }
        
        let userDisplayRoles: DisplayRole[] = [];
        let fallbackToDefault = true;
        
        try {
          // Try to use the database function to get user roles
          const { data: userRoles, error } = await supabase
            .rpc('get_user_roles', { user_id: session.user.id });
  
          if (userRoles && userRoles.length > 0 && !error) {
            // Convert database roles to display roles
            userDisplayRoles = userRoles.map(role => dbRoleToDisplayRole(role));
            fallbackToDefault = false;
          } else {
            console.info("No roles found or error occurred:", error);
          }
        } catch (error) {
          console.error("Error fetching user roles:", error);
        }
        
        // If no roles from database, try to get from user metadata
        if (fallbackToDefault && session.user.user_metadata?.role) {
          const metadataRole = dbRoleToDisplayRole(session.user.user_metadata.role as DatabaseRole);
          userDisplayRoles = [metadataRole];
          fallbackToDefault = false;
        }
        
        // Default to Learner if everything else fails
        if (fallbackToDefault || userDisplayRoles.length === 0) {
          userDisplayRoles = ['Learner'];
        }
        
        setRoles(userDisplayRoles);
        setSelectedRole(userDisplayRoles[0]);
        setQuoteForRole(userDisplayRoles[0]);
        
      } catch (error) {
        console.error("Error in fetchUserRoles:", error);
        toast({
          title: "Error",
          description: "Could not load user roles",
          variant: "destructive",
        });
        
        // Set default role even on error
        setRoles(['Learner']);
        setSelectedRole('Learner');
        setQuote("Continue your learning journey, every step forward is progress.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRoles();
  }, [navigate, toast]);

  const handleRoleChange = async (role: DisplayRole) => {
    try {
      setSelectedRole(role);
      setQuoteForRole(role);
      
      // Update the user's primary role in the database
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      let dbRole: DatabaseRole = displayRoleToDbRole(role);
      
      // Update the primary role in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: dbRole })
        .eq('id', session.user.id);
        
      if (profileError) {
        console.error("Error updating role:", profileError);
        toast({
          title: "Error",
          description: "Failed to update your role",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };

  const setQuoteForRole = (role: DisplayRole) => {
    switch (role) {
      case 'Administrator':
        setQuote("Managing education systems requires vision, wisdom, and dedication.");
        break;
      case 'Teacher':
        setQuote("Great teachers inspire minds and change lives forever.");
        break;
      case 'Teaching Assistant':
        setQuote("Supporting others in their learning journey is a noble pursuit.");
        break;
      case 'Learner':
      default:
        setQuote("Continue your learning journey, every step forward is progress.");
        break;
    }
  };

  const goToCourses = () => {
    navigate('/courses');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#F4F4F6] via-[#F8F7FA] to-[#E5DEFF]">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <div className="space-y-2 mt-8">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#F4F4F6] via-[#F8F7FA] to-[#E5DEFF]">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Gamification Stats */}
        {stats && (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg mb-6">
            <div className="flex items-center justify-center gap-6">
              <PointsDisplay 
                points={stats.total_points} 
                size="lg" 
                animated={true}
              />
              {stats.league && (
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: stats.league.color }}
                  >
                    {stats.league.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium" style={{ color: stats.league.color }}>
                    {stats.league.name}
                  </span>
                </div>
              )}
            </div>
            {stats.current_streak > 0 && (
              <p className="text-sm text-orange-600 mt-2">
                🔥 {stats.current_streak} day streak!
              </p>
            )}
          </div>
        )}

        <div>
          <h1 className="text-4xl font-bold mb-2 text-blue-600">
            Hello, {selectedRole && (
              <span className="text-green-500 relative group">
                {selectedRole}
                {roles.length > 1 && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 hidden group-hover:block z-10">
                    {roles.map((role) => (
                      <button
                        key={role}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          role === selectedRole ? 'bg-gray-100' : ''
                        }`}
                        onClick={() => handleRoleChange(role)}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                )}
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-2">{quote}</p>
        </div>
        
        <div className="pt-8">
          <Button 
            onClick={goToCourses} 
            className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
          >
            Go to Courses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
