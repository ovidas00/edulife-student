"use client";

import {
  Home,
  BookOpen,
  Calendar,
  CreditCard,
  CalendarCheck,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";

const Index = () => {
  const { data: attendanceData } = useQuery({
    queryKey: ["attendance"],
    queryFn: async () => {
      const response = await api.get("/student-attendance");
      return response.data.payload.summary;
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* New Assignments */}
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border-yellow-200 dark:border-yellow-700 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="p-2 bg-yellow-500 rounded-lg w-fit mx-auto mb-2">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-black text-yellow-600 dark:text-yellow-400">
              {notSubmittedCount}
            </div>
            <div className="text-sm font-semibold text-yellow-600 dark:text-yellow-300">
              New Assignments
            </div>
          </CardContent>
        </Card>

        {/* Next Exam */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-700 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="p-2 bg-blue-500 rounded-lg w-fit mx-auto mb-2">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="text-lg font-black text-blue-600 dark:text-blue-400">
              {studentNextExam
                ? new Date(studentNextExam?.examDateTime).toLocaleDateString(
                    "en-US",
                    { day: "2-digit", month: "short", year: "numeric" }
                  )
                : "--"}
            </div>
            {studentNextExam?.title && (
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                {studentNextExam.title}
              </div>
            )}
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-300">
              Next Exam
            </div>
          </CardContent>
        </Card>

        {/* Due Payment */}
        <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 border-red-200 dark:border-red-700 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="p-2 bg-red-500 rounded-lg w-fit mx-auto mb-2">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-black text-red-600 dark:text-red-400">
              ৳
              {new Intl.NumberFormat("en-US").format(
                billingData?.totalDue ?? 0
              )}
            </div>
            <div className="text-sm font-semibold text-red-600 dark:text-red-300">
              Due Payment
            </div>
          </CardContent>
        </Card>

        {/* Attendance Card */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-700 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="p-2 bg-green-500 rounded-lg w-fit mx-auto mb-2">
              <CalendarCheck className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-black text-green-600 dark:text-green-400">
              {(attendanceData?.Present ?? 0) + (attendanceData?.Late ?? 0)}/
              {attendanceData?.total ?? 0}
            </div>
            <div className="text-sm font-semibold text-green-600 dark:text-green-300">
              Attendance
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
