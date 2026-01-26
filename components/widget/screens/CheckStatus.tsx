// components/widget/screens/CheckStatus.tsx
"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Loader2, Search, AlertCircle } from "lucide-react";
import { checkTicketStatus } from "@/lib/api/widget-api";
import type { WidgetView } from "@/types/widget";
import { cn } from "@/lib/utils";

interface CheckStatusProps {
  brandColor: string;
  initialTicketId: string | null;
  initialEmail: string | null;
  setCurrentView: (view: WidgetView) => void;
  setTicketId: (id: string | null) => void;
  setTicketEmail: (email: string | null) => void;
}

export default function CheckStatus({
  brandColor,
  initialTicketId,
  initialEmail,
  setCurrentView,
  setTicketId,
  setTicketEmail,
}: CheckStatusProps) {
  const [ticketIdInput, setTicketIdInput] = useState(initialTicketId || "");
  const [emailInput, setEmailInput] = useState(initialEmail || "");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!ticketIdInput.trim()) {
      setError("Please enter your ticket ID");
      return;
    }

    if (!emailInput.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await checkTicketStatus(ticketIdInput.trim(), emailInput.trim());

    if (result.success && result.data) {
      setTicketId(ticketIdInput.trim());
      setTicketEmail(emailInput.trim().toLowerCase());
      setCurrentView("ticket-status");
    } else {
      setError(result.error || "Ticket not found");
    }

    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${brandColor}15` }}
        >
          <Search className="w-8 h-8" style={{ color: brandColor }} />
        </motion.div>

        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-bold text-gray-900 mb-2"
        >
          Check Ticket Status
        </motion.h2>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500"
        >
          Enter your ticket ID and email to view status
        </motion.p>
      </div>

      {/* Form */}
      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Ticket ID Field */}
        <div>
          <label
            htmlFor="ticketId"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Ticket ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="ticketId"
            value={ticketIdInput}
            onChange={(e) => {
              setTicketIdInput(e.target.value);
              setError(null);
            }}
            placeholder="Enter your ticket ID"
            disabled={isLoading}
            className={cn(
              "w-full px-4 py-2.5 border border-gray-200 rounded-xl",
              "focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400",
              "transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
            )}
          />
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={emailInput}
            onChange={(e) => {
              setEmailInput(e.target.value);
              setError(null);
            }}
            placeholder="Enter your email"
            disabled={isLoading}
            className={cn(
              "w-full px-4 py-2.5 border border-gray-200 rounded-xl",
              "focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400",
              "transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
            )}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full py-3 px-4 rounded-xl text-white font-medium",
            "flex items-center justify-center gap-2",
            "transition-all duration-200",
            "disabled:opacity-70 disabled:cursor-not-allowed",
            "hover:opacity-90 active:scale-[0.98]"
          )}
          style={{ backgroundColor: brandColor }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              View Status
            </>
          )}
        </button>
      </motion.form>

      {/* Help Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-auto pt-6 pb-3 text-center text-xs text-gray-400"
      >
        Can't find your ticket ID? Check your email for the confirmation.
      </motion.p>
    </motion.div>
  );
}