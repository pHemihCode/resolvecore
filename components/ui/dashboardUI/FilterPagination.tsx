"use client"
import { ChevronLeft, ChevronRight } from "lucide-react";
type FilterOption = {
  label: string;
  value: string;
};

interface FilterPaginationProps {
  items: FilterOption[];
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const FilterPagination = ({
  items,
  itemsPerPage,
  currentPage,
  onPageChange,
}: FilterPaginationProps) => {
  const totalPages = Math.ceil(items.length / itemsPerPage);

  if (items.length <= itemsPerPage) return null;

  return (
    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
      <div className="text-xs text-gray-500">
        Showing{" "}
        {(currentPage - 1) * itemsPerPage + 1}-
        {Math.min(currentPage * itemsPerPage, items.length)} of {items.length}{" "}
        options
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`p-1 rounded ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 cursor-pointer"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const pageNum = i + 1;
            const actualPage = pageNum;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(actualPage)}
                className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                  currentPage === actualPage
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-label={`Go to page ${actualPage}`}
              >
                {actualPage}
              </button>
            );
          })}
          {totalPages > 5 && currentPage > 3 && (
            <>
              <span className="text-gray-500 flex items-center px-1">...</span>
              <button
                onClick={() => onPageChange(totalPages)}
                className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                  currentPage === totalPages
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-label={`Go to page ${totalPages}`}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`p-1 rounded ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 cursor-pointer"
          }`}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};