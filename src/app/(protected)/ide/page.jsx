"use client";

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";

export default function TabbedEditor() {
  const [htmlCode, setHtmlCode] = useState(`<h1>Hello World</h1>`);
  const [cssCode, setCssCode] = useState(
    `body { font-family: sans-serif; color: blue; }`
  );
  const [jsCode, setJsCode] = useState("");
  const [activeTab, setActiveTab] = useState("html");

  const theme =
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
      ? "dark"
      : "light";

  const tabs = ["html", "css", "js", "preview"];

  const srcDoc = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>${cssCode}</style>
      </head>
      <body>
        ${htmlCode}
        <script>
          ${jsCode}
        </script>
      </body>
    </html>
  `;

  return (
    <div className="p-4 md:p-6">
      {/* Tabs for all devices */}
      <div className="flex mb-4 border-b border-gray-300 dark:border-gray-600">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-2 text-center ${
              activeTab === tab
                ? "border-b-2 border-blue-500 font-semibold"
                : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="border border-gray-300 dark:border-gray-600 rounded">
        {activeTab === "html" && (
          <CodeMirror
            value={htmlCode}
            height="500px"
            extensions={[html()]}
            onChange={setHtmlCode}
            theme={theme}
          />
        )}
        {activeTab === "css" && (
          <CodeMirror
            value={cssCode}
            height="500px"
            extensions={[css()]}
            onChange={setCssCode}
            theme={theme}
          />
        )}
        {activeTab === "js" && (
          <CodeMirror
            value={jsCode}
            height="500px"
            extensions={[javascript()]}
            onChange={setJsCode}
            theme={theme}
          />
        )}
        {activeTab === "preview" && (
          <iframe
            title="Live Preview"
            className="w-full h-[500px]"
            srcDoc={srcDoc}
          />
        )}
      </div>
    </div>
  );
}
