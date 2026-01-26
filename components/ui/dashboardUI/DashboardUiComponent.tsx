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
  SlidersHorizontal,
  ChevronDown,
  X,
  Loader2, // Added Loader
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StatCard } from "@/components/ui/dashboardUI/StatCard";
import { FilterPagination } from "@/components/ui/dashboardUI/FilterPagination";
import { PriorityBadge } from "@/components/ui/dashboardUI/PriorityBadge";
import { EmptyTicketsState } from "@/components/ui/dashboardUI/EmptyTicketState";
import { StatusBadge } from "@/components/ui/dashboardUI/BadgeStatus";
import { useRouter } from "next/navigation";

// ---------- Types ----------
// Updated to match what we map from the API
type TicketData = {
  id: string;
  customer: string;
  subject: string; // We will map 'message' or 'category' here if subject doesn't exist
  status: "open" | "resolved" | "pending" | "on_hold"; // "in_progress" mapped to "pending"
  priority: "urgent" | "high" | "medium" | "low";
  createdDate: string;
  responseTimeMs: number | null;
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
export default function DashboardUiComponent({ session }: { session: any }) {
  /* ---------- STATE ---------- */
  const [tickets, setTickets] = useState<TicketData[]>([]); // Real Data State
  const [isLoading, setIsLoading] = useState(true); // Loading State
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [tempStatusFilter, setTempStatusFilter] = useState("All");
  const [tempPriorityFilter, setTempPriorityFilter] = useState("All");
  const [statusPage, setStatusPage] = useState(1);
  const [priorityPage, setPriorityPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter()
  /* ---------- DATA FETCHING ---------- */
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/admin/tickets");
        if (response.ok) {
          const data = await response.json();
          
          const mappedTickets: TicketData[] = data.tickets.map((t: any) => {
            // LOGIC: Find the first message from 'support' in history
            const firstSupportReply = t.history?.find(
              (h: any) => h.author === 'support' && h.type === 'message'
            );

            // Calculate milliseconds difference
            let responseTimeMs = null;
            if (firstSupportReply) {
              const created = new Date(t.createdAt).getTime();
              const replied = new Date(firstSupportReply.createdAt).getTime();
              responseTimeMs = replied - created;
            }

            return {
              id: t._id,
              customer: t.name,
              subject: t.message.substring(0, 50) + (t.message.length > 50 ? "..." : ""), 
              status: t.status === "in_progress" ? "pending" : t.status, 
              priority: t.category === "Technical" ? "high" : "medium", 
              createdDate: t.createdAt,
              responseTimeMs: responseTimeMs, // Store it
            };
          });
          setTickets(mappedTickets);
        }
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  /* ---------- OPTIONS ---------- */
  const statusOptions: FilterOption[] = [
    { label: "Open", value: "open" },
    { label: "Resolved", value: "resolved" },
    { label: "Pending", value: "pending" },
    // { label: "On Hold", value: "on_hold" }, // DB Schema doesn't have on_hold yet
  ];

  const priorityOptions: FilterOption[] = [
    { label: "Urgent", value: "urgent" },
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
  ];

  /* ---------- FILTER/SEARCH LOGIC ---------- */
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
      const matchesPriority =
        priorityFilter === "All" || ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

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

  const formatTicketDate = (date: string | Date) => {
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch (e) {
      return "Invalid Date";
    }
  }

  /* ---------- HELPER: FORMAT DURATION ---------- */
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  /* ---------- STATS CALCULATION ---------- */
  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === "open").length;
    const resolved = tickets.filter(t => t.status === "resolved").length;
    
    // Calculate Average Response Time
    const ticketsWithResponse = tickets.filter(t => t.responseTimeMs !== null);
    let avgResponseString = "N/A";
    
    if (ticketsWithResponse.length > 0) {
      const totalResponseTime = ticketsWithResponse.reduce((acc, curr) => acc + (curr.responseTimeMs || 0), 0);
      const avgMs = totalResponseTime / ticketsWithResponse.length;
      avgResponseString = formatDuration(avgMs);
    }

    return { total, open, resolved, avgResponseString };
  }, [tickets]);
  
  /* ---------- CONTROL OUTSIDE CLICK ---------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isFilterOpen) return;
      const target = e.target as HTMLElement;
      if (!target.closest(".filter-container")) {
        setTempStatusFilter(statusFilter);
        setTempPriorityFilter(priorityFilter);
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen, statusFilter, priorityFilter]);

  const activeFiltersCount =
    (statusFilter !== "All" ? 1 : 0) + (priorityFilter !== "All" ? 1 : 0);

  /* ---------- RENDER ---------- */
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
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
            value: stats.total,
            change: "0%", // Placeholder
            isPositive: true,
            icon: <Ticket size={22} />,
          },
          {
            title: "Open Tickets",
            value: stats.open,
            change: "0%",
            isPositive: false,
            icon: <AlertCircle size={22} />,
          },
          {
            title: "Resolved Tickets",
            value: stats.resolved,
            change: "0%",
            isPositive: true,
            icon: <CheckCircle size={22} />,
          },
          {
            title: "Avg Response Time",
            value: stats.avgResponseString,
            change: "-",
            isPositive: true,
            icon: <Clock size={22} />,
          },
        ].map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Recent tickets wrapper */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4 border-b border-gray-100 flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Tickets
          </h2>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
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
                    className="absolute right-8 md:right-0 top-10 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 origin-top-right"
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
            className="flex flex-wrap items-center gap-2 mt-3 px-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-xs text-gray-500">Active:</span>
            {/* ... (Keep existing active filter pills) ... */}
            <button
              onClick={clearFilters}
              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              <X size={12} />
              <span>Clear All</span>
            </button>
          </motion.div>
        )}

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-500" />
            <p className="text-sm">Loading tickets...</p>
          </div>
        ) : (
          /* Tickets table */
          <>
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
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                          whileHover={{ backgroundColor: "#f9fafb" }}
                          onClick={() => router.push(`/tickets/${ticket.id}`)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {ticket.customer}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
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
                      className="block p-4 border-b mb-2 border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-gray-900 text-sm truncate w-2/3">
                          {ticket.subject}
                        </h4>
                        <StatusBadge status={ticket.status} />
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Customer:</span>
                          <span className="text-gray-900 font-medium">{ticket.customer}</span>
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
          </>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredTickets.length} of {tickets.length} tickets
          </p>
          <Link
            href="/tickets"
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
          >
            <span className="hidden md:inline">View All Tickets </span>
            <span className="inline md:hidden">View All</span>
            <ChevronDown size={16} className="rotate-270" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}