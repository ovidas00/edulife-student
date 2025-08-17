"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Info } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle } from "lucide-react";
import api from "@/lib/api";
import AppDialog from "@/components/ui/AppDialog";

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [students, setStudents] = useState([]);

  const loginMutation = useMutation({
    mutationFn: () => api.post("/verify-student", { phone: phoneNumber }),
    onSuccess: (response) => {
      localStorage.clear();
      const payload = response.data.payload;
      setStudents(payload.students);
      if (payload.students.length > 1) {
        setIsSelectionModalOpen(true);
      } else {
        toast.success(response.data?.message || "Success");
        localStorage.setItem("studentId", payload.students[0]._id);
        router.replace("/");
      }
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || error.message),
  });

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <>
      {/* Use AppDialog */}
      <AppDialog
        open={isSelectionModalOpen}
        setOpen={() => setIsSelectionModalOpen(false)}
        title="Choose Student"
      >
        {students.map((student, i) => (
          <div
            key={i}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-t border-gray-200 dark:border-gray-700 flex-shrink-0"
            onClick={() => {
              localStorage.setItem("studentId", student._id);
              toast.success("Student verification successful");
              router.replace("/");
            }}
          >
            <div className="flex items-center space-x-3 py-1">
              {/* New Profile Picture with Avatar */}
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 p-0.5">
                  <Avatar className="h-full w-full">
                    <AvatarImage
                      src={student?.profilePicture || "/placeholder.svg"}
                      alt={student?.name}
                      className="rounded-full"
                    />
                    <AvatarFallback className="bg-white text-blue-600 font-bold">
                      {student?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {student?.isActive && (
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white bg-green-400 flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>

              {/* Name and Phone */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {student?.name ?? ""}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {student?.phone ?? ""}
                </p>
              </div>
            </div>
          </div>
        ))}
      </AppDialog>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            {/* Logo Section */}
            <div className="text-center mb-8">
              <img
                src="/icon-300x100.png"
                alt="Logo"
                className="h-15 mx-auto mb-2"
              />
              <p className="text-gray-500 dark:text-gray-400 text-sm font-light">
                Nurturing young minds through innovative learning experiences
                since 2015
              </p>
            </div>

            <form method="post" onSubmit={handleSubmit}>
              {/* Phone Input Section */}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      pattern="[0-9]{11}"
                      placeholder="01XXXXXXXXX"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>
                </div>
                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium text-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </form>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="font-light">
                  To continue, please enter the phone number you registered with
                  during admission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
