// components/widget/WidgetHeader.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import type { WidgetView } from "@/types/widget";

interface WidgetHeaderProps {
  companyName: string;
  brandColor: string;
  currentView: WidgetView;
  onBack: () => void;
  onClose: () => void;
}

export default function WidgetHeader({
  companyName,
  brandColor,
  currentView,
  onBack,
  onClose,
}: WidgetHeaderProps) {
  const showBackButton = currentView !== "welcome";

  const getTitle = () => {
    switch (currentView) {
      case "create-ticket":
        return "New Ticket";
      case "success":
        return "Success";
      case "check-status":
        return "Check Status";
      case "ticket-status":
        return "Ticket Status";
      default:
        return "Support";
    }
  };

  return (
    <div
      className="relative px-4 py-4 sm:px-5 sm:py-4 flex items-center justify-between rounded-t-2xl"
      style={{ backgroundColor: brandColor }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10 rounded-t-2xl overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Content */}
      <div className="relative flex items-center gap-3 min-w-0 flex-1">
        {showBackButton && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </motion.button>
        )}

        <div className="min-w-0 flex-1">
          <h2 className="text-white font-semibold text-base sm:text-lg leading-tight truncate">
            {companyName}
          </h2>
          <p className="text-white/80 text-sm truncate">{getTitle()}</p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="relative p-2 -mr-2 rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
        aria-label="Close widget"
      >
        <X className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}