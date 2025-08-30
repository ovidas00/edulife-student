"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  CreditCard,
  CalendarCheck,
  GraduationCap,
  BookOpen,
  Pencil,
  School,
  Bell,
  Receipt,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";

const Index = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { data: student } = useQuery({
    queryKey: ["student"],
    queryFn: async () => {
      const response = await api.get("/student");
      return response.data.payload.student;
    },
  });

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

  const { data: notice } = useQuery({
    queryKey: ["notice"],
    queryFn: async () => {
      const response = await api.get("/notice");
      return response.data.payload.notice;
    },
  });

  const { data: paymentHistory = [] } = useQuery({
    queryKey: ["paymentHistory"],
    queryFn: async () => {
      const response = await api.get("/payment-history");
      return response.data.payload.histories || [];
    },
  });

  const notSubmittedCount = assignmentsData.reduce(
    (acc, assignment) => acc + (assignment.status === "not_submitted" ? 1 : 0),
    0
  );

  return (
    <div className="space-y-6 p-4 md:p-6 dark:bg-gray-900">
      <div className="relative w-full h-[200px] rounded-2xl overflow-hidden bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg flex items-center justify-between px-6 md:px-12">
        {/* Background Icons */}
        <BookOpen className="absolute top-4 left-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white/10 rotate-12" />
        <GraduationCap className="absolute bottom-4 left-1/4 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-white/10 -rotate-12" />
        <Pencil className="absolute top-2 right-1/4 w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white/10" />
        <School className="absolute bottom-4 right-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white/10" />
        {/* Left Content */}
        <div className="relative flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold drop-shadow-md">
            {(() => {
              const hour = dateTime.getHours();
              let greeting;
              if (hour < 12) {
                greeting = "Good Morning";
              } else if (hour < 17) {
                greeting = "Good Afternoon";
              } else {
                greeting = "Good Evening";
              }

              return `${greeting}, ${student?.name?.split(" ")[0] || ""}!`;
            })()}
          </h1>
          <p className="text-sm md:text-base font-medium opacity-90">
            {dateTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-lg md:text-xl font-semibold">
            {dateTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Right Side Decorative Text */}
        <div className="relative hidden sm:flex flex-col items-end text-right">
          <p className="text-5xl md:text-6xl font-extrabold opacity-20 leading-none">
            STUDENT
          </p>
          <p className="text-4xl md:text-5xl font-extrabold opacity-20 -mt-2 leading-none">
            DASHBOARD
          </p>
        </div>
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
              <div className="text-xs text-blue-700 dark:text-blue-400 mt-1">
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
            <div className="text-xs text-green-700 dark:text-green-400 mt-1">
              {attendanceData?.total
                ? Math.round(
                    (((attendanceData?.Present ?? 0) +
                      (attendanceData?.Late ?? 0)) /
                      attendanceData.total) *
                      100
                  )
                : 0}
              % attendance rate
            </div>
            <div className="text-sm font-semibold text-green-600 dark:text-green-300">
              Attendance
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Section: Notices and Payment History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notices Column */}
        <Card className="dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-0">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold dark:text-white">
              <Bell className="h-5 w-5 text-blue-500" />
              Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-0">
            {notice ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                  <h3 className="font-bold text-lg mb-2 dark:text-white">
                    {notice.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {notice.content}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(notice.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No notices available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Payment History Column */}
        <Card className="dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-0">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold dark:text-white">
              <Receipt className="h-5 w-5 text-green-500" />
              Latest Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-0">
            {paymentHistory.length > 0 ? (
              <div className="space-y-4">
                {paymentHistory.slice(0, 5).map((payment) => (
                  <div
                    key={payment._id}
                    className="p-3 bg-green-50 rounded-lg dark:bg-green-900/20 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold dark:text-white">
                        ৳{payment.amount}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {payment.method}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(payment.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No payment history available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
