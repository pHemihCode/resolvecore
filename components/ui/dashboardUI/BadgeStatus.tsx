"use client"

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig: Record<string, { color: string; label: string }> = {
    open: { color: "bg-red-100 text-red-800", label: "Open" },
    resolved: { color: "bg-green-100 text-green-800", label: "Resolved" },
    pending: { color: "bg-blue-100 text-blue-800", label: "Pending" },
    on_hold: { color: "bg-yellow-100 text-yellow-800", label: "On Hold" },
  };

  const config =
    statusConfig[status] || { color: "bg-gray-100 text-gray-800", label: status };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};