"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ArrowRight } from "lucide-react";

const Courses = () => {
  // Course data
  const courses = [
    {
      id: 1,
      name: "Super Kids",
      description:
        "After School Program designed to enhance creativity and critical thinking skills for young learners",
    },
    {
      id: 2,
      name: "Smart Kids",
      description:
        "After School Program focused on developing problem-solving abilities and academic excellence",
    },
    {
      id: 3,
      name: "Soft Kids",
      description:
        "After School Program emphasizing social skills and emotional intelligence development",
    },
    {
      id: 4,
      name: "Basic Computer",
      description:
        "Computer Training covering fundamental digital literacy and essential software skills",
    },
    {
      id: 5,
      name: "Web Development",
      description:
        "Career Bootcamp teaching modern front-end and back-end web development technologies",
    },
    {
      id: 6,
      name: "Digital Marketing",
      description:
        "Career Bootcamp covering SEO, social media marketing, and digital advertising strategies",
    },
    {
      id: 7,
      name: "Nursery",
      description:
        "Edulife IT School program for early childhood education and development",
    },
    {
      id: 8,
      name: "Junior One",
      description:
        "Edulife IT School foundational program for young learners beginning their educational journey",
    },
    {
      id: 9,
      name: "Class One",
      description:
        "Edulife IT School elementary education program for first-grade level students",
    },
    {
      id: 10,
      name: "Class Two",
      description:
        "Edulife IT School elementary education program for second-grade level students",
    },
    {
      id: 11,
      name: "Class Three",
      description:
        "Edulife IT School elementary education program for third-grade level students",
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-200/30 dark:bg-blue-800/30 rounded-xl">
          <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-black text-card-foreground dark:text-white">
          Our Courses
        </h1>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Explore our comprehensive range of educational programs designed to meet
        diverse learning needs and help students achieve their academic goals.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="overflow-hidden border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 dark:bg-gray-800 group"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>

              <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {course.name}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {course.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Courses;
