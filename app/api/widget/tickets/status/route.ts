// app/api/widget/tickets/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '@/lib/mongodb';
import Ticket from '@/models/Ticket';

export async function GET(request: NextRequest) {
  await connectDB();
  
  const { searchParams } = new URL(request.url);
  const ticketId = searchParams.get('ticketId');
  const email = searchParams.get('email');

  if (!ticketId || !email) {
    return NextResponse.json(
      { error: 'Ticket ID and email are required' },
      { status: 400 }
    );
  }

  // Validate ticketId format (MongoDB ObjectId)
  if (!ticketId.match(/^[0-9a-fA-F]{24}$/)) {
    return NextResponse.json(
      { error: 'Invalid ticket ID format' },
      { status: 400 }
    );
  }

  try {
    const ticket = await Ticket.findOne({
      _id: ticketId,
      email: email.trim().toLowerCase(),
    }).select('status createdAt');

    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ticketId,
      status: ticket.status,
      createdAt: ticket.createdAt,
    });
  } catch (error) {
    console.error('Error fetching ticket status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}