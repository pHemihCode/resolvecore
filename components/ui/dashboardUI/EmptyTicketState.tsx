"use client"
import { ArrowRight, Ticket } from "lucide-react";
import Link from "next/link"
interface EmptyTicketsStateProps {
  onClearFilters: () => void;
}

export const EmptyTicketsState = ({ onClearFilters }: EmptyTicketsStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="bg-gray-100 rounded-full p-6 mb-6">
      <Ticket className="h-12 w-12 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
    <p className="text-gray-500 max-w-md mb-6">
      Try adjusting your search or filter criteria to find what you're looking
      for.
    </p>
    <div className="flex gap-3">
      <button
        onClick={onClearFilters}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  </div>
);