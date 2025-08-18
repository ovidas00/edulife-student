"use client";

import {
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const Attendance = () => {
  const {
    data: attendanceData = {
      total: 0,
      Present: 0,
      Absent: 0,
      Late: 0,
      Excused: 0,
    },
  } = useQuery({
    queryKey: ["attendance"],
    queryFn: async () => {
      const response = await api.get("/student-attendance");
      return response.data.payload.summary;
    },
  });

  const attendanceRate =
    (100 / attendanceData.total) *
    (attendanceData.Present + attendanceData.Late);

  return (
    <div className="space-y-6 p-4 md:p-6 dark:bg-gray-900">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-200/30 dark:bg-green-800/30 rounded-xl">
          <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Attendance
        </h1>
      </div>

      <Card className="shadow-md border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white">
            <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
            Attendance Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 px-4 md:px-6">
          <div className="text-center p-6 bg-blue-50 rounded-xl dark:bg-blue-900/20">
            <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {attendanceRate || 0}%
            </div>
            <p className="text-gray-600 font-medium dark:text-gray-300">
              Overall Attendance
            </p>
          </div>

          {/* Improved Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-3 rounded-full relative transition-all duration-500 ease-out"
                style={{ width: `${attendanceRate || 0}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            {/* Present */}
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200 dark:bg-green-900/20 dark:border-green-800">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {attendanceData?.Present}
              </div>
              <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                Present
              </div>
            </div>

            {/* Excused */}
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
              <AlertCircle className="h-8 w-8 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                {attendanceData?.Excused}
              </div>
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Excused
              </div>
            </div>

            {/* Absent */}
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200 dark:bg-red-900/20 dark:border-red-800">
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {attendanceData?.Absent}
              </div>
              <div className="text-sm font-semibold text-red-600 dark:text-red-400">
                Absent
              </div>
            </div>

            {/* Late */}
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
              <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {attendanceData?.Late}
              </div>
              <div className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                Late
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
