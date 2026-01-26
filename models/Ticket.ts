import mongoose, { Document, Schema, Model } from 'mongoose';

interface IHistoryItem {
  type: 'message' | 'note';
  content: string;
  author: 'customer' | 'support';
  createdAt: Date;
}

export interface ITicket extends Document {
  companyId: mongoose.Types.ObjectId;
  widgetId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  message: string;
  category: 'Billing' | 'Technical' | 'General';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
  history:IHistoryItem[];
}

const TicketSchema = new Schema<ITicket>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    widgetId: {
      type: Schema.Types.ObjectId,
      ref: 'Widget',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    category: {
      type: String,
      enum: ['Billing', 'Technical', 'General'],
      default: 'General',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved'],
      default: 'open',
      index: true,
    },
   history: [
      {
        type: { 
          type: String, 
          enum: ['message', 'note'], 
          default: 'message',
          required: true
        },
        content: { 
          type: String, 
          required: true 
        },
        author: { 
          type: String, 
          enum: ['customer', 'support'],
          required: true 
        },
        createdAt: { 
          type: Date, 
          default: Date.now 
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
TicketSchema.index({ companyId: 1, createdAt: -1 });
TicketSchema.index({ widgetId: 1, createdAt: -1 });
TicketSchema.index({ email: 1, _id: 1 });

const Ticket: Model<ITicket> = 
  mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);

export default Ticket;