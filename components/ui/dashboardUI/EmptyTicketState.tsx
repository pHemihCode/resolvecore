import { ArrowRight, Ticket } from "lucide-react";
import Link from "next/link"
export const EmptyTicketsState = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 mb-4 opacity-70 rounded-full bg-gray-50 flex items-center justify-center">
        <Ticket size={48} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No tickets yet</h3>
      <p className="text-gray-500 mb-6 max-w-md">
        When you receive customer tickets, they'll appear here. You can create a test ticket to get started.
      </p>
      <Link 
        href="/tickets/new" 
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Test Ticket <ArrowRight size={16} />
      </Link>
    </div>
  );
};