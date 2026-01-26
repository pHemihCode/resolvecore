// components/dashboard/TicketDetail.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Paperclip,
  CornerDownRight,
  Lock,
  EyeOff,
  MessageSquare,
  Info,
  ShieldAlert,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { TicketStatus } from "@/types/widget";
import { signOut } from "next-auth/react";

// --- Types ---
interface TicketHistoryItem {
  type: "message" | "note";
  content: string;
  author: "customer" | "support";
  createdAt: string;
}

interface Ticket {
  _id: string;
  name: string;
  email: string;
  message: string;
  category: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  history?: TicketHistoryItem[];
}

// --- Config ---
const STATUS_STYLES = {
  open: {
    label: "Open",
    icon: AlertCircle,
    bg: "bg-rose-100",
    text: "text-rose-700",
    border: "border-rose-200",
  },
  in_progress: {
    label: "In Progress",
    icon: Clock,
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
};

export default function TicketDetail({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Mobile Tab State
  const [mobileTab, setMobileTab] = useState<"conversation" | "details">(
    "conversation",
  );

  // Input States
  const [replyText, setReplyText] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/admin/tickets/${ticketId}`);
        if (response.status === 401) {
          await signOut({ callbackUrl: "/auth/sign-in" });
          return;
        }
        const data = await response.json();
        if (response.ok) setTicket(data);
        else setError(data.error || "Failed to load ticket");
      } catch (err) {
        setError("Failed to load ticket");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTicket();
  }, [ticketId]);

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!ticket || ticket.status === newStatus) return;
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) setTicket(await response.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSubmit = async () => {
    if (!replyText.trim()) return;
    setIsSending(true);
    try {
      const response = await fetch(`/api/admin/tickets/${ticketId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyText,
          type: isInternalNote ? "note" : "message",
        }),
      });

      if (response.ok) {
        const updatedTicket = await response.json();
        setTicket(updatedTicket);
        setReplyText("");
        setIsInternalNote(false);
      }
    } catch (err) {
      console.error("Failed to send", err);
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-400 mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-6">
            <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
          <div className="hidden lg:block h-96 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center p-6">
        <div className="text-center">
          <ShieldAlert className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Ticket Not Found</h2>
          <button
            onClick={() => router.back()}
            className="mt-4 text-indigo-600 font-medium hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const StatusConfig = STATUS_STYLES[ticket.status];

  return (
    <div className="w-full max-w-400 mx-auto px-4 sm:px-6 flex flex-col min-h-[calc(100vh-80px)]">
      {/* 1. Header Section */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to tickets
            </button>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight truncate pr-4">
              {ticket.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="font-mono text-gray-400">
                #{ticket._id.slice(-6).toUpperCase()}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1 text-xs sm:text-sm">
                <Clock className="w-3.5 h-3.5" />
                {formatDate(ticket.createdAt)}
              </span>
            </div>
          </div>

          {/* Desktop Status Badge */}
          <div className="hidden sm:block shrink-0 self-start">
            <div
              className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-semibold border ${StatusConfig.bg} ${StatusConfig.text} ${StatusConfig.border}`}
            >
              <StatusConfig.icon className="w-4 h-4" />
              {StatusConfig.label}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE TABS SWITCHER */}
      <div className="lg:hidden flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setMobileTab("conversation")}
          className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${mobileTab === "conversation" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`}
        >
          <MessageSquare className="w-4 h-4" />
          Conversation
        </button>
        <button
          onClick={() => setMobileTab("details")}
          className={`flex-1 pb-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${mobileTab === "details" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`}
        >
          <Info className="w-4 h-4" />
          Details & Status
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 flex-1 relative">
        {/* LEFT COLUMN: The Thread */}
        <section
          className={`
           relative flex flex-col min-w-0 pb-24 sm:pb-0 
           ${mobileTab === "conversation" ? "block" : "hidden lg:block"}
        `}
        >
          {/* Timeline Line (Desktop Only) */}
          <div className="absolute left-6 top-12 bottom-0 w-px bg-gray-200 z-0 hidden sm:block" />

          {/* 1. Original Request */}
          <div className="relative z-10 mb-6 sm:mb-8 sm:pl-16 group">
            {/* Desktop Avatar */}
            <div className="absolute left-0 top-0 hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 border-gray-100 text-gray-500 font-bold shadow-sm">
              {ticket.name.charAt(0).toUpperCase()}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Mobile Avatar */}
                  <div className="sm:hidden w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                    {ticket.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                      Original Request
                    </span>
                    <span className="text-sm font-bold text-gray-900 block sm:hidden">
                      {ticket.name}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                  {ticket.category}
                </div>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                {ticket.message}
              </p>
            </div>
          </div>

          {/* 2. History Loop */}
          <div className="space-y-6 sm:space-y-8 mb-4">
            {ticket.history?.map((item, index) => {
              const isNote = item.type === "note";
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative sm:pl-16`}
                >
                  <div
                    className={`absolute left-0 top-0 hidden sm:flex h-12 w-12 items-center justify-center rounded-full border-4 border-gray-50 z-10 ${
                      isNote
                        ? "bg-amber-100 text-amber-700"
                        : "bg-indigo-600 text-white"
                    }`}
                  >
                    {isNote ? (
                      <Lock className="w-5 h-5" />
                    ) : (
                      <div className="text-xs font-bold">SUP</div>
                    )}
                  </div>

                  <div
                    className={`rounded-2xl border p-5 sm:p-6 shadow-sm relative ${
                      isNote
                        ? "bg-amber-50/40 border-amber-200"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {isNote && (
                      <div className="absolute -top-3 left-4 sm:left-6 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 uppercase tracking-wide flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Internal Note
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`sm:hidden w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isNote ? "bg-amber-200 text-amber-800" : "bg-indigo-600 text-white"}`}
                        >
                          {isNote ? <Lock className="w-3 h-3" /> : "S"}
                        </div>
                        <span
                          className={`text-sm font-bold ${isNote ? "text-amber-900" : "text-gray-900"}`}
                        >
                          {isNote ? "Staff Note" : "Support Reply"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    <div
                      className={`text-sm leading-relaxed whitespace-pre-wrap ${isNote ? "text-amber-900" : "text-gray-700"}`}
                    >
                      {item.content}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* 3. Input Box (Fixed at Bottom on Mobile, Sticky on Desktop) */}
          <div
            className={`
             mt-auto
             fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-50
             lg:static lg:bg-transparent lg:border-t-0 lg:p-0 lg:backdrop-blur-none lg:z-auto
             lg:sticky lg:bottom-4 lg:mt-8 lg:pl-16
          `}
          >
            <div
              className={`
                 rounded-2xl border shadow-xl transition-all duration-300 bg-white
                 /* Mobile adjustments inside the container */
                 lg:bg-white/95 lg:border-gray-300 
                 ${
                   isInternalNote
                     ? "bg-amber-50/95 border-amber-300 ring-1 ring-amber-400/30"
                     : "bg-white border-gray-300 ring-1 ring-gray-900/5"
                 }
             `}
            >
              <div className="flex items-center gap-4 px-4 pt-3 overflow-x-auto">
                <button
                  onClick={() => setIsInternalNote(false)}
                  className={`text-xs font-medium pb-2 border-b-2 transition-colors whitespace-nowrap ${!isInternalNote ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                >
                  Reply to Customer
                </button>
                <button
                  onClick={() => setIsInternalNote(true)}
                  className={`flex items-center gap-1 text-xs font-medium pb-2 border-b-2 transition-colors whitespace-nowrap ${isInternalNote ? "border-amber-600 text-amber-700" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                >
                  <Lock className="w-3 h-3" /> Internal Note
                </button>
              </div>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full bg-transparent border-0 p-4 text-sm focus:ring-0 outline-0 min-h-[80px] lg:min-h-[100px] text-gray-900 placeholder:text-gray-400 resize-none"
                placeholder={
                  isInternalNote ? "Private note for team..." : "Type reply..."
                }
              />

              <div className="flex items-center justify-between px-4 pb-4">
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                    <Paperclip className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!replyText || isSending}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                    isInternalNote
                      ? "bg-amber-500 hover:bg-amber-600"
                      : "bg-gray-900 hover:bg-gray-800"
                  }`}
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isInternalNote ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <CornerDownRight className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {isInternalNote ? "Save Note" : "Send Reply"}
                  </span>
                  <span className="sm:hidden">
                    {isInternalNote ? "Save" : "Send"}
                  </span>
                </button>
              </div>
            </div>
          </div>
          {/* Spacer for Mobile to prevent content being hidden behind fixed input */}
          <div className="h-24 lg:hidden" />
        </section>

        {/* RIGHT COLUMN: Sidebar (Shown via Tab on Mobile) */}
        <aside
          className={`
           space-y-6 
           ${mobileTab === "details" ? "block" : "hidden lg:block"}
        `}
        >
          {/* Action Panel */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
              Update Status
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(STATUS_STYLES) as TicketStatus[]).map((status) => {
                const config = STATUS_STYLES[status];
                const isActive = ticket.status === status;
                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={isUpdating}
                    className={`w-full flex items-center justify-start gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gray-900 text-white shadow-md"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-white" : "bg-gray-400"}`}
                    />
                    {config.label}
                    {isUpdating && isActive && (
                      <Loader2 className="ml-auto w-4 h-4 animate-spin" />
                    )}
                    {isActive && !isUpdating && (
                      <Check className="ml-auto w-4 h-4" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info Panel */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Customer Details
              </h3>
            </div>

            <div className="p-5 space-y-6">
              <div>
                <label className="text-xs text-gray-500 block mb-2">
                  Customer Name
                </label>
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs shadow-sm">
                    {ticket.name.charAt(0)}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {ticket.name}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-1 border-b border-gray-50 pb-2">
                  <span className="text-sm text-gray-500">Email</span>
                  <button
                    onClick={() => copyToClipboard(ticket.email, "email")}
                    className="flex items-center gap-2 text-sm text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    <span className="truncate max-w-[150px]">
                      {ticket.email}
                    </span>
                    {copiedField === "email" ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-gray-300" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-gray-50 pb-2">
                  <span className="text-sm text-gray-500">Ticket ID</span>
                  <button
                    onClick={() => copyToClipboard(ticket._id, "id")}
                    className="flex items-center gap-2 text-sm font-mono text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <span className="truncate max-w-[120px]">{ticket._id}</span>
                    {copiedField === "id" ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-gray-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
