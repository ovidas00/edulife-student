"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Menu,
  X,
  List,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import api from "@/lib/api";

export default function BookReader({ params }) {
  const { _id: bookId } = React.use(params);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [expandedModules, setExpandedModules] = useState({}); // For collapsible modules

  const [bookInfo, setBookInfo] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const quillViewerRef = useRef(null);
  const quillInstance = useRef(null);

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedTheme = localStorage.getItem("theme");
    let initialTheme = "light";

    if (savedTheme) {
      initialTheme = savedTheme;
    } else {
      initialTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  // Load progress from localStorage
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

  // Save progress
  useEffect(() => {
    if (currentModuleId && currentLessonId) {
      localStorage.setItem(
        `book-progress-${bookId}`,
        JSON.stringify({ moduleId: currentModuleId, lessonId: currentLessonId })
      );
    }
  }, [bookId, currentModuleId, currentLessonId]);

  // Fetch book for sidebar
  const { data: bookData } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      const res = await api.get(`/books/${bookId}`);
      return res.data.payload;
    },
  });

  // Fetch lesson content
  const { data: lessonData, isFetching } = useQuery({
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

  // Initialize Quill viewer only once
  useEffect(() => {
    if (!quillViewerRef.current) return;
    if (!quillInstance.current) {
      quillInstance.current = new Quill(quillViewerRef.current, {
        theme: "snow",
        readOnly: true,
        modules: { toolbar: false },
      });
    }
  }, []);

  // Update lesson content instantly when lessonData changes
  useEffect(() => {
    if (!quillInstance.current || !lessonData) return;

    quillInstance.current.setContents([]);
    quillInstance.current.clipboard.dangerouslyPasteHTML(
      lessonData.contentHTML || ""
    );

    quillViewerRef.current.scrollTop = 0;
  }, [lessonData]);

  // Handle lesson navigation
  const navigateToLesson = (moduleId, lessonId) => {
    setCurrentModuleId(moduleId);
    setCurrentLessonId(lessonId);
    setSidebarOpen(false);
  };

  // Toggle module collapse
  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Inside your component, before return
  const currentModule = bookData?.modules?.find(
    (mod) => mod._id === currentModuleId
  );
  const currentModuleTitle = currentModule?.title;

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
                    <button
                      onClick={() => toggleModule(module._id)}
                      className="flex items-center justify-between w-full text-left font-medium text-gray-800 dark:text-gray-200 mb-2"
                    >
                      <span className="flex-1 truncate">
                        Module {module.order}: {module.title}
                      </span>
                      <span className="flex-shrink-0 ml-2">
                        {expandedModules[module._id] ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </span>
                    </button>

                    {expandedModules[module._id] && (
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
                            Lesson {lesson.order}: {lesson.title}
                          </button>
                        ))}
                      </div>
                    )}
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
                {currentModuleTitle ? `Module: ${currentModuleTitle}` : ""}
              </span>
            </div>
          </div>
        </header>

        {/* Reading Content */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {isFetching && (
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Loading lesson...
              </p>
            )}

            {/* Lesson Title */}
            {lessonData && (
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Lesson {lessonData.order}: {lessonData.title}
              </h1>
            )}

            {/* Quill Viewer */}
            <div
              ref={quillViewerRef}
              className="ql-snow bg-white dark:bg-gray-900"
              style={{ minHeight: "400px" }}
            />
            {!lessonData && !isFetching && (
              <p className="text-gray-500 dark:text-gray-400">
                Select a lesson to start reading.
              </p>
            )}
          </div>
        </main>
      </div>

      {/* Table Styles */}
      <style>
        {`
          .ql-editor {
            color: #111827; /* default text for light mode */
          }

          .dark .ql-editor {
            color: #f9fafb; /* light text for dark mode */
            background-color: #111827; /* optional, in case background wasn't set */
          }

          .ql-editor table {
            width: 100%;
            border-collapse: collapse;
          }
          .ql-editor td,
          .ql-editor th {
            border: 1px solid #d1d5db;
            padding: 0.5rem;
          }
          .dark .ql-editor td,
          .dark .ql-editor th {
            border-color: #4b5563;
          }
        `}
      </style>
    </div>
  );
}
