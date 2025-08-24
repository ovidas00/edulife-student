"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Upload,
  Play,
  Trophy,
  FileText,
  Share2,
  Link,
  Loader2,
  Info,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import AppDialog from "@/components/ui/AppDialog";
import api from "@/lib/api";

function getYouTubeVideoId(url) {
  var regExp =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|\S+\?v=|(?:v|e(?:mbed)?)\/|\S+\/\S+\/)|youtu\.be\/)([\w-]{11})/;
  var match = url.match(regExp);
  return match ? match[1] : null;
}

const Assignments = () => {
  const queryClient = useQueryClient();
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submissionType, setSubmissionType] = useState("youtube");
  const [facebookPostLink, setFacebookPostLink] = useState("");
  const [isViewMode, setIsViewMode] = useState(false);

  const { data: assignmentsData = [] } = useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      const response = await api.get("/student-assignments");
      return response.data.payload.assignments;
    },
  });

  const assignmentsStats = assignmentsData.reduce(
    (acc, assignment) => {
      acc.totalAssignment += 1;

      switch (assignment.status) {
        case "pending":
          acc.pending += 1;
          break;
        case "submitted":
          acc.submitted += 1;
          break;
        case "not_submitted":
          acc.notSubmitted += 1;
          break;
        default:
          break;
      }

      return acc;
    },
    {
      totalAssignment: 0,
      pending: 0,
      submitted: 0,
      notSubmitted: 0,
    }
  );

  const getStatus = (status) => {
    switch (status) {
      case "standard":
        return "Standard";
      case "below_standard":
        return "Below Standard";
      case "impressive":
        return "Impressive";
      case "not_marked":
        return "Not Marked";
      default:
        return "No Mark";
    }
  };

  const submissionMutation = useMutation({
    mutationFn: () =>
      api.post(`student-assignments/submission/${selectedAssignment?._id}`, {
        url: submissionType === "youtube" ? submissionUrl : facebookPostLink,
      }),
    onSuccess: (response) => {
      setSelectedAssignment(null);
      setSubmissionUrl("");
      setFacebookPostLink("");
      setSubmissionType("youtube");
      setIsSubmissionModalOpen(false);
      toast.success(response.data.message);
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || error.message),
  });

  return (
    <>
      {/* Assignment submission modal */}
      <AppDialog
        open={isSubmissionModalOpen}
        setOpen={() => setIsSubmissionModalOpen(false)}
        title={`Submit Assignment: ${selectedAssignment?.title}`}
        className="w-full max-w-2xl" // Better width control
        bgColor="bg-white dark:bg-gray-800"
      >
        <div className="space-y-6 dark:text-white p-1">
          {/* Video Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary dark:text-primary-foreground">
              <Play className="h-5 w-5 flex-shrink-0" />
              <h3 className="text-lg font-semibold">
                Assignment Instructions Video
              </h3>
            </div>
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                  selectedAssignment?.submissionDetails || ""
                )}?controls=0&modestbranding=1&autoplay=1&rel=0&showinfo=0&fs=0&iv_load_policy=3`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>

          {/* Assignment Description */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Assignment Description
            </h4>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {selectedAssignment?.description}
            </p>
          </div>

          {!isViewMode && (
            <div className="space-y-6">
              {/* Submission Form */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Upload className="h-5 w-5 flex-shrink-0" />
                  <h3 className="text-lg font-semibold">Submit Your Video</h3>
                </div>

                {/* Submission Method Toggle */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Choose Submission Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSubmissionType("youtube")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                        submissionType === "youtube"
                          ? "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                    >
                      <Play className="h-4 w-4" />
                      <span className="text-sm font-medium">YouTube</span>
                    </button>
                    <button
                      onClick={() => setSubmissionType("facebook")}
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                        submissionType === "facebook"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Facebook</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* URL Input Section */}
              {submissionType === "youtube" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    YouTube Video Link
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      value={submissionUrl}
                      onChange={(e) => setSubmissionUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {submissionType === "facebook" && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Facebook Group Post Link
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Link className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      value={facebookPostLink}
                      onChange={(e) => setFacebookPostLink(e.target.value)}
                      placeholder="https://www.facebook.com/groups/your-group/posts/..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800 dark:text-blue-200">
                        <p className="font-medium mb-2">
                          How to get Facebook post link:
                        </p>
                        <ul className="space-y-1.5">
                          <li className="flex items-start gap-2">
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium">
                              1
                            </span>
                            <span>Post your video in the Facebook group</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium">
                              2
                            </span>
                            <span>Click the three dots (...) on your post</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium">
                              3
                            </span>
                            <span>Select &quot;Copy link&quot;</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium">
                              4
                            </span>
                            <span>Paste the link here</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <button
                  onClick={() => {
                    setSelectedAssignment(null);
                    setSubmissionUrl("");
                    setFacebookPostLink("");
                    setSubmissionType("youtube");
                    setIsSubmissionModalOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={submissionMutation.mutate}
                  disabled={
                    submissionType === "youtube"
                      ? !submissionUrl
                      : !facebookPostLink
                  }
                  className="flex items-center justify-center px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submissionMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Assignment
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </AppDialog>

      <div className="space-y-6 p-4 md:p-6 dark:bg-gray-900">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-200/30 dark:bg-green-800/30 rounded-xl">
            <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-black text-card-foreground dark:text-white">
            Assignments
          </h1>
        </div>

        {/* Assignment Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-700 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-blue-500 rounded-lg w-fit mx-auto mb-2">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {assignmentsStats.totalAssignment}
              </div>
              <div className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                Total Assignments
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border-yellow-200 dark:border-yellow-700 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-yellow-500 rounded-lg w-fit mx-auto mb-2">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-black text-yellow-600 dark:text-yellow-400">
                {assignmentsStats.pending}
              </div>
              <div className="text-sm font-semibold text-yellow-600 dark:text-yellow-300">
                Pending
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-700 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-green-500 rounded-lg w-fit mx-auto mb-2">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-black text-green-600 dark:text-green-400">
                {assignmentsStats.submitted}
              </div>
              <div className="text-sm font-semibold text-green-600 dark:text-green-300">
                Submitted
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 border-red-200 dark:border-red-700 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="p-2 bg-red-500 rounded-lg w-fit mx-auto mb-2">
                <XCircle className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-black text-red-600 dark:text-red-400">
                {assignmentsStats.notSubmitted}
              </div>
              <div className="text-sm font-semibold text-red-600 dark:text-red-300">
                Not Submitted
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignment List */}
        <Card className="shadow-lg border-border/50 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-black dark:text-white">
              <BookOpen className="h-6 w-6 text-green-700 dark:text-green-400" />
              Assignment List
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            {assignmentsData.length > 0 ? (
              <div className="space-y-4">
                {assignmentsData.map((assignment) => (
                  <div
                    key={assignment._id}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      assignment.status === "submitted"
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-700"
                        : assignment.status === "not_submitted"
                        ? "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 border-red-200 dark:border-red-700"
                        : assignment.status === "pending" && !assignment.url
                        ? "bg-gradient-to-r from-blue-50 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-700"
                        : assignment.status === "overdue"
                        ? "bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30 border-purple-200 dark:border-purple-700"
                        : "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border-yellow-200 dark:border-yellow-700"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-card-foreground dark:text-white mb-1">
                          {assignment.title}
                        </h3>
                        <p className="text-sm text-muted-foreground dark:text-gray-400 font-medium mb-2">
                          {assignment.subject}
                        </p>
                        <p className="text-sm text-muted-foreground dark:text-gray-400 line-clamp-2">
                          {assignment.description}
                        </p>
                      </div>
                      {assignment.status === "pending" && !assignment.url ? (
                        ""
                      ) : (
                        <div
                          className={`rounded-full shadow text-sm px-3 py-1 text-white font-semibold w-fit sm:w-auto ${
                            assignment.status === "submitted"
                              ? "bg-green-500 dark:bg-green-600"
                              : assignment.status === "pending"
                              ? "bg-yellow-500 dark:bg-yellow-600"
                              : assignment.status === "overdue"
                              ? "bg-purple-600 dark:bg-purple-700"
                              : "bg-red-700 dark:bg-red-600"
                          }`}
                        >
                          {assignment.status === "submitted"
                            ? "Submitted"
                            : assignment.status === "pending"
                            ? "Pending"
                            : assignment.status === "overdue"
                            ? "Overdue"
                            : "Not Submitted"}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground dark:text-gray-500 flex-shrink-0" />
                          <span className="font-medium dark:text-gray-300">
                            Due:{" "}
                            {new Date(assignment.dueDate).toLocaleString(
                              "en-US",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        {assignment.submittedDate && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <span className="font-medium text-green-600 dark:text-green-400">
                              Submitted: {assignment.submittedDate}
                            </span>
                          </div>
                        )}
                        {assignment.status === "submitted" && (
                          <div className="flex items-center gap-1">
                            <Trophy className="h-4 w-4 text-secondary dark:text-secondary-foreground flex-shrink-0" />
                            <span className="font-bold text-secondary dark:text-secondary-foreground">
                              {getStatus(assignment.mark)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 self-end sm:self-auto">
                        {assignment.status === "not_submitted" && (
                          <Button
                            size="sm"
                            className="bg-green-600 dark:bg-green-700 hover:bg-green-500 dark:hover:bg-green-600 text-white cursor-pointer"
                            onClick={() => {
                              setIsViewMode(false);
                              setSelectedAssignment(assignment);
                              setIsSubmissionModalOpen(true);
                            }}
                            disabled={!!assignment.url}
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            <span className="sr-only sm:not-sr-only">
                              Submit
                            </span>
                          </Button>
                        )}
                        {/* View button always available */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsViewMode(true);
                            setSelectedAssignment(assignment);
                            setIsSubmissionModalOpen(true);
                          }}
                          className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          <span className="sr-only sm:not-sr-only">View</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-muted-foreground dark:text-gray-400 mb-2">
                  No assignments found
                </h3>
                <p className="text-sm text-muted-foreground dark:text-gray-500">
                  Student hasn&apos;t received or submitted any assignments yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Assignments;
