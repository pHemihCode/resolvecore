"use client";                               
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Ticket,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  ChevronDown,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  StatCard,
} from "@/components/ui/dashboardUI/StatCard";
import { FilterPagination } from "@/components/ui/dashboardUI/FilterPagination";
import { PriorityBadge } from "@/components/ui/dashboardUI/PriorityBadge";
import { EmptyTicketsState } from "@/components/ui/dashboardUI/EmptyTicketState";
import { StatusBadge } from "@/components/ui/dashboardUI/BadgeStatus";

// ---------- Types ----------
type TicketData = {
  id: string;
  customer: string;
  subject: string;
  status: "open" | "resolved" | "pending" | "on_hold";
  priority: "urgent" | "high" | "medium" | "low";
  createdDate: string;
};

type FilterOption = {
  label: string;
  value: string;
};

// ---------- Shared UI snippets ----------
type FilterSectionProps = {
  title: string;
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
};

const FilterSection = ({
  title,
  options,
  selectedValue,
  onSelect,
  currentPage,
  onPageChange,
  itemsPerPage = 4,
}: FilterSectionProps) => {
  const paginatedOptions = options.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {title}
      </label>
      <div className="grid grid-cols-2 gap-2">
        {paginatedOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors
              ${selectedValue === option.value
                ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"}
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
      <FilterPagination
        items={options}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

// ---------- Dashboard client component ----------
export default function DashboardUiComponent({
  session,
}: {
  session: any;      // replace `any` with your actual session type if you have one
}) {
  /* ---------- STATE ---------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [tempStatusFilter, setTempStatusFilter] = useState("All");
  const [tempPriorityFilter, setTempPriorityFilter] = useState("All");
  const [statusPage, setStatusPage] = useState(1);
  const [priorityPage, setPriorityPage] = useState(1);
  const itemsPerPage = 4;
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  /* ---------- DUMMY DATA ---------- */
  const recentTickets: TicketData[] = [
    {
      id: "1",
      customer: "John Doe",
      subject: "Login issues with my account",
      status: "open",
      priority: "medium",
      createdDate: "2024-05-20T14:30:00Z",
    },
    {
      id: "2",
      customer: "Jane Smith",
      subject: "Payment failure on subscription",
      status: "resolved",
      priority: "high",
      createdDate: "2024-05-19T09:15:00Z",
    },
    // … (copy the rest of your ticket objects here) …
  ];

  const statusOptions: FilterOption[] = [
    { label: "Open", value: "open" },
    { label: "Resolved", value: "resolved" },
    { label: "Pending", value: "pending" },
    { label: "On Hold", value: "on_hold" },
  ];

  const priorityOptions: FilterOption[] = [
    { label: "Urgent", value: "urgent" },
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ];

  /* ---------- FILTER/SEARCH LOGIC ---------- */
  const filteredTickets = useMemo(() => {
    return recentTickets.filter((ticket) => {
      const matchesSearch =
        ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
      const matchesPriority =
        priorityFilter === "All" || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchTerm, statusFilter, priorityFilter]);

  const applyFilters = () => {
    setStatusFilter(tempStatusFilter);
    setPriorityFilter(tempPriorityFilter);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setTempStatusFilter("All");
    setTempPriorityFilter("All");
    setStatusPage(1);
    setPriorityPage(1);
    setIsFilterOpen(false);
  };

  const clearTempFilters = () => {
    setTempStatusFilter("All");
    setTempPriorityFilter("All");
    setStatusPage(1);
    setPriorityPage(1);
  };

  const formatTicketDate = (date: string | Date) =>
    format(new Date(date), "MMM dd, yyyy");

  /* ---------- CONTROL OUTSIDE CLICK ---------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isFilterOpen) return;
      const target = e.target as HTMLElement;
      if (!target.closest(".filter-container")) {
        // Reset temp filters if we close without clicking "Apply"
        setTempStatusFilter(statusFilter);
        setTempPriorityFilter(priorityFilter);
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen, statusFilter, priorityFilter]);

  /* ---------- ACTIVE FILTER DISPLAY ---------- */
  const activeFiltersCount =
    (statusFilter !== "All" ? 1 : 0) + (priorityFilter !== "All" ? 1 : 0);

  /* ---------- RENDER ---------- */
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your support tickets and performance metrics
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: "Total Tickets",
            value: 142,
            change: "8%",
            isPositive: true,
            icon: <Ticket size={22} />,
          },
          {
            title: "Open Tickets",
            value: 24,
            change: "2%",
            isPositive: false,
            icon: <AlertCircle size={22} />,
          },
          {
            title: "Resolved Tickets",
            value: 118,
            change: "10%",
            isPositive: true,
            icon: <CheckCircle size={22} />,
          },
          {
            title: "Avg Response Time",
            value: "12m",
            change: "-2m",
            isPositive: true,
            icon: <Clock size={22} />,
          },
        ].map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Recent tickets wrapper */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4 border-b border-gray-100 flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Tickets
          </h2>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* SEARCH INPUT */}
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search tickets..."
                className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* FILTER BUTTON */}
            <div className="relative filter-container">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors relative"
              >
                <SlidersHorizontal size={16} />
                <span>Filter</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* FILTER DROPDOWN */}
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    className="fixed right-4 md:right-14 top-[320px] sm:top-[335px] w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 origin-top-right"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                  >
                    <div className="p-4">
                      {/* STATUS FILTER */}
                      <FilterSection
                        title="Status"
                        options={statusOptions}
                        selectedValue={tempStatusFilter}
                        onSelect={setTempStatusFilter}
                        currentPage={statusPage}
                        onPageChange={setStatusPage}
                      />

                      {/* PRIORITY FILTER */}
                      <FilterSection
                        title="Priority"
                        options={priorityOptions}
                        selectedValue={tempPriorityFilter}
                        onSelect={setTempPriorityFilter}
                        currentPage={priorityPage}
                        onPageChange={setPriorityPage}
                      />

                      {/* FILTER ACTIONS */}
                      <div className="flex justify-between pt-2 border-t border-gray-100">
                        <button
                          onClick={clearTempFilters}
                          className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50"
                        >
                          Clear All
                        </button>
                        <button
                          onClick={applyFilters}
                          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Active‑filters strip */}
        {(statusFilter !== "All" || priorityFilter !== "All" || searchTerm) && (
          <motion.div
            className="flex flex-wrap items-center gap-2 mt-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-xs text-gray-500">Active:</span>

            {searchTerm && (
              <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm("")}>
                  <X size={12} />
                </button>
              </span>
            )}

            {statusFilter !== "All" && (
              <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                Status:{" "}
                {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                <button onClick={() => setStatusFilter("All")}>
                  <X size={12} />
                </button>
              </span>
            )}

            {priorityFilter !== "All" && (
              <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                Priority:{" "}
                {priorityFilter.charAt(0).toUpperCase() +
                  priorityFilter.slice(1)}
                <button onClick={() => setPriorityFilter("All")}>
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              onClick={clearFilters}
              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              <X size={12} />
              <span>Clear All</span>
            </button>
          </motion.div>
        )}

        {/* Tickets table */}
        {filteredTickets.length === 0 ? (
          <EmptyTicketsState onClearFilters={clearFilters} />
        ) : (
          <>
            {/* Desktop view */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Customer
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Subject
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Priority
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredTickets.map((ticket) => (
                    <motion.tr
                      key={ticket.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      whileHover={{ backgroundColor: "#f9fafb" }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ticket.customer}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                        {ticket.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTicketDate(ticket.createdDate)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden">
              {filteredTickets.map((ticket) => (
                <Link
                  href={`/tickets/${ticket.id}`}
                  key={ticket.id}
                  className="block p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {ticket.subject}
                    </h4>
                    <StatusBadge status={ticket.status} />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Customer:</span>
                      <span className="text-gray-900">{ticket.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Priority:</span>
                      <PriorityBadge priority={ticket.priority} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Created:</span>
                      <span className="text-gray-900">
                        {formatTicketDate(ticket.createdDate)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredTickets.length} of {recentTickets.length} tickets
          </p>
          <Link
            href="/tickets"
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
          >
            View All Tickets <ChevronDown size={16} className="rotate-270" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}