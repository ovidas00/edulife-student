"use client";

import { useState, useEffect } from "react";

export default function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone; // iOS
      setIsStandalone(standalone);
    };

    checkStandalone();

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isStandalone) setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [isStandalone]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setVisible(false);
  };

  return {
    isStandalone,
    visible,
    canInstall: !!deferredPrompt && !isStandalone,
    handleInstall,
  };
}
