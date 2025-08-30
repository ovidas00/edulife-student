"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { queryClient } from "@/lib/react-query";
import PWAInstallPrompt from "./PWAInstallPrompt";

export default function ClientProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PWAInstallPrompt />
      {children}
      <Toaster position="bottom-center" />
    </QueryClientProvider>
  );
}
