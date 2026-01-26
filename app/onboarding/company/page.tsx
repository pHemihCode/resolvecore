// app/onboarding/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Company from "@/models/company";
import User from "@/models/user";
import OnboardingForm from "@/components/OnboardingForm";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  // Check if user already has a company
  await connectDB();
  const dbUser = await User.findOne({ email: session.user.email });
  
  if (dbUser) {
    const existingCompany = await Company.findOne({ owner: dbUser._id });
    
    if (existingCompany) {
      // User already has a company, redirect to dashboard
      redirect("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <OnboardingForm />
    </div>
  );
}