// components/dashboard/TicketFilters.tsx
"use client";

import { cn } from "@/lib/utils";
import type { TicketStatus } from "@/types/widget";

interface TicketFiltersProps {
  currentStatus: TicketStatus | undefined;
  onStatusChange: (status: TicketStatus | undefined) => void;
  counts?: {
    all: number;
    open: number;
    in_progress: number;
    resolved: number;
  };
}

const FILTERS: { label: string; value: TicketStatus | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
];

export default function TicketFilters({
  currentStatus,
  onStatusChange,
  counts,
}: TicketFiltersProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {FILTERS.map((filter) => {
        const count = counts
          ? filter.value
            ? counts[filter.value]
            : counts.all
          : null;

        return (
          <button
            key={filter.label}
            onClick={() => onStatusChange(filter.value)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              currentStatus === filter.value
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {filter.label}
            {count !== null && (
              <span
                className={cn(
                  "ml-2 px-2 py-0.5 rounded-full text-xs",
                  currentStatus === filter.value
                    ? "bg-white/20"
                    : "bg-gray-200"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}