interface Ticket {
  id: string;
  customer: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdDate: Date | string;
}