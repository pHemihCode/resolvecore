"use client"
import { motion, AnimatePresence } from "framer-motion";

type StatCardType = {
  title: string;
  value: number | string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
};

export const StatCard = ({
  title,
  value,
  change,
  isPositive,
  icon,
}: StatCardType) => (
  <motion.div
    className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all hover:shadow-md"
    whileHover={{ y: -5 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        {change && (
          <div
            className={`flex items-center mt-2 text-xs font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            <span>{isPositive ? "↑" : "↓"} {change}</span>
            <span className="ml-1 text-gray-500">from last week</span>
          </div>
        )}
      </div>
      <div className="p-3 rounded-full bg-blue-50 text-blue-600">{icon}</div>
    </div>
  </motion.div>
);