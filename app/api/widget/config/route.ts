// app/api/widget/config/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {connectDB} from '@/lib/mongodb';
import Widget from '@/models/widget';

export async function GET(request: NextRequest) {
  await connectDB();
  
  const { searchParams } = new URL(request.url);
  const widgetKey = searchParams.get('key');

  if (!widgetKey) {
    return NextResponse.json(
      { error: 'Widget key is required' },
      { status: 400 }
    );
  }

  try {
    const widget = await Widget.findOne({ widgetKey }).populate('companyId');
    
    if (!widget) {
      return NextResponse.json(
        { error: 'Widget not found' },
        { status: 404 }
      );
    }

    if (!widget.isActive) {
      return NextResponse.json(
        { error: 'Widget is inactive' },
        { status: 403 }
      );
    }

    // Type guard to ensure companyId exists and has the expected structure
    if (!widget.companyId || typeof widget.companyId !== 'object' || !('name' in widget.companyId)) {
      return NextResponse.json(
        { error: 'Invalid company configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      brandColor: widget.brandColor,
      position: widget.position,
      welcomeMessage: widget.welcomeMessage,
      companyName: widget.companyId.name,
    });
  } catch (error) {
    console.error('Error fetching widget config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}