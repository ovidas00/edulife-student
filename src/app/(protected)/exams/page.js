"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  XCircle,
  Calendar,
  Award,
  Percent,
  FileText,
  Clock,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import AppDialog from "@/components/ui/AppDialog";
import api from "@/lib/api";
import { Book } from "lucide-react";

const ExamResults = () => {
  const [selectedExam, setSelectedExam] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: examsData = [] } = useQuery({
    queryKey: ["exam-results"],
    queryFn: async () => {
      const response = await api.get("/student-exams");
      return response.data.payload.exams;
    },
  });

  // Calculate exam statistics
  const examsStats = examsData.reduce(
    (acc, exam) => {
      acc.totalExams += 1;
      acc.totalPossibleMarks += exam.totalMarks;
      acc.totalObtainedMarks += exam.studentMark || 0;

      const percentage = (exam.studentMark / exam.totalMarks) * 100;

      if (percentage >= 80) {
        acc.excellent += 1;
      } else if (percentage >= 60) {
        acc.good += 1;
      } else if (percentage >= 40) {
        acc.average += 1;
      } else {
        acc.poor += 1;
      }

      return acc;
    },
    {
      totalExams: 0,
      totalPossibleMarks: 0,
      totalObtainedMarks: 0,
      excellent: 0,
      good: 0,
      average: 0,
      poor: 0,
    }
  );

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return "text-green-600 dark:text-green-400";
    if (percentage >= 60) return "text-blue-600 dark:text-blue-400";
    if (percentage >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getPerformanceLabel = (percentage) => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Average";
    return "Needs Improvement";
  };

  return (
    <>
      {/* Exam Details Dialog */}
      <AppDialog
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        title={selectedExam?.title || "Exam Details"}
        className="w-full max-w-xl"
        bgColor="bg-white dark:bg-gray-800"
      >
        <p className="text-sm text-gray-800 dark:text-gray-400 mb-1 px-4 py-1">
          {selectedExam?.description}
        </p>

        {selectedExam && (
          <div className="space-y-6 dark:text-white p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Total Marks
                </h4>
                <p className="text-2xl font-bold dark:text-white">
                  {selectedExam.totalMarks}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Your Score
                </h4>
                <p className="text-2xl font-bold dark:text-white">
                  {selectedExam.studentMark || "Not graded yet"}
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Performance
              </h4>
              {selectedExam.studentMark ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="h-5 w-5" />
                    <span
                      className={`text-xl font-bold ${getPerformanceColor(
                        (selectedExam.studentMark / selectedExam.totalMarks) *
                          100
                      )}`}
                    >
                      {(
                        (selectedExam.studentMark / selectedExam.totalMarks) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                    <span
                      className={`text-sm font-medium ${getPerformanceColor(
                        (selectedExam.studentMark / selectedExam.totalMarks) *
                          100
                      )}`}
                    >
                      (
                      {getPerformanceLabel(
                        (selectedExam.studentMark / selectedExam.totalMarks) *
                          100
                      )}
                      )
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                    <div
                      className={`h-2.5 rounded-full ${
                        (selectedExam.studentMark / selectedExam.totalMarks) *
                          100 >=
                        80
                          ? "bg-green-600"
                          : (selectedExam.studentMark /
                              selectedExam.totalMarks) *
                              100 >=
                            60
                          ? "bg-blue-600"
                          : (selectedExam.studentMark /
                              selectedExam.totalMarks) *
                              100 >=
                            40
                          ? "bg-yellow-500"
                          : "bg-red-600"
                      }`}
                      style={{
                        width: `${
                          (selectedExam.studentMark / selectedExam.totalMarks) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  Not graded yet
                </p>
              )}
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Exam Date
              </h4>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="dark:text-white">
                  {new Date(selectedExam.examDateTime).toLocaleString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setIsDialogOpen(false)}
                className="bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </AppDialog>

      <div className="space-y-6 p-4 md:p-6 dark:bg-gray-900">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-200/30 dark:bg-green-800/30 rounded-xl">
            <Book className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-black text-card-foreground dark:text-white">
            Exam Results
          </h1>
        </div>

        {/* Exam Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-700 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-blue-500 rounded-lg w-fit mx-auto mb-2">
                <ClipboardList className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {examsStats.totalExams}
              </div>
              <div className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                Total Exams
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-700 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-green-500 rounded-lg w-fit mx-auto mb-2">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-black text-green-600 dark:text-green-400">
                {examsStats.excellent + examsStats.good}
              </div>
              <div className="text-sm font-semibold text-green-600 dark:text-green-300">
                Good & Excellent
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border-yellow-200 dark:border-yellow-700 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-yellow-500 rounded-lg w-fit mx-auto mb-2">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-black text-yellow-600 dark:text-yellow-400">
                {examsStats.average}
              </div>
              <div className="text-sm font-semibold text-yellow-600 dark:text-yellow-300">
                Average
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 border-red-200 dark:border-red-700 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-red-500 rounded-lg w-fit mx-auto mb-2">
                <XCircle className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-black text-red-600 dark:text-red-400">
                {examsStats.poor}
              </div>
              <div className="text-sm font-semibold text-red-600 dark:text-red-300">
                Needs Improvement
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Performance Card */}
        {examsStats.totalExams > 0 && (
          <Card className="shadow-lg border-border/50 border-gray-200 dark:border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-black dark:text-white">
                <Percent className="h-6 w-6 text-green-600 dark:text-green-400" />
                Overall Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg dark:text-white">
                    Marks Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground dark:text-gray-400">
                        Total Marks Obtained
                      </span>
                      <span className="font-medium dark:text-white">
                        {examsStats.totalObtainedMarks}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground dark:text-gray-400">
                        Total Possible Marks
                      </span>
                      <span className="font-medium dark:text-white">
                        {examsStats.totalPossibleMarks}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground dark:text-gray-400">
                        Overall Percentage
                      </span>
                      <span
                        className={`font-bold ${getPerformanceColor(
                          (examsStats.totalObtainedMarks /
                            examsStats.totalPossibleMarks) *
                            100
                        )}`}
                      >
                        {(
                          (examsStats.totalObtainedMarks /
                            examsStats.totalPossibleMarks) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg dark:text-white">
                    Performance Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">Excellent (80%+)</span>
                      </div>
                      <span className="font-medium">
                        {examsStats.excellent}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Good (60-79%)</span>
                      </div>
                      <span className="font-medium">{examsStats.good}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm">Average (40-59%)</span>
                      </div>
                      <span className="font-medium">{examsStats.average}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm">
                          Needs Improvement (Below 40%)
                        </span>
                      </div>
                      <span className="font-medium">{examsStats.poor}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exam List */}
        <Card className="shadow-lg border-border/50 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-black dark:text-white">
              <ClipboardList className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Exam Results
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            {examsData.length > 0 ? (
              <div className="space-y-4">
                {examsData.map((exam) => {
                  const percentage = exam.studentMark
                    ? (exam.studentMark / exam.totalMarks) * 100
                    : 0;
                  return (
                    <div
                      key={exam._id}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        percentage >= 80
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-700"
                          : percentage >= 60
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-700"
                          : percentage >= 40
                          ? "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border-yellow-200 dark:border-yellow-700"
                          : "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 border-red-200 dark:border-red-700"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-card-foreground dark:text-white mb-1">
                            {exam.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground dark:text-gray-500" />
                              <span className="text-muted-foreground dark:text-gray-400">
                                {new Date(
                                  exam.examDateTime
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            {exam.studentMark && (
                              <div className="flex items-center gap-1">
                                <Award className="h-4 w-4 text-muted-foreground dark:text-gray-500" />
                                <span className="text-muted-foreground dark:text-gray-400">
                                  {exam.studentMark}/{exam.totalMarks} marks
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div
                          className={`rounded-full shadow text-sm px-3 py-1 text-white font-semibold w-fit sm:w-auto ${
                            percentage >= 80
                              ? "bg-green-500 dark:bg-green-600"
                              : percentage >= 60
                              ? "bg-blue-500 dark:bg-blue-600"
                              : percentage >= 40
                              ? "bg-yellow-500 dark:bg-yellow-600"
                              : "bg-red-500 dark:bg-red-600"
                          }`}
                        >
                          {exam.studentMark
                            ? `${percentage.toFixed(1)}% (${getPerformanceLabel(
                                percentage
                              )})`
                            : "Results Pending"}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                          <div
                            className={`h-2.5 rounded-full ${
                              percentage >= 80
                                ? "bg-green-600"
                                : percentage >= 60
                                ? "bg-blue-600"
                                : percentage >= 40
                                ? "bg-yellow-500"
                                : "bg-red-600"
                            }`}
                            style={{
                              width: `${exam.studentMark ? percentage : 0}%`,
                            }}
                          ></div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedExam(exam);
                            setIsDialogOpen(true);
                          }}
                          className="
    ml-4 
    text-gray-800 dark:text-gray-100
    bg-white dark:bg-gray-800
    border border-gray-300 dark:border-gray-600
    hover:bg-gray-200 dark:hover:bg-gray-700
    cursor-pointer
    transition-colors
  "
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-muted-foreground dark:text-gray-400 mb-2">
                  No exam results found
                </h3>
                <p className="text-sm text-muted-foreground dark:text-gray-500">
                  Student hasn&apos;t taken any exams yet or results are not
                  available
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ExamResults;
