"use client";

import { useState, useEffect } from "react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if app is already running as PWA
    const checkStandalone = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone; // iOS
      setIsStandalone(standalone);
    };

    checkStandalone();

    // Listen for beforeinstallprompt
    const handler = (e) => {
      e.preventDefault(); // stop automatic prompt
      setDeferredPrompt(e);
      if (!isStandalone) setVisible(true); // show prompt if not standalone
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [isStandalone]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    console.log("User choice:", choiceResult.outcome); // accepted or dismissed

    setDeferredPrompt(null);
    setVisible(false); // hide prompt after interaction
  };

  if (!visible || isStandalone) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white rounded-xl shadow-lg p-4 max-w-md w-full z-50">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="font-bold text-lg">Install Our App</div>
          <div className="text-sm opacity-90">
            Get faster access and offline support
          </div>
        </div>
        <button
          onClick={handleInstallClick}
          className="bg-white text-indigo-600 font-semibold rounded-lg px-4 py-2 hover:bg-gray-100 transition"
        >
          Install
        </button>
      </div>
    </div>
  );
}
