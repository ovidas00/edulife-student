"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

const AppDialog = ({
  title,
  children,
  open,
  setOpen,
  className,
  bgColor = "bg-white",
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-999" />

        <Dialog.Content
          className={`fixed left-1/2 top-1/2 w-[90%] max-w-md max-h-[90%] overflow-y-auto -translate-x-1/2 -translate-y-1/2 
          rounded-xl p-6 shadow-lg focus:outline-none dark:bg-gray-900 z-1000 ${className} ${bgColor}`}
        >
          {/* Close Button */}
          <Dialog.Close asChild>
            <button className="absolute right-3 top-3 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700">
              <X size={18} />
            </button>
          </Dialog.Close>

          {/* Title */}
          {title && (
            <Dialog.Title className="text-lg font-semibold">
              {title}
            </Dialog.Title>
          )}

          {/* Custom Content */}
          <div className="mt-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AppDialog;
