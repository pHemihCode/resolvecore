"use client"

interface PriorityBadgeProps {
  priority: string;
}
export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const priorityConfig: Record<string, { color: string; label: string }> = {
    urgent: { color: "bg-red-500", label: "Urgent" },
    high: { color: "bg-orange-500", label: "High" },
    medium: { color: "bg-yellow-500", label: "Medium" },
    low: { color: "bg-green-500", label: "Low" },
  };

  const config =
    priorityConfig[priority] || { color: "bg-gray-500", label: priority };

  return (
    <div className="flex items-center">
      <div className={`h-2 w-2 rounded-full ${config.color} mr-2`}></div>
      <span className="text-sm text-gray-700">{config.label}</span>
    </div>
  );
};