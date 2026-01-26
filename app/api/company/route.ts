// app/api/company/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import Company from "@/models/company";
import Widget from "@/models/widget";
import User from "@/models/user";
import { generateWidgetKey } from "@/lib/generate-widget-key";

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

    // 3. Connect to DB
    await connectDB();

    // 4. Find the user in the database to get their MongoDB _id
    const dbUser = await User.findOne({ email: session.user.email });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database." },
        { status: 404 }
      );
    }

    // 5. Check if user already has a company
    const existingCompany = await Company.findOne({
      owner: dbUser._id,
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: "You already have a company." },
        { status: 400 }
      );
    }

    // 6. Create the company
    const newCompany = await Company.create({
      name,
      websiteUrl: websiteUrl || "",
      industry: industry || "",
      companySize,
      owner: dbUser._id,
    });

    // 7. Generate unique widget key
    const widgetKey = generateWidgetKey();

    // 8. Create a default widget for the company WITH the widgetKey
    const newWidget = await Widget.create({
      companyId: newCompany._id,
      widgetKey: widgetKey, // ✅ Now including the required widgetKey
      name: "Main Website Support",
      brandColor: "#6366f1",
      position: "bottom-right",
      welcomeMessage: "Hi! How can we help you today?",
      isActive: true,
    });

    console.log("✅ Company created:", newCompany._id);
    console.log("✅ Widget created with key:", widgetKey);

    // 9. Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Company created successfully",
        company: {
          _id: newCompany._id,
          name: newCompany.name,
        },
        widget: {
          _id: newWidget._id,
          widgetKey: widgetKey,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating company:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { error: "Validation failed", details: messages },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A company with this information already exists." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}