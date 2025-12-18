import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {connectDB} from "@/lib/mongodb";
import Company from "@/models/company";
import Widget from "@/models/widget";

export async function POST(req: NextRequest) {
  try {
    // 1. Get the current user's session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to create a company." },
        { status: 401 }
      );
    }

    // 2. Parse the request body
    const body = await req.json();
    const { name, websiteUrl, industry, companySize } = body;

    if (!name || !companySize) {
      return NextResponse.json(
        { error: "Company name and size are required." },
        { status: 400 }
      );
    }

    // 3. Connect to DB and check if user already has a company
    await connectDB();
    
    const existingCompany = await Company.findOne({
      owner: session.user.id,
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: "You already have a company." },
        { status: 400 }
      );
    }

    // 4. Create the company WITH the ownerId field
    const newCompany = await Company.create({
      name,
      websiteUrl: websiteUrl || "",
      industry: industry || "",
      companySize,
      owner: session.user.id,
    });

    // 5. Create a default widget for the company
    await Widget.create({
      companyId: newCompany._id,
      name: "Main Website Support",
      brandColor: "#000000",
      position: "bottom-right",
      welcomeMessage: "Hi! How can I help you today?",
      isActive: false,
    });

    // 6. Return success response
    return NextResponse.json(
      { 
        success: true,
        message: "Company created successfully",
        company: newCompany 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error creating company:", error);
    
    // Handle Mongoose validation errors specifically
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}