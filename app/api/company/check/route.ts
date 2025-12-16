import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import Company from "@/models/company";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.id) return NextResponse.json({ hasCompany: false });

  await connectDB();
  const company = await Company.findOne({ ownerId: session.user.id });

  return NextResponse.json({ hasCompany: !!company });
}
