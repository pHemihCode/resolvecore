import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Company from "@/models/company";
import Widget from "@/models/widget";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { name, website, industry, size } = await req.json();

    if (!name || !size) {
      return NextResponse.json(
        { message: "Company name and size are required" },
        { status: 400 }
      );
    }

    const existingCompany = await Company.findOne({
      ownerId: session.user.id,
    });

    if (existingCompany) {
      return NextResponse.json(
        { message: "Company already exists" },
        { status: 400 }
      );
    }

    const company = await Company.create({
      name,
      websiteUrl: website,
      industry,
      companySize: size,
      ownerId: session.user.id,
    });

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
