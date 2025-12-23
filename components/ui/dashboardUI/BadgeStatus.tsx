"use client"
type TicketStatus = "open" | "resolved" | "pending" | "on_hold";
export const StatusBadge = ({ status }: { status: TicketStatus }) => {
  const statusConfig = {
    open: { label: "Open", color: "bg-amber-100 text-amber-800" },
    resolved: { label: "Resolved", color: "bg-green-100 text-green-800" },
    pending: { label: "Pending", color: "bg-blue-100 text-blue-800" },
    on_hold: { label: "On Hold", color: "bg-purple-100 text-purple-800" },
  };

  const config = statusConfig[status] || statusConfig.open;
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};