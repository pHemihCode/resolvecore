// components/widget/screens/Welcome.tsx
"use client";

import { motion } from "framer-motion";
import { MessageSquarePlus, Search, Sparkles } from "lucide-react";
import type { WidgetView, WidgetConfig } from "@/types/widget";

interface WelcomeProps {
  config: WidgetConfig;
  setCurrentView: (view: WidgetView) => void;
}

export default function Welcome({ config, setCurrentView }: WelcomeProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full flex flex-col min-h-0"
    >
      {/* Welcome Message */}
      <motion.div variants={itemVariants} className="text-center mb-6 sm:mb-8">
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${config.brandColor}15` }}
        >
          <Sparkles
            className="w-7 h-7 sm:w-8 sm:h-8"
            style={{ color: config.brandColor }}
          />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {config.welcomeMessage}
        </h1>

        <p className="text-gray-500 text-sm sm:text-base">
          We're here to help! Choose an option below.
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="space-y-3 my-3 md:mt-auto">
        <button
          onClick={() => setCurrentView("create-ticket")}
          className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50 transition-all group text-left"
        >
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${config.brandColor}15` }}
          >
            <MessageSquarePlus
              className="w-5 h-5 sm:w-6 sm:h-6"
              style={{ color: config.brandColor }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 text-sm sm:text-base">
              Create a Ticket
            </p>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              Submit a new support request
            </p>
          </div>
        </button>

        <button
          onClick={() => setCurrentView("check-status")}
          className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50 transition-all group text-left"
        >
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${config.brandColor}15` }}
          >
            <Search
              className="w-5 h-5 sm:w-6 sm:h-6"
              style={{ color: config.brandColor }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 text-sm sm:text-base">
              Check Status
            </p>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              Track your existing ticket
            </p>
          </div>
        </button>
      </motion.div>

      {/* Response Time */}
      <motion.div variants={itemVariants} className="mt-4 sm:mt-6 md:pb-3 text-center">
        <p className="text-xs text-gray-400">
          Average response time:{" "}
          <span className="font-medium text-gray-600">under 2 hours</span>
        </p>
      </motion.div>
    </motion.div>
  );
}