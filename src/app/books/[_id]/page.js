"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Bookmark,
  Clock,
  List,
} from "lucide-react";

// Mock data - in a real app, this would come from your API
const mockBook = {
  _id: "1",
  title: "The Art of Programming",
  description: "A comprehensive guide to modern programming techniques",
  coverImage: "/book-cover.jpg",
  status: "Published",
  modules: [
    {
      _id: "m1",
      title: "Introduction to Programming",
      description: "Learn the basics of programming concepts",
      order: 1,
      lessons: [
        {
          _id: "l1",
          title: "What is Programming?",
          order: 1,
          contentHTML:
            "<p>Programming is the process of creating a set of instructions that tell a computer how to perform a task.</p><p>Programming can be done using a variety of computer programming languages, such as JavaScript, Python, and C++.</p>",
        },
        {
          _id: "l2",
          title: "Variables and Data Types",
          order: 2,
          contentHTML:
            "<p>Variables are used to store information to be referenced and manipulated in a computer program.</p><p>Common data types include strings, numbers, booleans, arrays, and objects.</p>",
        },
      ],
    },
    {
      _id: "m2",
      title: "Control Structures",
      description: "Learn how to control program flow",
      order: 2,
      lessons: [
        {
          _id: "l3",
          title: "Conditional Statements",
          order: 1,
          contentHTML:
            "<p>Conditional statements are used to perform different actions based on different conditions.</p><p>In JavaScript, we have the following conditional statements: if, else, else if, and switch.</p>",
        },
      ],
    },
  ],
};

