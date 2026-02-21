"use client";

interface PaginationProps {
    page: number;          // 0-indexed
    totalPages: number;
    totalElements: number;
    size: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    page,
    totalPages,
    totalElements,
    size,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const from = page * size + 1;
    const to = Math.min((page + 1) * size, totalElements);

    const getPages = (): (number | "...")[] => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);

        const pages: (number | "...")[] = [0];

        if (page > 2) pages.push("...");

        const start = Math.max(1, page - 1);
        const end = Math.min(totalPages - 2, page + 1);
        for (let i = start; i <= end; i++) pages.push(i);

        if (page < totalPages - 3) pages.push("...");
        pages.push(totalPages - 1);

        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            <p className="text-xs text-gray-500">
                Showing <span className="text-gray-300">{from}–{to}</span> of{" "}
                <span className="text-gray-300">{totalElements}</span> sprites
            </p>

            <div className="flex items-center gap-1.5">
                {/* Prev */}
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 0}
                    className="p-2 rounded-lg border border-green-900/20 text-gray-400 hover:text-white hover:border-green-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Previous page"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {getPages().map((p, i) =>
                    p === "..." ? (
                        <span key={`ellipsis-${i}`} className="text-gray-600 px-1 text-sm">
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p as number)}
                            className={`w-8 h-8 rounded-lg text-xs font-medium border transition-all ${
                                p === page
                                    ? "bg-green-500/20 border-green-500/50 text-green-300"
                                    : "border-green-900/20 text-gray-400 hover:border-green-500/30 hover:text-white"
                            }`}
                        >
                            {(p as number) + 1}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages - 1}
                    className="p-2 rounded-lg border border-green-900/20 text-gray-400 hover:text-white hover:border-green-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Next page"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}