
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DisplayRole } from '@/types/roles';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [roles, setRoles] = useState<DisplayRole[]>([]);
  const [selectedRole, setSelectedRole] = useState<DisplayRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quote, setQuote] = useState("");

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
        
        // Fetch roles from the user_roles table
        const { data: userRoles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);

        if (error) {
          console.error("Error fetching user roles:", error);
          toast({
            title: "Error",
            description: "Could not load your roles",
            variant: "destructive",
          });
          return;
        }

        if (userRoles && userRoles.length > 0) {
          // Convert database roles to display roles
          const displayRoles: DisplayRole[] = userRoles.map(role => {
            switch(role.role) {
              case 'administrator': return 'Administrator';
              case 'teacher': return 'Teacher';
              case 'teaching_assistant': return 'Teaching Assistant';
              case 'learner': 
              default: return 'Learner';
            }
          }) as DisplayRole[];
          
          setRoles(displayRoles);
          setSelectedRole(displayRoles[0]);
          
          // Set a role-based quote
          setQuoteForRole(displayRoles[0]);
        } else {
          // Default to Learner if no roles found
          setRoles(['Learner']);
          setSelectedRole('Learner');
          setQuote("Continue your learning journey, every step forward is progress.");
        }
      } catch (error) {
        console.error("Error in fetchUserRoles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRoles();
  }, [navigate, toast]);

  const handleRoleChange = (role: DisplayRole) => {
    setSelectedRole(role);
    setQuoteForRole(role);
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
