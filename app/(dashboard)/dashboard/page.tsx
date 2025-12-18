import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Company from "@/models/company";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardPage() {
  // Get session server-side
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/sign-in");

  await connectDB();

  const company = await Company.findOne({ ownerId: session.user.id });

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Welcome, {session.user.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard cards/components here */}
        <div className="bg-white p-4 rounded shadow">Card 1</div>
        <div className="bg-white p-4 rounded shadow">Card 2</div>
        <div className="bg-white p-4 rounded shadow">Card 3</div>
      </div>
    </div>
  );
}
