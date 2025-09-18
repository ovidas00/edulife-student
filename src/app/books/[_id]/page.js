"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Menu, X, List, Sun, Moon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export default function BookReader({ params }) {
  const { _id: bookId } = React.use(params);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [currentLessonId, setCurrentLessonId] = useState(null);

  const [bookInfo, setBookInfo] = useState(null); // book from sessionStorage
  const [darkMode, setDarkMode] = useState(false);

  // Load book from sessionStorage
  useEffect(() => {
    const storedBook = sessionStorage.getItem("book");
    if (storedBook) {
      try {
        setBookInfo(JSON.parse(storedBook));
      } catch (e) {
        console.error("Invalid stored book data", e);
      }
    }
  }, []);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(`book-progress-${bookId}`);
    if (savedProgress) {
      try {
        const { moduleId, lessonId } = JSON.parse(savedProgress);
        setCurrentModuleId(moduleId);
        setCurrentLessonId(lessonId);
      } catch (e) {
        console.error("Invalid saved progress", e);
      }
    }
  }, [bookId]);

  // Save progress when lesson changes
  useEffect(() => {
    if (currentModuleId && currentLessonId) {
      localStorage.setItem(
        `book-progress-${bookId}`,
        JSON.stringify({ moduleId: currentModuleId, lessonId: currentLessonId })
      );
    }
  }, [bookId, currentModuleId, currentLessonId]);

  // Fetch book with modules + lessons (for sidebar)
  const { data: bookData } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      const res = await api.get(`/books/${bookId}`);
      return res.data.payload; // contains { modules: [...] }
    },
  });

  // Fetch lesson content when lesson is selected
  const { data: lessonData } = useQuery({
    queryKey: ["lesson", currentModuleId, currentLessonId],
    queryFn: async () => {
      if (!currentModuleId || !currentLessonId) return null;
      const res = await api.get(
        `/modules/${currentModuleId}/lessons/${currentLessonId}`
      );
      return res.data.payload.lesson;
    },
    enabled: !!currentModuleId && !!currentLessonId,
  });

  // Handle navigation
  const navigateToLesson = (moduleId, lessonId) => {
    setCurrentModuleId(moduleId);
    setCurrentLessonId(lessonId);
    setSidebarOpen(false);
  };

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div
      className={`${
        darkMode ? "dark" : ""
      } flex h-screen bg-gray-50 dark:bg-gray-900`}
    >
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:shadow-md`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 truncate">
              {bookInfo?.title || "Loading..."}
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center mb-4 text-gray-700 dark:text-gray-300">
                <List size={18} className="mr-2" />
                <h2 className="font-medium">Table of Contents</h2>
              </div>

              <div className="space-y-6">
                {bookData?.modules?.map((module) => (
                  <div
                    key={module._id}
                    className="border-l-2 border-gray-200 dark:border-gray-700 pl-4"
                  >
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                      {module.title}
                    </h3>
                    <div className="space-y-2">
                      {module.lessons.map((lesson) => (
                        <button
                          key={lesson._id}
                          onClick={() =>
                            navigateToLesson(module._id, lesson._id)
                          }
                          className={`block w-full text-left p-2 rounded-md text-sm ${
                            currentLessonId === lesson._id
                              ? "bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/40 dark:text-blue-300"
                              : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                          }`}
                        >
                          {lesson.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 lg:hidden"
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center px-3">
              <BookOpen
                size={18}
                className="text-gray-500 dark:text-gray-400 mr-2"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {lessonData ? lessonData.title : "Select a lesson"}
              </span>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        {/* Reading Content */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
          <div className="max-w-3xl mx-auto p-6 py-8">
            {lessonData ? (
              <>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {lessonData.title}
                </h1>

                <div
                  className="prose max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: lessonData.contentHTML }}
                ></div>
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Select a lesson to start reading.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
