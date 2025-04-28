import { useState, useEffect } from "react";
import { Course } from "@/types/course-types";

const fallbackCoursesData = [
  {
    id: 1,
    title: "Foundations of Cryptography",
    description: "Learn the basic paradigm and principles of modern cryptography",
    image: "/placeholder.svg",
    schoolCode: "TECH101",
    createdAt: "2024-03-28T10:00:00Z",
    createdBy: {
      fullName: "Dr. Alice Smith",
      email: "alice.smith@school.edu"
    },
    totalStudents: 45,
  },
  {
    id: 2,
    title: "Network Science for Web",
    description: "Network science is a multidisciplinary field",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Machine Learning Basics",
    description: "Introduction to machine learning algorithms and applications",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    title: "Web Development Fundamentals",
    description: "Learn HTML, CSS, and JavaScript for modern web development",
    image: "/placeholder.svg",
  },
];

export function useCourseData(courseId: string) {
  const [courseData, setCourseData] = useState<Course | null>(null);

  useEffect(() => {
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
      allCourses = fallbackCoursesData;
    }

    const foundCourse = allCourses.find(course => course.id === Number(courseId));
    if (foundCourse) {
      setCourseData(foundCourse);
      document.title = `Course: ${foundCourse.title}`;
    }
  }, [courseId]);

  return courseData;
}
