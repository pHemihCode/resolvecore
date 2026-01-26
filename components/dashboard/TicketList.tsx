// components/dashboard/TicketsList.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Filter,
  ChevronRight,
  Inbox,
  RefreshCw,
  MoreHorizontal,
  ArrowUpRight,
  Clock,
  User,
  Tag,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import type { TicketStatus } from "@/types/widget";

// --- Types ---
interface Ticket {
  _id: string;
  name: string;
  email: string;
  message: string;
  category: string;
  status: TicketStatus;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const STATUS_OPTIONS = [
  { value: "", label: "All Tickets" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

const STATUS_STYLES = {
  open: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  in_progress: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  resolved: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  default: { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" },
};

export default function TicketsList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTickets = async (showLoader = true) => {
    if (showLoader) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      params.set("page", String(currentPage));
      params.set("limit", "20");

      const response = await fetch(`/api/admin/tickets?${params}`);
      const data = await response.json();

      if (data.tickets) {
        setTickets(data.tickets);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, currentPage]);

  // Client-side filtering for search
  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Helper for status styling
  const getStatusStyle = (status: string) => {
    return (
      STATUS_STYLES[status as keyof typeof STATUS_STYLES] ||
      STATUS_STYLES.default
    );
  };

  return (
    <div className="w-full max-w-400 mx-auto px-4 sm:px-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Support Tickets
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and respond to customer inquiries
          </p>
        </div>
        <button
          onClick={() => fetchTickets(false)}
          disabled={isRefreshing}
          className="self-start sm:self-center flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span>Sync</span>
        </button>
      </div>

      {/* --- CONTROLS --- */}
      <div className="mb-6 space-y-4">
        <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-indigo-100 rounded-lg text-sm transition-all outline-none"
            />
          </div>

          {/* Filters Row */}
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            {/* Status Select */}
            <div className="relative min-w-35">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 z-10" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 appearance-none focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer hover:border-gray-300 transition-colors"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronRight className="w-3 h-3 text-gray-400 rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 animate-pulse"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                <div className="flex items-center gap-3 sm:w-[25%] shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="h-4 w-24 bg-gray-100 rounded-md" />
                    <div className="h-3 w-32 bg-gray-100 rounded-md" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 pr-4 space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-4 w-1/3 bg-gray-100 rounded-md" />
                  </div>
                  <div className="h-3 w-3/4 bg-gray-100 rounded-md" />
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:w-[25%] shrink-0 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100">
                  <div className="h-6 w-20 bg-gray-100 rounded-full" />
                  <div className="hidden sm:block h-3 w-12 bg-gray-100 rounded-md" />
                  <div className="w-5 h-5 bg-gray-100 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            No tickets found
          </h3>
          <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
            {searchQuery || statusFilter
              ? "Try adjusting your filters to find what you're looking for."
              : "New support requests will appear here."}
          </p>
          {(searchQuery || statusFilter) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("");
              }}
              className="mt-4 text-sm text-indigo-600 font-medium hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filteredTickets.map((ticket) => {
              const statusStyle = getStatusStyle(ticket.status);

              return (
                <motion.div
                  key={ticket._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={`/tickets/${ticket._id}`}
                    className="group block bg-white hover:bg-gray-50/80 rounded-xl border border-gray-200 p-4 sm:p-5 transition-all hover:shadow-sm hover:border-gray-300 relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                      <div className="flex items-center gap-3 sm:w-[25%] shrink-0">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 shrink-0">
                          {ticket.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {ticket.name}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">
                            {ticket.email}
                          </p>
                        </div>
                      </div>

                      {/* Message Preview Section */}
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900 truncate max-w-50 sm:max-w-md">
                            {ticket.category} Inquiry
                          </span>
                          {/* Mobile Date */}
                          <span className="sm:hidden ml-auto text-xs text-gray-400 whitespace-nowrap">
                            {formatRelativeTime(ticket.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate group-hover:text-gray-700 transition-colors">
                          {ticket.message}
                        </p>
                      </div>

                      {/* Meta & Status Section */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:w-[25%] shrink-0 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100">
                        {/* Status Badge */}
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-transparent ${statusStyle.bg} ${statusStyle.text}`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                          />
                          {ticket.status.replace("_", " ")}
                        </div>

                        {/* Desktop Date & Arrow */}
                        <div className="flex items-center gap-4">
                          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
                            <Clock className="w-3.5 h-3.5" />
                            {formatRelativeTime(ticket.createdAt)}
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* --- PAGINATION --- */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" /> Previous
          </button>

          <span className="text-sm font-medium text-gray-600">
            Page {currentPage} of {pagination.pages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(pagination.pages, p + 1))
            }
            disabled={currentPage === pagination.pages}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
