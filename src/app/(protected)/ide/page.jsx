"use client";

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";

export default function HtmlEditorDemo() {
  const [code, setCode] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>
`);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 md:p-6">
      {/* Editor */}
      <div className="flex-1 flex-shrink-0 border border-gray-300 dark:border-gray-600">
        <CodeMirror
          value={code}
          height="500px"
          extensions={[html()]}
          onChange={(value) => setCode(value)}
          theme={localStorage.getItem("theme") === "dark" ? "dark" : "light"}
        />
      </div>

      {/* Live Preview */}
      <div className="flex-1 border flex-shrink-0 border-gray-300 dark:border-gray-600 bg-white">
        <iframe
          title="Live Preview"
          className="w-full h-[500px]"
          srcDoc={code}
        />
      </div>
    </div>
  );
}