export default function BookReader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [readingProgress, setReadingProgress] = useState({});
  const [lastReadPosition, setLastReadPosition] = useState(null);

  const currentModule = mockBook.modules[currentModuleIndex];
  const currentLesson = currentModule.lessons[currentLessonIndex];

  // Load reading progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(`bookProgress_${mockBook._id}`);
    if (savedProgress) {
      setReadingProgress(JSON.parse(savedProgress));
    }

    const savedPosition = localStorage.getItem(`lastPosition_${mockBook._id}`);
    if (savedPosition) {
      const position = JSON.parse(savedPosition);
      setCurrentModuleIndex(position.moduleIndex);
      setCurrentLessonIndex(position.lessonIndex);
      setLastReadPosition(position);
    }
  }, []);

  // Save reading progress to localStorage
  const markAsRead = (moduleIndex, lessonIndex) => {
    const newProgress = {
      ...readingProgress,
      [`m${moduleIndex}l${lessonIndex}`]: true,
    };
    setReadingProgress(newProgress);
    localStorage.setItem(
      `bookProgress_${mockBook._id}`,
      JSON.stringify(newProgress)
    );

    // Save last read position
    const position = { moduleIndex, lessonIndex };
    setLastReadPosition(position);
    localStorage.setItem(
      `lastPosition_${mockBook._id}`,
      JSON.stringify(position)
    );
  };

  const navigateToLesson = (moduleIndex, lessonIndex) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentLessonIndex(lessonIndex);
    setSidebarOpen(false);
    markAsRead(moduleIndex, lessonIndex);
  };

  const navigateToNextLesson = () => {
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      // Next lesson in same module
      setCurrentLessonIndex(currentLessonIndex + 1);
      markAsRead(currentModuleIndex, currentLessonIndex + 1);
    } else if (currentModuleIndex < mockBook.modules.length - 1) {
      // First lesson in next module
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentLessonIndex(0);
      markAsRead(currentModuleIndex + 1, 0);
    }
  };

  const navigateToPrevLesson = () => {
    if (currentLessonIndex > 0) {
      // Previous lesson in same module
      setCurrentLessonIndex(currentLessonIndex - 1);
      markAsRead(currentModuleIndex, currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      // Last lesson in previous module
      const prevModule = mockBook.modules[currentModuleIndex - 1];
      setCurrentModuleIndex(currentModuleIndex - 1);
      setCurrentLessonIndex(prevModule.lessons.length - 1);
      markAsRead(currentModuleIndex - 1, prevModule.lessons.length - 1);
    }
  };

  const calculateProgress = () => {
    let totalLessons = 0;
    let completedLessons = 0;

    mockBook.modules.forEach((module, moduleIndex) => {
      module.lessons.forEach((lesson, lessonIndex) => {
        totalLessons++;
        if (readingProgress[`m${moduleIndex}l${lessonIndex}`]) {
          completedLessons++;
        }
      });
    });

    return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  };

  const progressPercentage = calculateProgress();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:shadow-md`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <h1 className="text-xl font-semibold text-gray-800 truncate">
              {mockBook.title}
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Progress */}
            <div className="p-4 border-b border-gray-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Progress
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Last read position */}
            {lastReadPosition && (
              <div className="p-4 border-b border-gray-300">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Bookmark size={16} className="mr-2 text-blue-500" />
                  <span className="font-medium">Last Read</span>
                </div>
                <button
                  onClick={() =>
                    navigateToLesson(
                      lastReadPosition.moduleIndex,
                      lastReadPosition.lessonIndex
                    )
                  }
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {
                    mockBook.modules[lastReadPosition.moduleIndex].lessons[
                      lastReadPosition.lessonIndex
                    ].title
                  }
                </button>
              </div>
            )}

            {/* Table of Contents */}
            <div className="p-4">
              <div className="flex items-center mb-4 text-gray-700">
                <List size={18} className="mr-2" />
                <h2 className="font-medium">Table of Contents</h2>
              </div>

              <div className="space-y-6">
                {mockBook.modules.map((module, moduleIndex) => (
                  <div
                    key={module._id}
                    className="border-l-2 border-gray-200 pl-4"
                  >
                    <h3 className="font-medium text-gray-800 mb-2">
                      {module.title}
                    </h3>
                    <div className="space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <button
                          key={lesson._id}
                          onClick={() =>
                            navigateToLesson(moduleIndex, lessonIndex)
                          } 
                          className={`block w-full text-left p-2 rounded-md text-sm ${
                            currentModuleIndex === moduleIndex &&
                            currentLessonIndex === lessonIndex
                              ? "bg-blue-50 text-blue-700 font-medium"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-4 h-4 rounded-full border flex-shrink-0 mr-2 ${
                                readingProgress[
                                  `m${moduleIndex}l${lessonIndex}`
                                ]
                                  ? "bg-blue-500 border-blue-500"
                                  : "border-gray-300"
                              }`}
                            ></div>
                            <span>{lesson.title}</span>
                          </div>
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
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-300">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 rounded-md text-gray-500 hover:text-gray-700 lg:hidden"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center">
            <BookOpen size={18} className="text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">
              {currentModuleIndex + 1}-{currentLessonIndex + 1}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={16} className="mr-1" />
              <span>15 min read</span>
            </div>
          </div>
        </header>

        {/* Reading Content */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-3xl mx-auto p-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentLesson.title}
            </h1>
            <div className="flex items-center text-sm text-gray-500 mb-8">
              <span>From: {currentModule.title}</span>
            </div>

            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: currentLesson.contentHTML }}
            ></div>

            <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
              <button
                onClick={navigateToPrevLesson}
                disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
                className={`flex items-center px-4 py-2 rounded-md ${
                  currentModuleIndex === 0 && currentLessonIndex === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                <ChevronLeft size={18} className="mr-1" />
                Previous
              </button>

              <button
                onClick={navigateToNextLesson}
                disabled={
                  currentModuleIndex === mockBook.modules.length - 1 &&
                  currentLessonIndex === currentModule.lessons.length - 1
                }
                className={`flex items-center px-4 py-2 rounded-md ${
                  currentModuleIndex === mockBook.modules.length - 1 &&
                  currentLessonIndex === currentModule.lessons.length - 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-50"
                }`}
              >
                Next
                <ChevronRight size={18} className="ml-1" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
