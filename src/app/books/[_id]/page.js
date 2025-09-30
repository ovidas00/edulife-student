"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  BookOpen,
  Menu,
  X,
  List,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  Bookmark,
  XCircle,
  Play,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import "quill/dist/quill.snow.css";
import api from "@/lib/api";
import Image from "next/image";
const Quill = dynamic(() => import("quill"), { ssr: false });

function getYouTubeVideoId(url) {
  var regExp =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|\S+\?v=|(?:v|e(?:mbed)?)\/|\S+\/\S+\/)|youtu\.be\/)([\w-]{11})/;
  var match = url.match(regExp);
  return match ? match[1] : null;
}

export default function BookReader({ params }) {
  const { _id: bookId } = React.use(params);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [bookInfo, setBookInfo] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

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

  // Load dark mode from localStorage / system preference
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedTheme = localStorage.getItem("theme");
    let initialTheme =
      savedTheme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    setDarkMode(initialTheme === "dark");
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

  // Fetch book data
  const { data: bookData } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      const res = await api.get(`/books/${bookId}`);
      return res.data.payload;
    },
  });

  // Calculate reading progress
  useEffect(() => {
    if (!bookData || !currentModuleId || !currentLessonId) return;

    let totalLessons = 0;
    let completedLessons = 0;
    let foundCurrent = false;

    bookData.modules?.forEach((module) => {
      module.lessons?.forEach((lesson) => {
        totalLessons++;
        if (lesson._id === currentLessonId) {
          foundCurrent = true;
          completedLessons++;
        } else if (!foundCurrent) {
          completedLessons++;
        }
      });
    });

    if (totalLessons > 0) {
      setProgress(Math.round((completedLessons / totalLessons) * 100));
    }
  }, [bookData, currentModuleId, currentLessonId]);

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

  // Initialize Quill
  useEffect(() => {
    if (!quillViewerRef.current || quillInstance.current) return;

    import("quill").then(({ default: Quill }) => {
      const BlockEmbed = Quill.import("blots/block/embed");

      class AudioBlot extends BlockEmbed {
        static blotName = "audio";
        static tagName = "audio";

        static create(value) {
          const node = super.create();
          node.setAttribute("controls", true);
          node.setAttribute("src", value);
          node.style.display = "block";
          node.style.width = "100%";
          node.style.margin = "10px 0";
          return node;
        }

        static value(node) {
          return node.getAttribute("src");
        }
      }

      Quill.register(AudioBlot);

      quillInstance.current = new Quill(quillViewerRef.current, {
        theme: "snow",
        readOnly: true,
        modules: { toolbar: false },
      });
    });
  }, []);

  // Update Quill content
  useEffect(() => {
    if (!quillInstance.current || !lessonData) return;
    quillInstance.current.setContents([]);
    quillInstance.current.clipboard.dangerouslyPasteHTML(
      lessonData.contentHTML || ""
    );
    quillViewerRef.current.scrollTop = 0;
  }, [lessonData]);

  const navigateToLesson = (moduleId, lessonId) => {
    setCurrentModuleId(moduleId);
    setCurrentLessonId(lessonId);
    setSidebarOpen(false);
  };

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  };

  // Safe Previous/Next helpers
  const findPrevLesson = (moduleId, lessonId) => {
    if (!bookData?.modules?.length)
      return { prevModuleId: null, prevLessonId: null };

    for (let i = 0; i < bookData.modules.length; i++) {
      const mod = bookData.modules[i];
      if (!mod.lessons?.length) continue;
      for (let j = 0; j < mod.lessons.length; j++) {
        const lesson = mod.lessons[j];
        if (lesson._id === lessonId) {
          if (j > 0)
            return {
              prevModuleId: mod._id,
              prevLessonId: mod.lessons[j - 1]._id,
            };
          else if (i > 0) {
            const prevMod = bookData.modules[i - 1];
            const lastLesson = prevMod.lessons?.[prevMod.lessons.length - 1];
            if (lastLesson)
              return {
                prevModuleId: prevMod._id,
                prevLessonId: lastLesson._id,
              };
          }
          return { prevModuleId: null, prevLessonId: null };
        }
      }
    }
    return { prevModuleId: null, prevLessonId: null };
  };

  const findNextLesson = (moduleId, lessonId) => {
    if (!bookData?.modules?.length)
      return { nextModuleId: null, nextLessonId: null };

    for (let i = 0; i < bookData.modules.length; i++) {
      const mod = bookData.modules[i];
      if (!mod.lessons?.length) continue;
      for (let j = 0; j < mod.lessons.length; j++) {
        const lesson = mod.lessons[j];
        if (lesson._id === lessonId) {
          if (j < mod.lessons.length - 1)
            return {
              nextModuleId: mod._id,
              nextLessonId: mod.lessons[j + 1]._id,
            };
          else if (i < bookData.modules.length - 1) {
            const nextMod = bookData.modules[i + 1];
            const firstLesson = nextMod.lessons?.[0];
            if (firstLesson)
              return {
                nextModuleId: nextMod._id,
                nextLessonId: firstLesson._id,
              };
          }
          return { nextModuleId: null, nextLessonId: null };
        }
      }
    }
    return { nextModuleId: null, nextLessonId: null };
  };

  const currentModule = bookData?.modules?.find(
    (mod) => mod._id === currentModuleId
  );
  const currentModuleTitle = currentModule?.title;
  const currentModuleOrder = currentModule?.order;

  const { prevModuleId, prevLessonId } = findPrevLesson(
    currentModuleId,
    currentLessonId
  );
  const { nextModuleId, nextLessonId } = findNextLesson(
    currentModuleId,
    currentLessonId
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 select-none transition-colors duration-300">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:shadow-md flex flex-col`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 truncate">
                {bookInfo?.title || "Loading..."}
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 cursor-pointer rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-4 py-3 bg-gray-50 dark:bg-transparent border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Progress
              </span>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center mb-4 text-gray-700 dark:text-gray-300">
                <List size={18} className="mr-2 flex-shrink-0" />
                <h2 className="font-semibold">Table of Contents</h2>
              </div>

              <div className="space-y-4">
                {bookData?.modules?.map((module) => (
                  <div
                    key={module._id}
                    className="border-l-2 border-gray-200 dark:border-gray-700 pl-3"
                  >
                    <button
                      onClick={() => toggleModule(module._id)}
                      className="flex items-center justify-between w-full text-left font-medium text-gray-800 dark:text-gray-200 mb-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 px-2 -ml-1"
                    >
                      <span className="flex-1 text-sm line-clamp-3">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                          Module {module.order}:
                        </span>{" "}
                        {module.title}
                      </span>
                      <span className="flex-shrink-0 ml-2 text-gray-500 dark:text-gray-400">
                        {expandedModules[module._id] ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </span>
                    </button>

                    {expandedModules[module._id] && (
                      <div className="space-y-1 ml-1">
                        {module.lessons.map((lesson) => (
                          <button
                            key={lesson._id}
                            onClick={() =>
                              navigateToLesson(module._id, lesson._id)
                            }
                            className={`flex items-center w-full text-left p-2 rounded-md text-sm transition-colors ${
                              currentLessonId === lesson._id
                                ? "bg-blue-100 text-blue-800 font-medium dark:bg-blue-900/30 dark:text-blue-300"
                                : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                            }`}
                          >
                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium mr-2 flex-shrink-0">
                              {lesson.videoUrl ? (
                                <Play size={14} />
                              ) : (
                                lesson.order
                              )}
                            </span>
                            <span className="truncate">{lesson.title}</span>
                            {currentLessonId === lesson._id && (
                              <Bookmark
                                size={14}
                                className="ml-auto text-blue-600 dark:text-blue-400 flex-shrink-0"
                              />
                            )}
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
        <header className="flex items-center py-4 px-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center min-w-0 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 cursor-pointer rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 lg:hidden mr-2"
            >
              <Menu size={20} />
            </button>

            <BookOpen
              size={16}
              className="flex-shrink-0 text-gray-500 dark:text-gray-400 mr-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-normal break-words">
              {currentModuleTitle
                ? `Module ${currentModuleOrder}: ${currentModuleTitle}`
                : "Select a lesson to begin"}
            </span>
          </div>

          <div className="ml-auto flex gap-x-2 flex-shrink-0">
            {/* <button
              title="Toggle Theme"
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-white cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button> */}

            <button
              onClick={() => router.replace("/")}
              title="Close"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-white cursor-pointer"
              aria-label="Close"
            >
              <XCircle size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 relative">
          <div className="max-w-3xl mx-auto px-4 py-8">
            {isFetching && (
              <div className="flex justify-center items-center h-64 w-full">
                <div className="animate-pulse w-full max-w-2xl p-4 space-y-4">
                  {/* Title */}
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>

                  {/* Paragraph */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Lesson Title or Video */}
            {lessonData &&
              !isFetching &&
              (lessonData.videoUrl ? (
                // Show YouTube video
                <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative pt-[56.25%]">
                    {" "}
                    {/* 16:9 Aspect ratio */}
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-md shadow-md"
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                        lessonData.videoUrl
                      )}?autoplay=1`}
                      title={lessonData.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              ) : (
                // Show lesson title
                <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded-full font-medium">
                      Lesson {lessonData.order}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {lessonData.title}
                  </h1>
                </div>
              ))}

            {/* Quill Viewer */}
            <div
              className={`${
                isFetching && "hidden"
              } relative h-full min-h-[400px] bg-white dark:bg-gray-900`}
            >
              {/* Quill container (empty, Quill owns this) */}
              <div
                ref={quillViewerRef}
                className="ql-snow border-0 p-0 h-full"
              />

              {/* Overlay placeholder */}
              {!lessonData && !isFetching && (
                <div className="absolute inset-0 flex flex-col items-center justify-start text-center px-6 py-8">
                  {bookInfo?.coverImage ? (
                    <Image
                      src={bookInfo.coverImage}
                      alt={bookInfo.title}
                      width={350}
                      height={50}
                      className="object-cover rounded-lg shadow-md mb-6"
                    />
                  ) : (
                    <BookOpen
                      size={64}
                      className="mb-6 text-gray-400 dark:text-gray-500"
                    />
                  )}

                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    {bookInfo?.title || "Untitled Book"}
                  </h1>

                  <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6 break-words">
                    {bookInfo?.description || "No description available."}
                  </p>

                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    Select a lesson from the sidebar to begin reading
                  </p>
                </div>
              )}
            </div>

            {/* Previous / Next Buttons */}
            {lessonData && !isFetching && (
              <div className="flex justify-between mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    if (prevLessonId)
                      navigateToLesson(prevModuleId, prevLessonId);
                  }}
                  disabled={!prevLessonId}
                  className="px-4 py-2 cursor-pointer rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  Previous
                </button>

                <button
                  onClick={() => {
                    if (nextLessonId)
                      navigateToLesson(nextModuleId, nextLessonId);
                  }}
                  disabled={!nextLessonId}
                  className="px-4 py-2 rounded cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Table Styles - Preserved exactly as you had it */}
      <style>
        {`
          .ql-editor { color: #111827; }
          .dark .ql-editor { color: #f9fafb; background-color: #111827; }
          .ql-editor table { width: 100%; border-collapse: collapse; }
          .ql-editor td, .ql-editor th { border: 1px solid #d1d5db; padding: 0.5rem; }
          .dark .ql-editor td, .dark .ql-editor th { border-color: #4b5563; }
          .ql-container.ql-snow {
              border: none !important;
              padding: 0 !important;
          }
          .ql-code-block {
            user-select: text;       /* allow text selection */
            white-space: pre-wrap;   /* preserve formatting but allow wrapping */
            font-family: monospace;  /* makes it look like code */
            cursor: text;            /* show text cursor */
          }

        `}
      </style>
    </div>
  );
}
