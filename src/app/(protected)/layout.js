"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
  Menu,
  Power,
  Moon,
  Home,
  Phone,
  MapPin,
  Clock,
  User,
  ChevronRight,
  CreditCard,
  BookOpen,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import "../globals.css";
import api from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, Trophy } from "lucide-react";

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isVerified, setIsVerified] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Token verification
  useEffect(() => {
    const token = localStorage.getItem("studentId");
    if (!token) {
      router.replace("/auth/login"); // redirect if missing
    } else {
      setIsVerified(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/auth/login");
  };

  const { data: student } = useQuery({
    queryKey: ["student"],
    queryFn: async () => {
      const response = await api.get("/student");
      return response.data.payload.student;
    },
  });

  const { data: leaderboard = [] } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await api.get("/leaderboard");
      return response.data.payload.leaderboard;
    },
  });

  const studentId =
    typeof window !== "undefined" ? localStorage.getItem("studentId") : null;

  const myPosition = leaderboard?.findIndex((s) => s.studentId === studentId);
  const myRank = myPosition !== -1 ? myPosition + 1 : null;

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setIsDrawerOpen(false);

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: BookOpen, label: "Assignments", href: "/assignments" },
    { icon: CreditCard, label: "Billing", href: "/billing" },
  ];

  // Only render dashboard if verified
  if (!isVerified) return null;

  return (
    <div className="relative h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      {/* Mobile overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden
  data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
  data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
  transition-all duration-300"
          onClick={closeDrawer}
        />
      )}

      <aside
        className={`
    h-full w-72 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-r border-gray-200 dark:border-gray-700
    flex flex-col
    fixed top-0 left-0 z-50 transform transition-all duration-300 ease-in-out
    lg:relative lg:transform-none lg:z-10
    ${
      isDrawerOpen
        ? "translate-x-0 shadow-xl"
        : "-translate-x-full lg:translate-x-0"
    }
  `}
      >
        {/* Profile Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md">
          <div className="flex flex-col items-center space-y-3">
            {/* Profile Avatar */}
            <div className="relative group">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 p-0.5 shadow-md group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
                <Avatar className="h-full w-full border-2 border-white dark:border-gray-800">
                  <AvatarImage
                    src={student?.profilePicture || "/placeholder.svg"}
                    alt={student?.name}
                    className="rounded-full object-cover"
                  />
                  <AvatarFallback className="bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400">
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
              {student?.isActive && (
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-white dark:border-gray-800 bg-green-500 flex items-center justify-center shadow-sm">
                  <CheckCircle className="h-3.5 w-3.5 text-white" />
                </div>
              )}
            </div>

            {/* Student Info */}
            <div className="text-center space-y-1">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                {student?.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {student?.batch} • {student?.session}
              </p>
            </div>

            {/* Current Rank */}
            <div className="w-full py-2 px-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Current Rank
                  </span>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
                  #{myRank}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <li key={index}>
                  <a
                    href={item.href}
                    className={`
                flex items-center space-x-3 py-2 px-3 rounded-xl
                ${
                  isActive
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-green-600 dark:hover:text-green-400"
                } 
                transition-all duration-300 group
              `}
                    onClick={() => {
                      if (
                        typeof window !== "undefined" &&
                        window.innerWidth < 1024
                      ) {
                        closeDrawer();
                      }
                    }}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isActive
                          ? "bg-white/20"
                          : "bg-gray-100 dark:bg-gray-700 group-hover:bg-green-100 dark:group-hover:bg-green-900/30"
                      }`}
                    >
                      <item.icon
                        size={20}
                        className={`
                    ${
                      isActive
                        ? "text-white"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400"
                    }
                  `}
                      />
                    </div>
                    <span className="font-medium">{item.label}</span>
                    <ChevronRight
                      size={16}
                      className={`
                  ml-auto
                  ${
                    isActive
                      ? "text-white opacity-100"
                      : "text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100"
                  } 
                  transition-all duration-300
                `}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-gradient-to-r from-green-800 to-green-700 dark:from-gray-800 dark:to-gray-900 border-b border-green-800 dark:border-gray-700 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDrawer}
                className="lg:hidden p-2 cursor-pointer rounded-full hover:bg-green-600 dark:hover:bg-gray-700 transition-colors"
              >
                <Menu size={20} className="text-gray-100 dark:text-gray-300" />
              </button>
              <div className="flex items-center space-x-3">
                <Image
                  src="/icon-500x150-yellow.png"
                  alt="Logo"
                  width={160}
                  height={120}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                className="p-2 bg-green-600 dark:bg-gray-700 cursor-pointer rounded-full hover:bg-green-500 dark:hover:bg-gray-700 transition-colors"
                title="Toggle Theme"
              >
                <Moon size={20} className="text-gray-100 dark:text-gray-300" />
              </button>
              <button
                className="p-2 bg-green-600 dark:bg-gray-700 cursor-pointer rounded-full hover:bg-green-500 dark:hover:bg-gray-700 transition-colors"
                title="Logout"
                onClick={handleLogout}
              >
                <Power size={20} className="text-gray-100 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">{children}</div>

          {/* Footer Content */}
          <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            <div className="p-8 space-y-8">
              <div className="text-center border-b border-slate-700 pb-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-12 flex-shrink-0 h-12 bg-green-700 rounded-xl flex items-center justify-center shadow-lg">
                    <Image
                      src="/logo-500x500-yellow.png"
                      alt="Logo"
                      className="p-2"
                      width={100}
                      height={100}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-3xl font-black text-yellow-500 text-left">
                      EDULIFE IT INSTITUTE
                    </h3>
                    <p className="text-slate-400 text-sm text-left font-medium">
                      Student Portal v1.0
                    </p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm md:text-md font-medium max-w-2xl mx-auto">
                  Nurturing young minds through innovative learning experiences
                  since 2015. Empowering students with cutting-edge technology
                  education and practical skills.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-6 rounded-xl border border-slate-600">
                  <h4 className="font-black text-xl mb-4 text-green-500/80 flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Information
                  </h4>
                  <div className="text-slate-300 space-y-1">
                    <a
                      href="tel:+8801519575226"
                      className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded-lg transition-colors group"
                    >
                      <span className="font-medium text-slate-300 group-hover:text-green-400 transition-colors">
                        +8801519575226
                      </span>
                    </a>
                    <a
                      href="mailto:edulifetraining@gmail.com"
                      className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded-lg transition-colors group"
                    >
                      <span className="font-medium text-slate-300 group-hover:text-green-400 transition-colors">
                        edulifetraining@gmail.com
                      </span>
                    </a>
                    <a
                      href="https://www.edulifeuniversity.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded-lg transition-colors group"
                    >
                      <span className="font-medium text-slate-300 group-hover:text-green-400 transition-colors">
                        www.edulifeuniversity.com
                      </span>
                    </a>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-6 rounded-xl border border-slate-600">
                  <h4 className="font-black text-xl mb-4 text-secondary flex items-center gap-2 text-green-500/80">
                    <MapPin className="h-5 w-5" />
                    Our Location
                  </h4>
                  <div className="text-slate-300 space-y-2">
                    <p className="font-medium">
                      Shantinagar (Adjacent to BRAC Office)
                    </p>
                    <p className="font-medium">Khagrachari, Chittagong</p>
                    <p className="font-medium">Bangladesh</p>
                    <div className="mt-3 p-2 bg-slate-700/50 rounded-lg">
                      <p className="text-sm font-bold text-primary">
                        Postal Code: 4400
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-6 rounded-xl border border-slate-600">
                  <h4 className="font-black text-xl mb-4 text-accent flex items-center gap-2 text-green-500/80">
                    <Clock className="h-5 w-5" />
                    Office Hours
                  </h4>
                  <div className="text-slate-300 space-y-3">
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="font-bold text-green-400">
                        Saturday - Thursday
                      </p>
                      <p className="text-sm">9:00 AM - 5:00 PM</p>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="font-bold text-green-400">Friday</p>
                      <p className="text-sm">9:00 AM - 12:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-700 text-center">
                <div className="text-center">
                  <p className="text-slate-400 font-medium text-sm">
                    © {new Date().getFullYear()} Edulife IT Institute. All
                    rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
