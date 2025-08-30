"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

const AppDialog = ({
  title,
  children,
  open,
  setOpen,
  className,
  bgColor = "bg-white dark:bg-gray-900", // default supports dark mode
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/40 dark:bg-black/50 backdrop-blur-sm z-50" />

        {/* Content */}
        <Dialog.Content
          className={`fixed left-1/2 top-1/2 w-[90%] max-w-md max-h-[90%] overflow-y-auto -translate-x-1/2 -translate-y-1/2 
          rounded-xl p-6 shadow-lg focus:outline-none ${className} ${bgColor} z-50`}
        >
          {/* Close Button */}
          <Dialog.Close asChild>
            <button className="absolute right-3 top-3 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700">
              <X size={18} className="text-gray-800 dark:text-gray-200" />
            </button>
          </Dialog.Close>

          {/* Title */}
          {title && (
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </Dialog.Title>
          )}

          {/* Custom Content */}
          <div className="mt-4 text-gray-800 dark:text-gray-300">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AppDialog;
