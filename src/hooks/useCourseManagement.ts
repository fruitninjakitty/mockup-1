import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useCourseManagement() {
  const { toast } = useToast();
  const [activeCourses, setActiveCourses] = useState<Course[]>([]);
  const [archivedCourses, setArchivedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        
        // Fetch user's courses from Supabase
        const { data: userCoursesData, error: userCoursesError } = await supabase
          .from('users_courses')
          .select(`
            course_id,
            is_archived,
            role,
            courses:courses (
              id,
              title,
              description,
              image,
              created_at
            )
          `);

        if (userCoursesError) {
          console.error("Error fetching courses from Supabase:", userCoursesError);
          // Fall back to localStorage
          loadFromLocalStorage();
          return;
        }

        // Get total students count for each course
        const courseTotalStudents = new Map();
        
        // Count students manually for each course
        for (const userCourse of userCoursesData || []) {
          if (!userCourse.course_id) continue;
          
          const { count, error } = await supabase
            .from('users_courses')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', userCourse.course_id);
            
          if (!error && count !== null) {
            courseTotalStudents.set(userCourse.course_id, count);
          }
        }

        // Transform data to match our Course type
        if (userCoursesData && userCoursesData.length > 0) {
          const active: Course[] = [];
          const archived: Course[] = [];

          userCoursesData.forEach(userCourse => {
            if (userCourse.courses) {
              const courseData: Course = {
                id: userCourse.courses.id,
                title: userCourse.courses.title,
                description: userCourse.courses.description,
                image: userCourse.courses.image,
                roles: [userCourse.role],
                // Set default values for fields not in the database
                skillLevel: "All Levels",
                duration: "Self-paced",
                certification: false,
                learningObjectives: [],
                prerequisites: [],
                createdAt: userCourse.courses.created_at,
                schoolCode: "",
                totalStudents: courseTotalStudents.get(userCourse.course_id) || 0
              };

              if (userCourse.is_archived) {
                archived.push(courseData);
              } else {
                active.push(courseData);
              }
            }
          });

          setActiveCourses(active);
          setArchivedCourses(archived);
          
          // Also save to localStorage as backup
          localStorage.setItem('activeCourses', JSON.stringify(active));
          localStorage.setItem('archivedCourses', JSON.stringify(archived));
        } else {
          // If no courses in database, fallback to localStorage
          loadFromLocalStorage();
        }
      } catch (err) {
        console.error("Unexpected error fetching courses:", err);
        // Fall back to localStorage
        loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };

    const loadFromLocalStorage = () => {
      const initialCourses = [
        {
          id: 1,
          title: "Foundations of Cryptography",
          description: "Learn the basic paradigm and principles of modern cryptography",
          image: "/placeholder.svg",
          roles: ["Learner", "Teaching Assistant"],
          skillLevel: "Intermediate",
          duration: "12 weeks",
          totalStudents: 156,
          certification: true,
          learningObjectives: [
            "Understand symmetric key cryptography",
            "Learn about public key systems",
            "Apply cryptographic protocols"
          ],
          prerequisites: [
            "Basic number theory",
            "Probability theory",
            "Algorithms"
          ]
        },
        {
          id: 2,
          title: "Network Science for Web",
          description: "Network science is a multidisciplinary field",
          image: "/placeholder.svg",
          roles: ["Learner", "Teacher"],
          skillLevel: "Advanced",
          duration: "8 weeks",
          totalStudents: 98,
          certification: true,
          learningObjectives: [
            "Analyze network structures",
            "Model web interactions",
            "Identify network patterns"
          ],
          prerequisites: [
            "Graph theory",
            "Statistical analysis",
            "Programming experience"
          ]
        },
        {
          id: 3,
          title: "Machine Learning Basics",
          description: "Introduction to machine learning algorithms and applications",
          image: "/placeholder.svg",
          roles: ["Learner", "Teaching Assistant", "Teacher"],
          skillLevel: "Beginner",
          duration: "10 weeks",
          totalStudents: 243,
          certification: true,
          learningObjectives: [
            "Understand supervised learning",
            "Apply regression models",
            "Build classification systems"
          ],
          prerequisites: [
            "Linear algebra",
            "Calculus",
            "Python programming"
          ]
        },
        {
          id: 4,
          title: "Web Development Fundamentals",
          description: "Learn HTML, CSS, and JavaScript for modern web development",
          image: "/placeholder.svg",
          roles: ["Learner"],
          skillLevel: "Beginner",
          duration: "6 weeks",
          totalStudents: 312,
          certification: false,
          learningObjectives: [
            "Build responsive websites",
            "Implement interactive features",
            "Understand web standards"
          ],
          prerequisites: [
            "Basic computer skills",
            "Problem-solving ability"
          ]
        },
      ];
      
      const storedActiveCourses = localStorage.getItem('activeCourses');
      const storedArchivedCourses = localStorage.getItem('archivedCourses');
      
      if (storedActiveCourses) {
        setActiveCourses(JSON.parse(storedActiveCourses));
      } else {
        setActiveCourses(initialCourses);
        localStorage.setItem('activeCourses', JSON.stringify(initialCourses));
      }
      
      if (storedArchivedCourses) {
        setArchivedCourses(JSON.parse(storedArchivedCourses));
      } else {
        setArchivedCourses([]);
        localStorage.setItem('archivedCourses', JSON.stringify([]));
      }
    };

    fetchCourses();
  }, []);

  const handleArchiveToggle = async (courseId: number, archive: boolean) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('users_courses')
        .update({ is_archived: archive })
        .eq('course_id', courseId);

      if (error) {
        console.error("Error updating course archive status:", error);
        toast({
          title: "Error",
          description: "Could not update course status. Changes saved locally only.",
          duration: 3000,
        });
      }

      // Update local state regardless of Supabase result
      if (archive) {
        const courseToArchive = activeCourses.find(course => course.id === courseId);
        if (courseToArchive) {
          setActiveCourses(activeCourses.filter(course => course.id !== courseId));
          setArchivedCourses([...archivedCourses, courseToArchive]);
          
          // Update localStorage
          localStorage.setItem('activeCourses', JSON.stringify(
            activeCourses.filter(course => course.id !== courseId)
          ));
          localStorage.setItem('archivedCourses', JSON.stringify(
            [...archivedCourses, courseToArchive]
          ));
          
          toast({
            title: "Course Archived",
            description: `${courseToArchive.title} has been archived.`,
            duration: 3000,
          });
        }
      } else {
        const courseToUnarchive = archivedCourses.find(course => course.id === courseId);
        if (courseToUnarchive) {
          setArchivedCourses(archivedCourses.filter(course => course.id !== courseId));
          setActiveCourses([...activeCourses, courseToUnarchive]);
          
          // Update localStorage
          localStorage.setItem('archivedCourses', JSON.stringify(
            archivedCourses.filter(course => course.id !== courseId)
          ));
          localStorage.setItem('activeCourses', JSON.stringify(
            [...activeCourses, courseToUnarchive]
          ));
          
          toast({
            title: "Course Unarchived",
            description: `${courseToUnarchive.title} has been moved back to active courses.`,
            duration: 3000,
          });
        }
      }
    } catch (err) {
      console.error("Unexpected error toggling archive status:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return {
    activeCourses,
    archivedCourses,
    loading,
    handleArchiveToggle,
  };
}
