// lib/widget-service.ts
import mongoose from 'mongoose';
import Widget from '@/models/widget';
import Ticket from '@/models/Ticket';

export interface CreateTicketInput {
  widgetKey: string;
  name: string;
  email: string;
  message: string;
  category: 'Billing' | 'Technical' | 'General';
}

export interface WidgetConfig {
  brandColor: string;
  position: 'bottom-right' | 'bottom-left';
  welcomeMessage: string;
  companyName: string;
}

export async function getWidgetConfig(widgetKey: string): Promise<{
  success: boolean;
  data?: WidgetConfig;
  error?: string;
}> {
  const widget = await Widget.findOne({ widgetKey })
    .populate<{ companyId: any }>('companyId');

  if (!widget) {
    return { success: false, error: 'Widget not found' };
  }

  if (!widget.isActive) {
    return { success: false, error: 'Widget is inactive' };
  }

  // Type guard to ensure companyId exists and has the expected structure
  if (!widget.companyId || typeof widget.companyId !== 'object' || !('name' in widget.companyId)) {
    return { success: false, error: 'Invalid company configuration' };
  }

  return {
    success: true,
    data: {
      brandColor: widget.brandColor,
      position: widget.position,
      welcomeMessage: widget.welcomeMessage,
      companyName: widget.companyId.name,
    },
  };
}

export async function createTicket(input: CreateTicketInput): Promise<{
  success: boolean;
  data?: string; // Changed from ObjectId to string
  error?: string;
}> {
  const widget = await Widget.findOne({ widgetKey: input.widgetKey });

  if (!widget) {
    return { success: false, error: 'Invalid widget key' };
  }

  if (!widget.isActive) {
    return { success: false, error: 'Widget is inactive' };
  }

  const ticket = await Ticket.create({
    companyId: widget.companyId,
    widgetId: widget._id,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    message: input.message.trim(),
    category: input.category,
  });

  // Return the string representation of ObjectId
  return { success: true, data: ticket._id.toString() };
}

export async function getTicketStatus(
  ticketId: string,
  email: string
): Promise<{
  success: boolean;
  data?: { status: string; createdAt: Date };
  error?: string;
}> {
  const ticket = await Ticket.findOne({
    _id: new mongoose.Types.ObjectId(ticketId),
    email: email.trim().toLowerCase(),
  }).select('status createdAt');

  if (!ticket) {
    return { success: false, error: 'Ticket not found' };
  }

  return {
    success: true,
    data: {
      status: ticket.status,
      createdAt: ticket.createdAt,
    },
  };
}

export async function getCompanyTickets(
  companyId: string,
  options: { status?: string; page?: number; limit?: number } = {}
): Promise<{
  success: boolean;
  data?: { tickets: any[]; total: number; pages: number };
  error?: string;
}> {
  const { status, page = 1, limit = 20 } = options;

  const query: any = { companyId: new mongoose.Types.ObjectId(companyId) };
  if (status) query.status = status;

  const [tickets, total] = await Promise.all([
    Ticket.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Ticket.countDocuments(query),
  ]);

  return {
    success: true,
    data: {
      tickets,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function updateTicketStatus(
  ticketId: string,
  companyId: string,
  status: 'open' | 'in_progress' | 'resolved'
): Promise<{
  success: boolean;
  error?: string;
}> {
  const ticket = await Ticket.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(ticketId),
      companyId: new mongoose.Types.ObjectId(companyId),
    },
    { status, updatedAt: new Date() },
    { new: true }
  );

  if (!ticket) {
    return { success: false, error: 'Ticket not found or unauthorized' };
  }

  return { success: true };
}