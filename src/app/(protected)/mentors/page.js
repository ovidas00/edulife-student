"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Mentors = () => {
  // Demo mentor data
  const mentors = [
    {
      id: 1,
      name: "Mr. Kollol Roy",
      role: "English Teacher",
      bio: "10+ years experience in advanced calculus and algebra",
      image:
        "https://www.edulifeitschool.com/assets/467473229_1136842197813790_8403178754721686042_n-removebg-preview-j541YkL0.png",
    },
    {
      id: 2,
      name: "Mr. Al Noman",
      role: "English Teacher",
      bio: "PhD in Quantum Mechanics with research background at CERN",
      image:
        "https://www.edulifeitschool.com/assets/462564319_1267897174411048_2389189078393509432_n-bQHTUx4V.jpg",
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
        <div className="p-3 bg-green-200/30 dark:bg-green-800/30 rounded-xl">
          <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-black text-card-foreground dark:text-white">
          Our Mentors
        </h1>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Meet our team of dedicated educators and subject matter experts who are
        committed to helping you achieve your academic goals. Each mentor brings
        unique expertise and teaching experience to provide personalized
        guidance.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <Card
            key={mentor.id}
            className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 group"
          >
            {/* Banner */}
            <div className="relative">
              <div className="h-40 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center">
                <div className="h-28 w-28 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center overflow-hidden ring-4 ring-white dark:ring-gray-800 transition-all duration-300 group-hover:ring-blue-400">
                  <Avatar className="h-full w-full">
                    <AvatarImage
                      src={mentor?.image || "/placeholder.svg"}
                      alt={mentor?.name}
                      className="rounded-full object-cover"
                    />
                    <AvatarFallback className="bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400">
                      <Users className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>

            {/* Content */}
            <CardContent className="p-5 text-center">
              <h3 className="font-bold text-xl text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {mentor.name}
              </h3>

              <div className="flex items-center justify-center gap-2 mt-2">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="px-2 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  {mentor.role}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm mt-3 line-clamp-3">
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
