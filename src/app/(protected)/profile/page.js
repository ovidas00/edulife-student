"use client";

import { useEffect, useState } from "react";
import {
  User,
  Upload,
  CheckCircle,
  GraduationCap,
  Calendar,
  CreditCard,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { readAndCompressImage } from "browser-image-resizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import toast from "react-hot-toast";

const Profile = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "",
    address: "",
  });

  const { data: student } = useQuery({
    queryKey: ["student"],
    queryFn: async () => {
      const response = await api.get("/student");
      return response.data.payload.student;
    },
  });

  const profilePicMutation = useMutation({
    mutationFn: (formData) => api.put("/student/picture", formData),
    onSuccess: (response) => {
      toast.success(response.data.message);
      queryClient.invalidateQueries({ queryKey: ["student"] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || error.message),
  });

  const profileInfoMutation = useMutation({
    mutationFn: () => api.put("/student", formData),
    onSuccess: (response) => {
      toast.success(response.data.message);
      queryClient.invalidateQueries({ queryKey: ["student"] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.message || error.message),
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const config = {
          quality: 0.7,
          maxWidth: 150,
          maxHeight: 150,
          mimeType: "image/jpeg",
        };

        const resizedImage = await readAndCompressImage(file, config);
        const formData = new FormData();
        formData.append("profilePicture", resizedImage);
        profilePicMutation.mutate(formData);
      } catch (error) {
        console.error("Error resizing image:", error);
      }
    }
  };

  useEffect(() => {
    setFormData({
      dateOfBirth: student?.dateOfBirth ?? "",
      gender: student?.gender ?? "",
      address: student?.address ?? "",
    });
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    profileInfoMutation.mutate();
  };

  return (
    <div className="space-y-6 p-4 md:p-6 dark:bg-gray-900">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-200/30 dark:bg-green-800/30 rounded-xl">
          <User className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-black text-card-foreground dark:text-white">
          Profile Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Photo Section */}
        <Card className="shadow-lg border-gray-200/50 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-black dark:text-white">
              Profile Photo
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="h-32 w-32 mx-auto rounded-full bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-700/30 dark:to-purple-700/30 p-0.5 shadow-md group-hover:from-blue-300 group-hover:to-purple-300 dark:group-hover:from-blue-600/40 dark:group-hover:to-purple-600/40 transition-all duration-300">
              <Avatar className="h-full w-full border-2 border-white dark:border-gray-800">
                <AvatarImage
                  src={student?.profilePicture || "/placeholder.svg"}
                  alt={student?.name || "Profile Picture"}
                  className="rounded-full object-cover"
                />
                <AvatarFallback className="bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="text-xl font-black dark:text-white">
                {student?.name}
              </h3>
              <p className="text-muted-foreground dark:text-gray-400">
                {student?.batch} • {student?.session}
              </p>
            </div>
            <label className="cursor-pointer">
              <span className="text-sm font-medium flex bg-green-600 p-2 rounded-lg justify-center text-white">
                {profilePicMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Change Photo
                  </>
                )}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2 shadow-lg border-gray-200/50 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-black flex items-center gap-2 dark:text-white">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground dark:text-gray-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={student?.name || ""}
                    readOnly
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-muted/30 dark:bg-gray-800/50 text-muted-foreground dark:text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground dark:text-gray-500">
                    Contact admin to change your name
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground dark:text-gray-400">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                    max={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground dark:text-gray-400">
                    Gender
                  </label>
                  <select
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground dark:text-gray-400">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue={student?.phone || ""}
                    readOnly
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-muted/30 dark:bg-gray-800/50 text-muted-foreground dark:text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground dark:text-gray-500">
                    Phone number cannot be changed
                  </p>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-muted-foreground dark:text-gray-400">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    rows={3}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none dark:bg-gray-800 dark:text-white"
                    placeholder="Enter your full address..."
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Academic Information */}
      <Card className="shadow-lg border-gray-200/50 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-black flex items-center gap-2 dark:text-white">
            <GraduationCap className="h-5 w-5 text-secondary" />
            Academic & Financial Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-xl border border-primary/20 dark:border-primary/30 from-cyan-50 to-cyan-25 dark:from-cyan-900/20 dark:to-cyan-800/10 border-cyan-200 dark:border-cyan-700/30">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-cyan-600" />
                <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">
                  Admission Date
                </span>
              </div>
              <p className="font-bold dark:text-white">
                {new Date(student?.admissionDate).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 dark:from-secondary/20 dark:to-secondary/10 rounded-xl border from-violet-50 to-violet-25 dark:from-violet-900/20 dark:to-violet-800/10 border-violet-200 dark:border-violet-700/30">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-violet-600" />
                <span className="text-sm font-bold text-violet-600 dark:text-violet-400">
                  Monthly Fee
                </span>
              </div>
              <p className="font-bold dark:text-white">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "BDT",
                }).format(student?.monthlyFee ?? 0)}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-green-25 dark:from-green-900/20 dark:to-green-800/10 rounded-xl border border-green-200 dark:border-green-700/30">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                  Parent/Guardian
                </span>
              </div>
              <p className="font-bold dark:text-white">{student?.parentName}</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-25 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl border border-blue-200 dark:border-blue-700/30">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  Billing Start
                </span>
              </div>
              <p className="font-bold dark:text-white">
                {new Date(student?.billingStartMonth).toLocaleDateString(
                  "en-US",
                  { month: "long", year: "numeric" }
                )}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-25 dark:from-yellow-900/20 dark:to-yellow-800/10 rounded-xl border border-yellow-200 dark:border-yellow-700/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                  Fee Discount
                </span>
              </div>
              <p className="font-bold dark:text-white">
                {student?.feeDiscount}%
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-25 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl border border-purple-200 dark:border-purple-700/30">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  Last Updated
                </span>
              </div>
              <p className="font-bold dark:text-white">
                {new Date(student?.updatedAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
