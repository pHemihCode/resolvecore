// app/api/company/check/route.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import Company from "@/models/company";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await User.findOne({ email: session.user.email });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const company = await Company.findOne({ owner: dbUser._id });
    const hasCompany = !!company;

    return NextResponse.json({ hasCompany });
  } catch (error) {
    console.error("Error in /api/company/check:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}