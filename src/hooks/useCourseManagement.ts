
import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { useToast } from "@/hooks/use-toast";

const initialCourses = [
  {
    id: 1,
    title: "Foundations of Cryptography",
    description: "Learn the basic paradigm and principles of modern cryptography",
    image: "/placeholder.svg",
    roles: ["Learner", "Teaching Assistant"]
  },
  {
    id: 2,
    title: "Network Science for Web",
    description: "Network science is a multidisciplinary field",
    image: "/placeholder.svg",
    roles: ["Learner", "Teacher"]
  },
  {
    id: 3,
    title: "Machine Learning Basics",
    description: "Introduction to machine learning algorithms and applications",
    image: "/placeholder.svg",
    roles: ["Learner", "Teaching Assistant", "Teacher"]
  },
  {
    id: 4,
    title: "Web Development Fundamentals",
    description: "Learn HTML, CSS, and JavaScript for modern web development",
    image: "/placeholder.svg",
    roles: ["Learner"]
  },
];

export function useCourseManagement() {
  const { toast } = useToast();
  const [activeCourses, setActiveCourses] = useState<Course[]>([]);
  const [archivedCourses, setArchivedCourses] = useState<Course[]>([]);

  useEffect(() => {
    const storedActiveCourses = localStorage.getItem('activeCourses');
    const storedArchivedCourses = localStorage.getItem('archivedCourses');
    
    if (storedActiveCourses) {
      setActiveCourses(JSON.parse(storedActiveCourses));
    } else {
      setActiveCourses(initialCourses);
    }
    
    if (storedArchivedCourses) {
      setArchivedCourses(JSON.parse(storedArchivedCourses));
    } else {
      setArchivedCourses([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('activeCourses', JSON.stringify(activeCourses));
    localStorage.setItem('archivedCourses', JSON.stringify(archivedCourses));
  }, [activeCourses, archivedCourses]);

  const handleArchiveToggle = (courseId: number, archive: boolean) => {
    if (archive) {
      const courseToArchive = activeCourses.find(course => course.id === courseId);
      if (courseToArchive) {
        setActiveCourses(activeCourses.filter(course => course.id !== courseId));
        setArchivedCourses([...archivedCourses, courseToArchive]);
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
        toast({
          title: "Course Unarchived",
          description: `${courseToUnarchive.title} has been moved back to active courses.`,
          duration: 3000,
        });
      }
    }
  };

  return {
    activeCourses,
    archivedCourses,
    handleArchiveToggle,
  };
}
