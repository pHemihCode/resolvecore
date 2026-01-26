// components/widget/WidgetLauncher.tsx
"use client";

import { motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface WidgetLauncherProps {
  isOpen: boolean;
  onClick: () => void;
  brandColor: string;
  position: "bottom-right" | "bottom-left";
}

export default function WidgetLauncher({
  isOpen,
  onClick,
  brandColor,
  position,
}: WidgetLauncherProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "fixed z-[99999]",
        // Responsive size
        "w-12 h-12 sm:w-14 sm:h-14",
        "rounded-full shadow-lg",
        "flex items-center justify-center",
        "focus:outline-none focus:ring-4 focus:ring-opacity-50",
        "transition-shadow duration-300",
        "cursor-pointer",
        // Responsive position
        position === "bottom-right"
          ? "right-4 bottom-4 sm:right-6 sm:bottom-6"
          : "left-4 bottom-4 sm:left-6 sm:bottom-6"
      )}
      style={{
        backgroundColor: brandColor,
        boxShadow: `0 4px 20px 0 ${brandColor}50`,
      }}
      aria-label={isOpen ? "Close support chat" : "Open support chat"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
        ) : (
          <MessageCircle
            className="w-5 h-5 sm:w-6 sm:h-6 text-white"
            strokeWidth={2.5}
          />
        )}
      </motion.div>

      {/* Pulse animation when closed */}
      {!isOpen && (
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: brandColor }}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
      )}
    </motion.button>
  );
}