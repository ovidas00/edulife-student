"use client";
import { Toaster } from "react-hot-toast";

import { Poppins } from "next/font/google";
import { QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import { queryClient } from "@/lib/react-query";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster position="bottom-center" />
        </QueryClientProvider>
      </body>
    </html>
  );
}
