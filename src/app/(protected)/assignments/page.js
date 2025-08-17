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
  Info,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import AppDialog from "@/components/ui/AppDialog";
import api from "@/lib/api";
import { Check } from "lucide-react";

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
        className="min-w-full lg:min-w-4xl"
        bgColor="bg-gray-100 dark:bg-gray-800"
      >
        <div className="dark:text-white">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Play className="h-5 w-5 text-primary dark:text-primary-foreground" />
            Assignment Instructions Video
          </h3>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                selectedAssignment?.submissionDetails || ""
              )}?controls=0&modestbranding=1&autoplay=1&rel=0&showinfo=0&fs=0&iv_load_policy=3`}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>

          {/* Assignment Description */}
          <div className="p-4 bg-muted/30 dark:bg-gray-700/50 rounded-lg">
            <h4 className="font-bold mb-2">Assignment Description:</h4>
            <p className="text-muted-foreground dark:text-gray-300">
              {selectedAssignment?.description}
            </p>
          </div>

          {!isViewMode && (
            <>
              {/* Submission Form */}
              <div className="space-y-4 px-2 mt-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Upload className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Submit Your Video
                </h3>

                <div className="space-y-3 mb-4">
                  <label className="text-sm font-semibold dark:text-gray-300">
                    Choose Submission Method
                  </label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      size="sm"
                      onClick={() => setSubmissionType("youtube")}
                      className={`flex items-center gap-2 rounded-lg ${
                        submissionType === "youtube"
                          ? "bg-green-700 dark:bg-green-600 text-white"
                          : "border border-gray-300 dark:border-gray-600 dark:text-gray-300"
                      }`}
                    >
                      <Play className="h-4 w-4" />
                      YouTube
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setSubmissionType("facebook")}
                      className={`flex items-center gap-2 rounded-lg ${
                        submissionType === "facebook"
                          ? "bg-green-700 dark:bg-green-600 text-white"
                          : "border border-gray-300 dark:border-gray-600 dark:text-gray-300"
                      }`}
                    >
                      <Share2 className="h-4 w-4" />
                      Facebook Group
                    </Button>
                  </div>
                </div>
              </div>

              {submissionType === "youtube" && (
                <div className="space-y-3 px-2">
                  <label className="text-sm font-semibold dark:text-gray-300">
                    YouTube Video Link
                  </label>
                  <input
                    type="url"
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              )}

              {submissionType === "facebook" && (
                <div className="space-y-3 px-2">
                  <label className="text-sm font-semibold dark:text-gray-300">
                    Facebook Group Post Link
                  </label>
                  <input
                    type="url"
                    value={facebookPostLink}
                    onChange={(e) => setFacebookPostLink(e.target.value)}
                    placeholder="https://www.facebook.com/groups/your-group/posts/..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800 dark:text-blue-200">
                        <p className="font-semibold mb-1">
                          How to get Facebook post link:
                        </p>
                        <ol className="list-decimal list-inside space-y-1 text-xs">
                          <li>Post your video in the Facebook group</li>
                          <li>Click the three dots (...) on your post</li>
                          <li>Select &quot;Copy link&quot;</li>
                          <li>Paste the link here</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-8 px-2">
                <Button
                  onClick={submissionMutation.mutate}
                  disabled={
                    submissionType === "youtube"
                      ? !submissionUrl
                      : !facebookPostLink
                  }
                  className="bg-green-700 dark:bg-green-600 cursor-pointer hover:bg-green-600 dark:hover:bg-green-500 text-white rounded-lg"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {submissionMutation.isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Submit Assignment"
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg dark:text-white"
                  onClick={() => {
                    setSelectedAssignment(null);
                    setSubmissionUrl("");
                    setFacebookPostLink("");
                    setSubmissionType("youtube");
                    setIsSubmissionModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </AppDialog>

      <div className="space-y-6 p-6 dark:bg-gray-900">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-200/30 dark:bg-green-800/30 rounded-xl">
            <BookOpen className="h-6 w-6 text-primary dark:text-primary-foreground" />
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
          <CardContent>
            {assignmentsData.length > 0 ? (
              <div className="space-y-4">
                {assignmentsData.map((assignment) => (
                  <div
                    key={assignment._id}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      assignment.status === "submitted"
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-700"
                        : assignment.status === "overdue" ||
                          assignment.status === "not_submitted"
                        ? "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 border-red-200 dark:border-red-700"
                        : assignment.status === "pending" && !assignment.url
                        ? "bg-gradient-to-r from-blue-50 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-700"
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
                              : "bg-red-700 dark:bg-red-600"
                          }`}
                        >
                          {assignment.status === "submitted"
                            ? "Submitted"
                            : assignment.status === "pending"
                            ? "Pending"
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
                        {assignment.status === "pending" && !assignment.url && (
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsViewMode(true);
                            setSelectedAssignment(assignment);
                            setIsSubmissionModalOpen(true);
                          }}
                          className="hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer dark:text-white"
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
