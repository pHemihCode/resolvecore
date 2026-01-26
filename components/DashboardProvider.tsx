// components/dashboard/DashboardProvider.tsx
"use client";

import React, { createContext, useContext, ReactNode , useState} from "react";
import { listTickets, updateTicketStatus } from "@/lib/dashboard-api";
import type { 
  DashboardState, 
  Ticket, 
  TicketStatus 
} from "@/types/tickets"; // Import your unified types

// --- 1. DEFINE THE GLOBAL STATE TYPE ---
// This interface holds ALL state for the entire dashboard
interface DashboardState {
  // --- Sidebar State ---
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;

  // --- Advanced UI State ---
  selectedTicketId: string | null;
  setSelectedTicketId: (id: string | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  notifications: string[];
  setNotifications: (notifications: string[]) => void;
  tickets: Ticket[];
}

// --- 2. CREATE THE CONTEXT ---
const DashboardContext = createContext<DashboardState | undefined>(undefined);

// --- 3. CREATE THE PROVIDER ---
export function DashboardProvider({ children }: { children: React.ReactNode }) {
  // --- Initialize State ---
  const [state, setState] = useState<DashboardState>({
    isExpanded: true,
    selectedTicketId: null,
    isLoading: false,
    notifications: [],
    tickets: [],
    setNotifications: () => {},
    setSelectedTicketId: () => {},
    setIsLoading: () => {},
    setTickets: () => {},
  });

  // --- 4. SIDE EFFECT: INITIAL DATA FETCH ---
  // In a real app, you would fetch initial data here
  // For now, we'll initialize with empty state
  useEffect(() => {
    // This effect would run once on component mount
    console.log("DashboardProvider: Initial state set");
  }, []);

  // --- 5. EXPOSED STATE AND ACTIONS ---
  return {
    // --- State ---
    ...state,

    // --- Actions ---
    // Sidebar actions
    setIsExpanded: state.setIsExpanded,
    // Advanced UI actions
    setSelectedTicketId: state.setSelectedTicketId,
    setIsLoading: state.setIsLoading,
    addNotification: state.addNotification,
    // Data actions
    setTickets: state.setTickets,
  };
};