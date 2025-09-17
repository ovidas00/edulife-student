"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  User,
  Play,
  Clock,
  Users,
  Layers,
  BookMarked,
  Star,
  Calendar,
} from "lucide-react";
import api from "@/lib/api";

const Books = () => {
  const { data: booksData = [] } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const response = await api.get("/student-books");
      return response.data.payload.books;
    },
  });

  const handleStartReading = (bookId) => {
    console.log(`Starting reading book with ID: ${bookId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
      case "Draft":
        return "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
      default:
        return "bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 dark:bg-gray-900">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-200/30 dark:bg-green-800/30 rounded-xl">
            <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Books
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {booksData.map((book) => (
          <div
            key={book._id}
            className="relative overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-lg flex flex-col h-full rounded-2xl"
          >
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 dark:from-indigo-900/30 via-transparent to-indigo-500/5 dark:to-purple-900/30 rounded-2xl"></div>

            {/* Image / Placeholder */}
            <div className="relative h-56 overflow-hidden rounded-t-2xl">
              {book.coverImage ? (
                <>
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 dark:from-black/60 via-black/10 dark:via-black/20 to-transparent"></div>
                </>
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-blue-400 dark:text-blue-300" />
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${getStatusColor(
                    book.status
                  )}`}
                >
                  {book.status}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 flex flex-col flex-grow relative z-10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {book.title}
              </h3>

              {book.author && (
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {book.author}
                  </p>
                </div>
              )}

              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                {book.description ||
                  "Embark on an exciting learning adventure with comprehensive modules and engaging content."}
              </p>

              {/* Info Boxes */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  {
                    label: "Modules",
                    value: book.totalModules,
                    icon: (
                      <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    ),
                    bg: "bg-blue-50 dark:bg-blue-900/30",
                  },
                  {
                    label: "Lessons",
                    value: book.totalLessons,
                    icon: (
                      <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    ),
                    bg: "bg-emerald-50 dark:bg-emerald-900/30",
                  },
                  {
                    label: "Batches",
                    value: book.totalBatches,
                    icon: (
                      <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    ),
                    bg: "bg-purple-50 dark:bg-purple-900/30",
                  },
                  {
                    label: "Students",
                    value: book.totalStudents,
                    icon: (
                      <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    ),
                    bg: "bg-amber-50 dark:bg-amber-900/30",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${item.bg}`}
                  >
                    {item.icon}
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.label}
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleStartReading(book._id)}
                className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg flex items-center justify-center gap-2 py-3 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                <Play className="h-4 w-4" />
                Start Reading
              </button>
            </div>
          </div>
        ))}
      </div>

      {booksData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="p-8 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-3xl mb-6">
            <BookOpen className="h-16 w-16 text-blue-400 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Books Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
            Your library is empty. Check back later for new books and learning
            materials.
          </p>
        </div>
      )}
    </div>
  );
};

export default Books;
