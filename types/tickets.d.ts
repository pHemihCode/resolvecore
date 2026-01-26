// types/ticket.ts
// Add this line to your existing imports
export type { TicketStatus } from "./widget"; // Assuming widget types are in widget.ts

export interface Ticket {
  id: string;
  customer: string;
  subject: string;
  status: TicketStatus; // Use the imported type
  priority: TicketPriority; // You might need to create this type too
  createdDate: Date | string;
}