// app/api/widget/tickets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '@/lib/mongodb';
import Widget from '@/models/widget';
import Ticket from '@/models/Ticket';
import { rateLimit, maybeCleanup } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  await connectDB();
  
  // Rate limiting
  maybeCleanup();
  const rateLimitResult = rateLimit(request);
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { 
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000),
      },
      { 
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { widgetKey, name, email, message, category } = body;

    // Validation
    const errors: string[] = [];
    
    if (!widgetKey || typeof widgetKey !== 'string') {
      errors.push('Valid widget key is required');
    }
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Valid email is required');
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      errors.push('Message must be at least 10 characters');
    }
    if (category && !['Billing', 'Technical', 'General'].includes(category)) {
      errors.push('Invalid category');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    const widget = await Widget.findOne({ widgetKey });
    
    if (!widget) {
      return NextResponse.json(
        { error: 'Invalid widget key' },
        { status: 400 }
      );
    }

    if (!widget.isActive) {
      return NextResponse.json(
        { error: 'Widget is inactive' },
        { status: 403 }
      );
    }

    const ticket = await Ticket.create({
      companyId: widget.companyId,
      widgetId: widget._id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      category: category || 'General',
    });

    return NextResponse.json(
      { 
        ticketId: ticket._id.toString(),
        message: 'Ticket created successfully',
      },
      { 
        status: 201,
        headers: {
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        },
      }
    );
  } catch (error) {
    console.error('Create ticket error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}