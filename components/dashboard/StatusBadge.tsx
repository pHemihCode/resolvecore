// components/dashboard/StatusBadge.tsx
"use client";

import { cn } from "@/lib/utils";
import { getStatusColor, getStatusLabel } from "@/lib/utils";
import type { TicketStatus } from "@/types/widget";

interface StatusBadgeProps {
  status: TicketStatus;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        getStatusColor(status),
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
}