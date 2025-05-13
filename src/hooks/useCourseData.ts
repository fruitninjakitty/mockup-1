
import { useState, useEffect } from "react";
import { Course } from "@/types/course-types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useCourseData(courseId: string) {
  const [courseData, setCourseData] = useState<Course | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // First try to fetch from Supabase
        const { data: courseFromSupabase, error } = await supabase
          .from("courses")
          .select(`
            *,
            users_courses!inner (
              user_id,
              is_archived
            )
          `)
          .eq("id", Number(courseId))
          .single();

        if (error) {
          console.error("Error fetching course from Supabase:", error);
          
          // Fall back to localStorage as backup
          const fetchFromLocalStorage = () => {
            let allCourses: Course[] = [];
            const activeCourses = localStorage.getItem('activeCourses');
            const archivedCourses = localStorage.getItem('archivedCourses');
            
            if (activeCourses) {
              allCourses = [...allCourses, ...JSON.parse(activeCourses)];
            }
            
            if (archivedCourses) {
              allCourses = [...allCourses, ...JSON.parse(archivedCourses)];
            }
            
            if (allCourses.length === 0) {
              return null;
            }

            return allCourses.find(course => course.id === Number(courseId)) || null;
          };

          const localCourse = fetchFromLocalStorage();
          
          if (localCourse) {
            setCourseData(localCourse);
            document.title = `Course: ${localCourse.title}`;
          } else {
            toast({
              title: "Error",
              description: "Could not load course data",
              variant: "destructive",
            });
          }
          
          return;
        }

        // Get total students count
        const { count: totalStudents, error: countError } = await supabase
          .from("users_courses")
          .select("*", { count: "exact", head: true })
          .eq("course_id", Number(courseId));

        if (countError) {
          console.error("Error counting students:", countError);
        }

        // Transform Supabase data to match our Course type
        const transformedCourse: Course = {
          id: courseFromSupabase.id,
          title: courseFromSupabase.title,
          description: courseFromSupabase.description,
          image: courseFromSupabase.image,
          createdAt: courseFromSupabase.created_at,
          totalStudents: totalStudents || 0,
          // Fetch other additional data or set defaults
          skillLevel: courseFromSupabase.skill_level || "All Levels",
          duration: courseFromSupabase.duration || "Self-paced",
          certification: Boolean(courseFromSupabase.certification),
          learningObjectives: courseFromSupabase.learning_objectives || [],
          prerequisites: courseFromSupabase.prerequisites || [],
          schoolCode: courseFromSupabase.school_code || "",
        };

        setCourseData(transformedCourse);
        document.title = `Course: ${transformedCourse.title}`;
      } catch (err) {
        console.error("Unexpected error fetching course data:", err);
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading course data",
          variant: "destructive",
        });
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, toast]);

  return courseData;
}
