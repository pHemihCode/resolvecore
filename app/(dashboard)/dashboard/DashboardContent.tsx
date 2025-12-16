// app/dashboard/DashboardContent.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Company from "@/models/company";

export default async function DashboardContent({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  await connectDB();
  const company = await Company.findOne({ ownerId: session.user.id });

  if (!company) {
    redirect("/onboarding/company");
  }

  return <>{children}</>;
}
