// types/widget.ts
export type WidgetView =
  | "welcome"
  | "create-ticket"
  | "success"
  | "check-status"
  | "ticket-status";

export type TicketStatus = "open" | "in_progress" | "resolved";

export type TicketCategory = "Billing" | "Technical" | "General";

export interface WidgetConfig {
  brandColor: string;
  position: "bottom-right" | "bottom-left";
  welcomeMessage: string;
  companyName: string;
}

export interface Ticket {
  _id: string;
  companyId: string;
  widgetId: string;
  name: string;
  email: string;
  message: string;
  category: TicketCategory;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketInput {
  widgetKey: string;
  name: string;
  email: string;
  message: string;
  category: TicketCategory;
}

export interface TicketStatusResponse {
  ticketId: string;
  status: TicketStatus;
  createdAt: string;
}

export interface PaginatedTickets {
  tickets: Ticket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string[];
}