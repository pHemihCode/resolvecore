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

// Types
type TicketData = {
  id: string;
  customer: string;
  subject: string;
  status: "open" | "resolved" | "pending" | "on_hold";
  priority: "urgent" | "high" | "medium" | "low";
  createdDate: string;
};

type StatCardType = {
  title: string;
  value: number | string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
};

type FilterOption = {
  label: string;
  value: string;
};

// ===== STAT CARD COMPONENT =====
const StatCard = ({
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

// ===== FILTER PAGINATION COMPONENT =====
interface FilterPaginationProps {
  items: FilterOption[];
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const FilterPagination = ({
  items,
  itemsPerPage,
  currentPage,
  onPageChange,
}: FilterPaginationProps) => {
  const totalPages = Math.ceil(items.length / itemsPerPage);

  if (items.length <= itemsPerPage) return null;

  return (
    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
      <div className="text-xs text-gray-500">
        Showing{" "}
        {(currentPage - 1) * itemsPerPage + 1}-
        {Math.min(currentPage * itemsPerPage, items.length)} of {items.length}{" "}
        options
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`p-1 rounded ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 cursor-pointer"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const pageNum = i + 1;
            const actualPage = pageNum;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(actualPage)}
                className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                  currentPage === actualPage
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-label={`Go to page ${actualPage}`}
              >
                {actualPage}
              </button>
            );
          })}
          {totalPages > 5 && currentPage > 3 && (
            <>
              <span className="text-gray-500 flex items-center px-1">...</span>
              <button
                onClick={() => onPageChange(totalPages)}
                className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                  currentPage === totalPages
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-label={`Go to page ${totalPages}`}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`p-1 rounded ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 cursor-pointer"
          }`}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// ===== FILTER SECTION COMPONENT =====
interface FilterSectionProps {
  title: string;
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
}

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
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              selectedValue === option.value
                ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
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

// ===== STATUS BADGE COMPONENT =====
interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
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

// ===== PRIORITY BADGE COMPONENT =====
interface PriorityBadgeProps {
  priority: string;
}

const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
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

// ===== EMPTY STATE COMPONENT =====
interface EmptyTicketsStateProps {
  onClearFilters: () => void;
}

const EmptyTicketsState = ({ onClearFilters }: EmptyTicketsStateProps) => (
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

// ===== MAIN DASHBOARD COMPONENT =====
export default function DashboardPage() {
  // ===== STATS DATA =====
  const stats: StatCardType[] = [
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
  ];

  // ===== STATE MANAGEMENT =====
  const [searchTerm, setSearchTerm] = useState("");
  
  // Applied filters (these affect the table)
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  
  // Temporary filters (used in dropdown, not applied until "Apply Filters" is clicked)
  const [tempStatusFilter, setTempStatusFilter] = useState("All");
  const [tempPriorityFilter, setTempPriorityFilter] = useState("All");
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusPage, setStatusPage] = useState(1);
  const [priorityPage, setPriorityPage] = useState(1);
  const itemsPerPage = 4;

  // ===== TICKET DATA =====
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
    {
      id: "3",
      customer: "Mike Johnson",
      subject: "Feature request: Dark mode support",
      status: "pending",
      priority: "low",
      createdDate: "2024-05-18T16:45:00Z",
    },
    {
      id: "4",
      customer: "Sarah Lee",
      subject: "API integration authentication error",
      status: "on_hold",
      priority: "urgent",
      createdDate: "2024-05-17T11:20:00Z",
    },
    {
      id: "5",
      customer: "David Wilson",
      subject: "Password reset link not arriving",
      status: "resolved",
      priority: "medium",
      createdDate: "2024-05-16T08:50:00Z",
    },
    {
      id: "6",
      customer: "Emily Davis",
      subject: "Subscription renewal failed",
      status: "open",
      priority: "high",
      createdDate: "2024-05-15T13:40:00Z",
    },
    {
      id: "7",
      customer: "Robert Brown",
      subject: "Feature not working as expected",
      status: "pending",
      priority: "medium",
      createdDate: "2024-05-14T10:25:00Z",
    },
    {
      id: "8",
      customer: "Alice Johnson",
      subject: "Billing inquiry",
      status: "open",
      priority: "medium",
      createdDate: "2024-05-13T14:20:00Z",
    },
    {
      id: "9",
      customer: "Tom Wilson",
      subject: "Export data request",
      status: "pending",
      priority: "medium",
      createdDate: "2024-05-12T09:45:00Z",
    },
    {
      id: "10",
      customer: "Emma Brown",
      subject: "How to enable dark mode",
      status: "resolved",
      priority: "low",
      createdDate: "2024-05-11T16:30:00Z",
    },
    {
      id: "11",
      customer: "Michael Davis",
      subject: "Security vulnerability found",
      status: "on_hold",
      priority: "urgent",
      createdDate: "2024-05-10T11:15:00Z",
    },
    {
      id: "12",
      customer: "Sarah Miller",
      subject: "Can't access billing settings",
      status: "open",
      priority: "high",
      createdDate: "2024-05-09T13:50:00Z",
    },
  ];

  // ===== FILTER OPTIONS =====
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

  // ===== FILTER AND SEARCH LOGIC =====
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

  // ===== APPLY FILTERS FUNCTION =====
  const applyFilters = () => {
    setStatusFilter(tempStatusFilter);
    setPriorityFilter(tempPriorityFilter);
    setIsFilterOpen(false);
  };

  // ===== CLEAR FILTERS FUNCTION =====
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

  // ===== CLEAR TEMP FILTERS FUNCTION =====
  const clearTempFilters = () => {
    setTempStatusFilter("All");
    setTempPriorityFilter("All");
    setStatusPage(1);
    setPriorityPage(1);
  };

  // ===== FORMAT DATE FUNCTION =====
  const formatTicketDate = (date: string | Date) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  // ===== SYNC TEMP FILTERS WHEN DROPDOWN OPENS =====
  useEffect(() => {
    if (isFilterOpen) {
      setTempStatusFilter(statusFilter);
      setTempPriorityFilter(priorityFilter);
    }
  }, [isFilterOpen, statusFilter, priorityFilter]);

  // ===== CLOSE FILTER ON OUTSIDE CLICK =====
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isFilterOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest(".filter-container")) {
          // Reset temp filters to applied filters when closing without applying
          setTempStatusFilter(statusFilter);
          setTempPriorityFilter(priorityFilter);
          setIsFilterOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen, statusFilter, priorityFilter]);

  // ===== ACTIVE FILTERS COUNT (excludes search) =====
  const activeFiltersCount =
    (statusFilter !== "All" ? 1 : 0) +
    (priorityFilter !== "All" ? 1 : 0);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* ===== PAGE HEADER ===== */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your support tickets and performance metrics
        </p>
      </div>

      {/* ===== STATS GRID ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* ===== RECENT TICKETS SECTION ===== */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* ===== TABLE HEADER WITH SEARCH AND FILTERS ===== */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Tickets</h2>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* ===== SEARCH INPUT ===== */}
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

              {/* ===== FILTER BUTTON WITH DROPDOWN ===== */}
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

                {/* ===== FILTER DROPDOWN WITH PAGINATION ===== */}
                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div
                      // Fixed positioning ensures the dropdown doesn't move when the table height changes
                      className="fixed right-4 md:right-14 top-[320px] sm:top-[335px] w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 origin-top-right"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                    >
                      <div className="p-4">
                        {/* ===== STATUS FILTER WITH PAGINATION ===== */}
                        <FilterSection
                          title="Status"
                          options={statusOptions}
                          selectedValue={tempStatusFilter}
                          onSelect={setTempStatusFilter}
                          currentPage={statusPage}
                          onPageChange={setStatusPage}
                        />

                        {/* ===== PRIORITY FILTER WITH PAGINATION ===== */}
                        <FilterSection
                          title="Priority"
                          options={priorityOptions}
                          selectedValue={tempPriorityFilter}
                          onSelect={setTempPriorityFilter}
                          currentPage={priorityPage}
                          onPageChange={setPriorityPage}
                        />

                        {/* ===== FILTER ACTIONS ===== */}
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

          {/* ===== ACTIVE FILTERS DISPLAY ===== */}
          {(statusFilter !== "All" ||
            priorityFilter !== "All" ||
            searchTerm) && (
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
        </div>

        {/* ===== TICKETS TABLE ===== */}
        {filteredTickets.length === 0 ? (
          <EmptyTicketsState onClearFilters={clearFilters} />
        ) : (
          <>
            {/* ===== DESKTOP TABLE VIEW ===== */}
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

            {/* ===== MOBILE CARD VIEW ===== */}
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

        {/* ===== TABLE FOOTER ===== */}
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