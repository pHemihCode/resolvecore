"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CompanyOnboarding() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, website, industry, size }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      // Redirect to dashboard after successful creation
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-semibold">Create your workspace</h2>
        <p className="text-gray-500 text-sm">
          This helps us customize your support experience.
        </p>

        {error && <p className="text-red-500">{error}</p>}

        <input
          type="text"
          placeholder="Company name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 border rounded"
        />

        <input
          type="url"
          placeholder="Website URL"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full p-3 border rounded"
        />

        <input
          type="text"
          placeholder="Industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="w-full p-3 border rounded"
        />

        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          required
          className="w-full p-3 border rounded"
        >
          <option value="">Company size</option>
          <option value="1-10">1-10</option>
          <option value="11-50">11-50</option>
          <option value="51-200">51-200</option>
          <option value="200+">200+</option>
        </select>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 bg-black text-white rounded flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
          {isLoading ? "Creating..." : "Create Workspace"}
        </button>
      </form>
    </div>
  );
}
