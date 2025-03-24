
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Archive } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const activeCourses = [
  {
    id: 1,
    title: "Foundations of Cryptography",
    description: "Learn the basic paradigm and principles of modern cryptography",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Network Science for Web",
    description: "Network science is a multidisciplinary field",
    image: "/placeholder.svg",
  },
];

const archivedCourses = [
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

export default function Courses() {
  const navigate = useNavigate();
  const [courseView, setCourseView] = useState("active");

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hello, Learner</h1>
            <p className="text-sm text-gray-600">Continue your learning journey</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <span className="sr-only">User menu</span>
            <div className="w-8 h-8 rounded-full bg-secondary text-white grid place-items-center">
              J
            </div>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 animate-fade-up">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Courses</h2>
            <div className="flex items-center gap-4">
              <Tabs value={courseView} onValueChange={setCourseView} className="w-full">
                <TabsList className="grid w-[200px] grid-cols-2">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="archived">Archived</TabsTrigger>
                </TabsList>

                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <TabsContent value="active" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeCourses.map((course) => (
                      <Card key={course.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                        </CardHeader>
                        <CardContent>
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                          <CardDescription>{course.description}</CardDescription>
                          <div className="flex justify-between mt-4">
                            <Button
                              className="w-5/6 bg-secondary hover:bg-secondary/90"
                              onClick={() => navigate(`/course/${course.id}`)}
                            >
                              Continue Learning
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              title="Archive Course"
                              className="border-gray-200"
                            >
                              <Archive className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="archived" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {archivedCourses.map((course) => (
                      <Card key={course.id} className="hover:shadow-lg transition-shadow bg-gray-50/50">
                        <CardHeader>
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-48 object-cover rounded-t-lg opacity-80"
                          />
                        </CardHeader>
                        <CardContent>
                          <CardTitle className="text-lg text-gray-700">{course.title}</CardTitle>
                          <CardDescription className="text-gray-600">{course.description}</CardDescription>
                          <div className="flex justify-between mt-4">
                            <Button
                              variant="outline"
                              className="w-5/6"
                              onClick={() => navigate(`/course/${course.id}`)}
                            >
                              View Course
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              title="Unarchive Course"
                              className="border-gray-200"
                            >
                              <Archive className="h-4 w-4 text-secondary" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        <section className="animate-fade-up animation-delay-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recommended Courses</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    View Course
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
