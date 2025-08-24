"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Phone } from "lucide-react";

const Mentors = () => {
  // Demo mentor data
  const mentors = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Mathematics Specialist",
      bio: "10+ years experience in advanced calculus and algebra",
      image: "https://my.edulifeagency.com/uploads/0bd9c62b8577b0ee1fe4281d8cc3b81d.jpg",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Physics Professor",
      bio: "PhD in Quantum Mechanics with research background at CERN",
      image: "/api/placeholder/200/200",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Literature Expert",
      bio: "Specialized in classic and contemporary literature analysis",
      image: "/api/placeholder/200/200",
    },
    {
      id: 4,
      name: "David Kim",
      role: "Computer Science Mentor",
      bio: "Software engineer with industry experience at top tech companies",
      image: "/api/placeholder/200/200",
    },
    {
      id: 5,
      name: "Priya Patel",
      role: "Biology Researcher",
      bio: "Molecular biology expert with published research papers",
      image: "/api/placeholder/200/200",
    },
    {
      id: 6,
      name: "James Wilson",
      role: "History Scholar",
      bio: "Ancient civilizations specialist with archaeological field experience",
      image: "/api/placeholder/200/200",
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-200/30 dark:bg-blue-800/30 rounded-xl">
          <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-black text-card-foreground dark:text-white">
          Our Mentors
        </h1>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-3xl">
        Meet our team of dedicated educators and subject matter experts who are
        committed to helping you achieve your academic goals. Each mentor brings
        unique expertise and teaching experience to provide personalized
        guidance.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <Card
            key={mentor.id}
            className="overflow-hidden border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 dark:bg-gray-800"
          >
            <div className="relative">
              <div className="h-48 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center">
                <div className="h-24 w-24 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  <Users className="h-12 w-12 text-blue-500 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <CardContent className="p-5 pb-0">
              <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-1">
                {mentor.name}
              </h3>

              <div className="flex items-center gap-1 mb-3">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                  {mentor.role}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {mentor.bio}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Mentors;
