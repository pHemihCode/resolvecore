"use client"
import { ChevronDown,ChevronUp } from "lucide-react";
interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
}
export const StatCard = ({ title, value, change, isPositive, icon }: StatCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-gray-900">{value}</span>
        {change && (
          <span className={`flex items-center text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ChevronUp size={12} className="mr-0.5" /> : <ChevronDown size={12} className="mr-0.5" />}
            {isPositive ? '+' : ''}{change}
          </span>
        )}
      </div>
    </div>
  );
};