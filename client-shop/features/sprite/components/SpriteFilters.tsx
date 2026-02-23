"use client";

import type { SpriteFilterRequest } from "@/features/sprite/types";
import type { CategoryResponse } from "@/features/sprite/types";

interface SpriteFiltersProps {
    filter: SpriteFilterRequest;
    categories: CategoryResponse[];
    onFilterChange: (updates: Partial<SpriteFilterRequest>) => void;
    onCategoryToggle: (id: string) => void;
    onReset: () => void;
}

export default function SpriteFilters({
    filter,
    categories,
    onFilterChange,
    onCategoryToggle,
    onReset,
}: SpriteFiltersProps) {

    const selectedCount =
        (filter.categoryIds?.length ?? 0);

    return (
        <aside className="w-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-white font-semibold text-sm tracking-wider uppercase">
                    Filters
                </h2>
                {selectedCount > 0 && (
                    <button
                        onClick={onReset}
                        className="text-xs text-green-400 hover:text-green-300 transition-colors"
                    >
                        Clear all ({selectedCount})
                    </button>
                )}
            </div>

            {/* Keyword Search */}
            <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-wider">Search</label>
                <div className="relative">
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search sprites..."
                        value={filter.keyword ?? ""}
                        onChange={(e) => onFilterChange({ keyword: e.target.value })}
                        className="w-full bg-neutral-900 border border-green-900/20 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-colors"
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-wider">Categories</label>
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                        const active = filter.categoryIds?.includes(cat.id);
                        return (
                            <button
                                key={cat.id}
                                onClick={() => onCategoryToggle(cat.id)}
                                className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                                    active
                                        ? "bg-green-500/20 border-green-500/50 text-green-300"
                                        : "bg-neutral-900 border-green-900/20 text-gray-400 hover:border-green-500/30 hover:text-gray-300"
                                }`}
                            >
                                {cat.name}
                            </button>
                        );
                    })}
                    {categories.length === 0 && (
                        <p className="text-xs text-gray-600">No categories found.</p>
                    )}
                </div>
            </div>

            {/* Sort */}
            <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-wider">Sort By</label>
                <div className="grid grid-cols-2 gap-2">
                    {(
                        [
                            { label: "Newest", sortBy: "createdAt", sortOrder: "desc" },
                            { label: "Oldest", sortBy: "createdAt", sortOrder: "asc" },
                        ] as const
                    ).map((opt) => {
                        const active =
                            filter.sortBy === opt.sortBy && filter.sortOrder === opt.sortOrder;
                        return (
                            <button
                                key={opt.label}
                                onClick={() =>
                                    onFilterChange({ sortBy: opt.sortBy, sortOrder: opt.sortOrder })
                                }
                                className={`text-xs px-3 py-2 rounded-lg border transition-all ${
                                    active
                                        ? "bg-green-500/20 border-green-500/50 text-green-300"
                                        : "bg-neutral-900 border-green-900/20 text-gray-400 hover:border-green-500/30"
                                }`}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}