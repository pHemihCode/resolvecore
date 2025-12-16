import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import Company from "@/models/company";
import Widget from "@/models/widget";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { name, website, industry, size } = body;

    if (!name || !size) {
      return NextResponse.json(
        { message: "Company name and size are required" },
        { status: 400 }
      );
    }

    // Check if user already has a company
    const existingCompany = await Company.findOne({ ownerId: session.user.id });
    if (existingCompany) {
      return NextResponse.json(
        { message: "Company already exists" },
        { status: 400 }
      );
    }

    // Create company
    const company = await Company.create({
      name,
      websiteUrl: website,
      industry,
      companySize: size,
      ownerId: session.user.id,
    });

    // Auto-create default widget
    await Widget.create({
      companyId: company._id,
      name: "Main Website Support",
      brandColor: "#000000",
      position: "bottom-right",
      welcomeMessage: "Hi! How can I help you today?",
      isActive: false,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
