"use client";

import { Home, BookOpen, Calendar, CreditCard, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";

const Index = () => {
  const { data: leaderboard = [] } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await api.get("/leaderboard");
      return response.data.payload.leaderboard;
    },
  });

  const { data: assignmentsData = [] } = useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      const response = await api.get("/student-assignments");
      return response.data.payload.assignments;
    },
  });

  const { data: billingData } = useQuery({
    queryKey: ["billing"],
    queryFn: async () => {
      const response = await api.get("/student-invoices");
      return response.data.payload;
    },
  });

  const { data: studentNextExam } = useQuery({
    queryKey: ["studentnextexam"],
    queryFn: async () => {
      const response = await api.get("/student-next-exam");
      return response.data.payload.nextExam;
    },
  });

  const studentId =
    typeof window !== "undefined" ? localStorage.getItem("studentId") : null;

  const myPosition = leaderboard?.findIndex((s) => s.studentId === studentId);
  const myRank = myPosition !== -1 ? myPosition + 1 : null;
  const notSubmittedCount = assignmentsData.reduce(
    (acc, assignment) => acc + (assignment.status === "not_submitted" ? 1 : 0),
    0
  );

  return (
    <div className="space-y-6 p-4 md:p-6 dark:bg-gray-900">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-200/30 dark:bg-green-800/30 rounded-xl">
          <Home className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-black text-card-foreground dark:text-white">
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-yellow-50 via-yellow-25 to-transparent border-yellow-200 shadow-lg dark:from-yellow-900/20 dark:via-yellow-900/10 dark:border-yellow-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-xl dark:bg-primary/30">
                <BookOpen className="h-6 w-6 text-primary dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium dark:text-gray-400">
                  New Assignments
                </p>
                <p className="text-3xl font-black text-primary dark:text-yellow-400">
                  {notSubmittedCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 via-blue-25 to-transparent border-blue-200 shadow-lg dark:from-blue-900/20 dark:via-blue-900/10 dark:border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary/20 rounded-xl dark:bg-secondary/30">
                <Calendar className="h-6 w-6 text-secondary dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium dark:text-gray-400">
                  Next Exam
                </p>
                <p className="text-lg font-black text-secondary dark:text-blue-400">
                  {studentNextExam
                    ? new Date(
                        studentNextExam?.examDateTime
                      ).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "--"}
                </p>
                {studentNextExam?.title && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {studentNextExam?.title}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 via-red-25 to-transparent border-red-200 shadow-lg dark:from-red-900/20 dark:via-red-900/10 dark:border-red-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-xl dark:bg-red-800">
                <CreditCard className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium dark:text-gray-400">
                  Due Payment
                </p>
                <p className="text-3xl font-black text-red-600 dark:text-red-400">
                  ৳
                  {new Intl.NumberFormat("en-US").format(
                    billingData?.totalDue ?? 0
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 via-green-25 to-transparent border-green-200 shadow-lg dark:from-green-900/20 dark:via-green-900/10 dark:border-green-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl dark:bg-green-800">
                <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium dark:text-gray-400">
                  Current Rank
                </p>
                <p className="text-3xl font-black text-green-600 dark:text-green-400">
                  #{myRank}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
