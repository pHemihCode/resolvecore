"use client"
type TicketPriority = "low" | "medium" | "high" | "urgent";
export const PriorityBadge = ({ priority }: { priority: TicketPriority }) => {
  const priorityConfig = {
    low: { label: "Low", color: "bg-gray-100 text-gray-800" },
    medium: { label: "Medium", color: "bg-blue-100 text-blue-800" },
    high: { label: "High", color: "bg-orange-100 text-orange-800" },
    urgent: { label: "Urgent", color: "bg-red-100 text-red-800" },
  };

  const config = priorityConfig[priority] || priorityConfig.low;
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};