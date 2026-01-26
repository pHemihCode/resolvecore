// components/widget/screens/TicketStatus.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { checkTicketStatus } from "@/lib/api/widget-api";
import type { TicketStatus as TicketStatusType, WidgetView } from "@/types/widget";
import { formatRelativeTime, getStatusLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TicketStatusProps {
  ticketId: string;
  email: string;
  brandColor: string;
  setCurrentView: (view: WidgetView) => void;
}

interface StatusData {
  status: TicketStatusType;
  createdAt: string;
  updatedAt?: string;
}

const STATUS_CONFIG = {
  open: {
    icon: Clock,
    label: "Open",
    description: "Your ticket is awaiting review",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    iconColor: "text-blue-600",
  },
  in_progress: {
    icon: Loader2,
    label: "In Progress",
    description: "We're working on your request",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    iconColor: "text-yellow-600",
    animate: true,
  },
  resolved: {
    icon: CheckCircle,
    label: "Resolved",
    description: "Your ticket has been resolved",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    iconColor: "text-green-600",
  },
};

const TIMELINE_STEPS = ["open", "in_progress", "resolved"] as const;

export default function TicketStatus({
  ticketId,
  email,
  brandColor,
  setCurrentView,
}: TicketStatusProps) {
  const [data, setData] = useState<StatusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async (showRefreshLoader = false) => {
    if (showRefreshLoader) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    const result = await checkTicketStatus(ticketId, email);

    if (result.success && result.data) {
      setData({
        status: result.data.status,
        createdAt: result.data.createdAt,
      });
    } else {
      setError(result.error || "Failed to load status");
    }

    setIsLoading(false);
    setIsRefreshing(false);
  }, [ticketId, email]);

  // Initial fetch
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStatus(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchStatus]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <p className="text-gray-900 font-medium mb-2">Unable to load status</p>
        <p className="text-gray-500 text-sm mb-4">{error}</p>
        <button
          onClick={() => fetchStatus()}
          className="text-indigo-600 hover:underline text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data) return null;

  const statusConfig = STATUS_CONFIG[data.status];
  const StatusIcon = statusConfig.icon;
  const currentStepIndex = TIMELINE_STEPS.indexOf(data.status);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      {/* Status Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "rounded-2xl p-6 text-center mb-6",
          statusConfig.bgColor
        )}
      >
        <div className="flex justify-center mb-4">
          <div className={cn(
            "w-16 h-16 rounded-full bg-white flex items-center justify-center",
            statusConfig.iconColor
          )}>
            <StatusIcon
              className={cn(
                "w-8 h-8",
                statusConfig && "animate-spin"
              )}
            />
          </div>
        </div>

        <h3 className={cn("text-xl font-bold mb-1", statusConfig.textColor)}>
          {statusConfig.label}
        </h3>
        <p className="text-gray-600 text-sm">{statusConfig.description}</p>
      </motion.div>

      {/* Ticket Info */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-50 rounded-xl p-4 mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">Ticket ID</span>
          <span className="font-mono text-sm text-gray-900">
            {ticketId.slice(0, 8)}...
          </span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">Created</span>
          <span className="text-sm text-gray-900">
            {formatRelativeTime(data.createdAt)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Email</span>
          <span className="text-sm text-gray-900">{email}</span>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h4 className="text-sm font-medium text-gray-700 mb-4">Progress</h4>
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200" />
          <div
            className="absolute left-4 top-4 w-0.5 transition-all duration-500"
            style={{
              height: `${(currentStepIndex / (TIMELINE_STEPS.length - 1)) * 100}%`,
              backgroundColor: brandColor,
            }}
          />

          {/* Steps */}
          <div className="space-y-4">
            {TIMELINE_STEPS.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = step === data.status;
              const stepConfig = STATUS_CONFIG[step];

              return (
                <div key={step} className="flex items-center gap-4">
                  <div
                    className={cn(
                      "relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all",
                      isCompleted
                        ? isCurrent
                          ? stepConfig.bgColor
                          : "bg-green-100"
                        : "bg-gray-100"
                    )}
                  >
                    {isCompleted && !isCurrent ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <span
                        className={cn(
                          "text-xs font-medium",
                          isCompleted ? stepConfig.textColor : "text-gray-400"
                        )}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm",
                      isCompleted ? "text-gray-900" : "text-gray-400"
                    )}
                  >
                    {getStatusLabel(step)}
                  </span>
                  {isCurrent && (
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Refresh Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-auto"
      >
        <button
          onClick={() => fetchStatus(true)}
          disabled={isRefreshing}
          className="w-full py-2.5 px-4 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <RefreshCw
            className={cn("w-4 h-4", isRefreshing && "animate-spin")}
          />
          {isRefreshing ? "Refreshing..." : "Refresh Status"}
        </button>

        <p className="text-center text-xs text-gray-400 mt-3">
          Auto-refreshes every 30 seconds
        </p>
      </motion.div>
    </motion.div>
  );
}