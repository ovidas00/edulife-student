"use client";

import { Trophy, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import api from "@/lib/api";

const Rankings = () => {
  const { data: leaderboardData = [] } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await api.get("/leaderboard");
      return response.data.payload.leaderboard;
    },
  });

  return (
    <div className="space-y-6 p-4 md:p-6 dark:bg-gray-900">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-200/30 dark:bg-green-800/30 rounded-xl">
          <Trophy className="h-6 w-6 text-primary dark:text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-black text-card-foreground dark:text-white">
          Class Rankings
        </h1>
      </div>

      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-black">
            <Trophy className="h-6 w-6 text-green-700" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboardData.map((student, index) => (
              <div
                key={student.id || index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                  index < 3
                    ? index === 0
                      ? "bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 border-l-4 border-yellow-400"
                      : index === 1
                      ? "bg-gradient-to-r from-gray-50 via-gray-50 to-gray-50 border-l-4 border-gray-400"
                      : "bg-gradient-to-r from-amber-50 via-amber-50 to-amber-50 border-l-4 border-amber-400"
                    : "bg-white border-l-4 border-gray-200"
                }`}
              >
                {/* Rank Indicator */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0
                      ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-white shadow-md"
                      : index === 1
                      ? "bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow-md"
                      : index === 2
                      ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarImage
                      src={student.profilePicture || "/placeholder.svg"}
                      alt={student.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Student Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {student.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {student.session}
                  </p>
                </div>

                {/* Points */}
                <div className="flex-shrink-0 text-right ml-2">
                  <div
                    className={`text-xl font-bold ${
                      index < 3 ? "text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {student.totalPoints}
                  </div>
                  <div className="text-xs text-gray-400">pts</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rankings;
