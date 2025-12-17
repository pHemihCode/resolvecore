import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Company from "@/models/company";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ hasCompany: false }, { status: 401 });
  }

  await connectDB();

  const company = await Company.findOne({ ownerId: session.user.id });

  return NextResponse.json({ hasCompany: !!company });
}
