"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  BookOpen,
  Clock,
  User,
} from "lucide-react";

// Demo data
const bookData = {
  title: "Complete Web Development Guide",
  author: "John Developer",
  modules: [
    {
      id: 1,
      title: "Introduction to Web Development",
      description:
        "Learn the fundamentals of web development and get started with HTML, CSS, and JavaScript.",
      lessons: [
        { id: 1, title: "What is Web Development?" },
        { id: 2, title: "Setting up Development Environment" },
        { id: 3, title: "Understanding the Web" },
      ],
    },
    {
      id: 2,
      title: "HTML Fundamentals",
      description:
        "Master HTML structure, elements, and semantic markup for building web pages.",
      lessons: [
        { id: 4, title: "HTML Document Structure" },
        { id: 5, title: "Text Elements and Formatting" },
        { id: 6, title: "Links and Images" },
        { id: 7, title: "Forms and Input Elements" },
      ],
    },
    {
      id: 3,
      title: "CSS Styling",
      description:
        "Learn to style your web pages with CSS, including layouts, animations, and responsive design.",
      lessons: [
        { id: 8, title: "CSS Selectors and Properties" },
        { id: 9, title: "Box Model and Layout" },
        { id: 10, title: "Flexbox and Grid" },
        { id: 11, title: "Responsive Design" },
      ],
    },
    {
      id: 4,
      title: "JavaScript Programming",
      description:
        "Dive into JavaScript programming, DOM manipulation, and modern ES6+ features.",
      lessons: [
        { id: 12, title: "JavaScript Basics" },
        { id: 13, title: "Functions and Objects" },
        { id: 14, title: "DOM Manipulation" },
        { id: 15, title: "Async Programming" },
      ],
    },
  ],
};

const lessonContent = {
  1: {
    title: "What is Web Development?",
    content: `
      <h1>What is Web Development?</h1>
      <p>Web development is the process of creating websites and web applications that run on the internet or an intranet. It involves several different aspects, including web design, web content development, client-side/server-side scripting, and network security configuration.</p>
      
      <h2>Types of Web Development</h2>
      <p>Web development can be broken down into three main categories:</p>
      
      <h3>1. Front-end Development</h3>
      <p>Front-end development focuses on the visual and interactive aspects of a website that users see and interact with directly. This includes:</p>
      <ul>
        <li>User interface (UI) design</li>
        <li>User experience (UX) optimization</li>
        <li>Responsive design for different devices</li>
        <li>Browser compatibility</li>
      </ul>
      
      <h3>2. Back-end Development</h3>
      <p>Back-end development involves server-side programming and database management. It handles:</p>
      <ul>
        <li>Server configuration</li>
        <li>Database operations</li>
        <li>API development</li>
        <li>Security implementation</li>
      </ul>
      
      <h3>3. Full-stack Development</h3>
      <p>Full-stack developers work on both front-end and back-end development, having a comprehensive understanding of the entire web development process.</p>
      
      <h2>Key Technologies</h2>
      <p>Modern web development involves various technologies and frameworks that make development more efficient and powerful.</p>
    `,
  },
  2: {
    title: "Setting up Development Environment",
    content: `
      <h1>Setting up Development Environment</h1>
      <p>A proper development environment is crucial for efficient web development. Here's what you need to get started.</p>
      
      <h2>Essential Tools</h2>
      <h3>1. Code Editor</h3>
      <p>Choose a powerful code editor that supports syntax highlighting, extensions, and debugging:</p>
      <ul>
        <li>Visual Studio Code (recommended)</li>
        <li>Sublime Text</li>
        <li>Atom</li>
        <li>WebStorm</li>
      </ul>
      
      <h3>2. Web Browser</h3>
      <p>Use modern browsers with developer tools:</p>
      <ul>
        <li>Google Chrome</li>
        <li>Mozilla Firefox</li>
        <li>Safari</li>
        <li>Microsoft Edge</li>
      </ul>
      
      <h3>3. Version Control</h3>
      <p>Git is essential for tracking changes and collaborating:</p>
      <ul>
        <li>Install Git</li>
        <li>Create a GitHub account</li>
        <li>Learn basic Git commands</li>
      </ul>
      
      <h2>Recommended Extensions</h2>
      <p>For Visual Studio Code, install these helpful extensions:</p>
      <ul>
        <li>Live Server</li>
        <li>Prettier</li>
        <li>ESLint</li>
        <li>Auto Rename Tag</li>
        <li>Bracket Pair Colorizer</li>
      </ul>
    `,
  },
  // Add more lesson content as needed
};

export default function BookReadingPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});
  const [selectedLesson, setSelectedLesson] = useState(1);
  const [selectedModule, setSelectedModule] = useState(1);

  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const selectLesson = (lessonId, moduleId) => {
    setSelectedLesson(lessonId);
    setSelectedModule(moduleId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const getCurrentContent = () => {
    return (
      lessonContent[selectedLesson] || {
        title: "Lesson Content",
        content:
          "<h1>Lesson Content</h1><p>Select a lesson from the sidebar to view its content.</p>",
      }
    );
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Book Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {bookData.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{bookData.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>12 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Course Modules
        </h2>
        <div className="space-y-2">
          {bookData.modules.map((module) => (
            <div key={module.id} className="border border-gray-200 rounded-lg">
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors duration-200 flex items-start gap-3"
              >
                <div className="flex-shrink-0 pt-1">
                  {expandedModules[module.id] ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {module.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {module.description}
                  </p>
                  <span className="text-xs text-gray-500 mt-2 inline-block">
                    {module.lessons.length} lessons
                  </span>
                </div>
              </button>

              {/* Lessons List */}
              {expandedModules[module.id] && (
                <div className="border-t border-gray-200 bg-gray-50">
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => selectLesson(lesson.id, module.id)}
                      className={`w-full p-3 text-left text-sm hover:bg-gray-100 transition-colors duration-200 border-l-4 ${
                        selectedLesson === lesson.id
                          ? "border-blue-500 bg-blue-50 text-blue-900"
                          : "border-transparent"
                      }`}
                    >
                      <div className="ml-7">{lesson.title}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-white shadow-lg border-r border-gray-200 h-full overflow-y-auto">
        <SidebarContent />
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } h-full overflow-y-auto`}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 lg:p-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-8">
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: getCurrentContent().content,
                  }}
                />
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="mt-8 flex justify-between items-center">
              <button className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
                ← Previous
              </button>
              <div className="text-sm text-gray-500">
                Lesson {selectedLesson} of 15
              </div>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
