// app/api/admin/tickets/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import mongoose from "mongoose";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  props: RouteProps
) {
  try {
    const params = await props.params; 
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const companyId = (session.user as any).companyId;

    if (!companyId) {
      return NextResponse.json(
        { error: "No company associated with this account" },
        { status: 403 }
      );
    }

    const ticketId = params.id;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return NextResponse.json(
        { error: "Invalid ticket ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const ticket = await Ticket.findOne({
      _id: ticketId,
      companyId,
    }).lean();

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, type } = await request.json(); 

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    await connectDB();

    const ticket = await Ticket.findOneAndUpdate(
      { _id: params.id },
      { 
        $push: { 
          history: { 
            type: type || 'message', 
            content: content, 
            author: 'support',       
            createdAt: new Date() 
          } 
        } 
      },
      { new: true }
    );

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error adding reply:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function PATCH(
  request: NextRequest,
  props:RouteProps
) {
  try {
    const params = await props.params; 
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const companyId = (session.user as any).companyId;

    if (!companyId) {
      return NextResponse.json(
        { error: "No company associated with this account" },
        { status: 403 }
      );
    }

    const ticketId = params.id;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return NextResponse.json(
        { error: "Invalid ticket ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const { status } = await request.json();

    if (!["open", "in_progress", "resolved"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be: open, in_progress, or resolved" },
        { status: 400 }
      );
    }

    const ticket = await Ticket.findOneAndUpdate(
      { _id: ticketId, companyId },
      { status },
      { new: true }
    ).lean();

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}