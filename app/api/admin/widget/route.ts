// app/api/admin/widget/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import Widget from "@/models/widget";

// GET - Fetch widget settings for dashboard
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const companyId = (session.user as any).companyId;

    if (!companyId) {
      return NextResponse.json(
        { error: "No company found. Please create a company first." },
        { status: 404 }
      );
    }

    await connectDB();

    const widget = await Widget.findOne({ companyId });

    if (!widget) {
      return NextResponse.json(
        { error: "Widget not found" },
        { status: 404 }
      );
    }

    // Return FULL widget info including widgetKey (for embed code)
    return NextResponse.json({
      widgetKey: widget.widgetKey,
      brandColor: widget.brandColor,
      position: widget.position,
      welcomeMessage: widget.welcomeMessage,
      isActive: widget.isActive,
    });
  } catch (error) {
    console.error("Error fetching widget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update widget settings from dashboard
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const companyId = (session.user as any).companyId;

    if (!companyId) {
      return NextResponse.json(
        { error: "No company found" },
        { status: 404 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { brandColor, position, welcomeMessage, isActive } = body;

    // Build update object with only provided fields
    const updateData: Record<string, any> = {};
    
    if (brandColor !== undefined) {
      // Validate color format
      if (!/^#([0-9A-F]{3}){1,2}$/i.test(brandColor)) {
        return NextResponse.json(
          { error: "Invalid color format. Use hex code (e.g., #6366f1)" },
          { status: 400 }
        );
      }
      updateData.brandColor = brandColor;
    }
    
    if (position !== undefined) {
      if (!["bottom-right", "bottom-left"].includes(position)) {
        return NextResponse.json(
          { error: "Position must be 'bottom-right' or 'bottom-left'" },
          { status: 400 }
        );
      }
      updateData.position = position;
    }
    
    if (welcomeMessage !== undefined) {
      if (welcomeMessage.length > 200) {
        return NextResponse.json(
          { error: "Welcome message cannot exceed 200 characters" },
          { status: 400 }
        );
      }
      updateData.welcomeMessage = welcomeMessage;
    }
    
    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    const widget = await Widget.findOneAndUpdate(
      { companyId },
      updateData,
      { new: true }
    );

    if (!widget) {
      return NextResponse.json(
        { error: "Widget not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      widgetKey: widget.widgetKey,
      brandColor: widget.brandColor,
      position: widget.position,
      welcomeMessage: widget.welcomeMessage,
      isActive: widget.isActive,
      message: "Widget settings updated successfully",
    });
  } catch (error) {
    console.error("Error updating widget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}