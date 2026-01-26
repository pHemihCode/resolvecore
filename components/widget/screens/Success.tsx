// components/widget/screens/Success.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Copy, Check, Search, X } from "lucide-react";
import type { WidgetView } from "@/types/widget";

interface SuccessProps {
  ticketId: string;
  brandColor: string;
  setCurrentView: (view: WidgetView) => void;
  closeWidget: () => void;
}

export default function Success({
  ticketId,
  brandColor,
  setCurrentView,
  closeWidget,
}: SuccessProps) {
  const [copied, setCopied] = useState(false);

  const copyTicketId = async () => {
    try {
      await navigator.clipboard.writeText(ticketId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col items-center justify-center text-center my-12"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative mb-6"
      >
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-white" />
        </motion.div>
      </motion.div>

      {/* Success Message */}
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-gray-900 mb-2"
      >
        Ticket Submitted!
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-500 mb-6"
      >
        We've received your request and will get back to you soon.
      </motion.p>

      {/* Ticket ID Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8"
      >
        <p className="text-sm text-gray-500 mb-2">Your Ticket ID</p>
        <div className="flex items-center justify-center gap-2">
          <code className="text-lg font-mono font-semibold text-gray-900">
            {ticketId.slice(0, 8)}...{ticketId.slice(-4)}
          </code>
          <button
            onClick={copyTicketId}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Copy full ticket ID"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>
        {copied && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-green-600 mt-2"
          >
            Copied to clipboard!
          </motion.p>
        )}
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full space-y-3"
      >
        <button
          onClick={() => setCurrentView("check-status")}
          className="w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
          style={{ backgroundColor: brandColor }}
        >
          <Search className="w-5 h-5" />
          Check Status
        </button>

        <button
          onClick={closeWidget}
          className="w-full py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-5 h-5" />
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}