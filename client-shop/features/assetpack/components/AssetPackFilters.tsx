"use client";

import { useState } from "react";
import type { AssetPackFilterRequest } from "@/features/assetpack/types";
import type { CategoryResponse } from "@/features/sprite/types";

interface AssetPackFiltersProps {
    filter: AssetPackFilterRequest;
    categories: CategoryResponse[];
    onFilterChange: (updates: Partial<AssetPackFilterRequest>) => void;
    onCategoryToggle: (id: string) => void;
    onReset: () => void;
}

export default function AssetPackFilters({
    filter,
    categories,
    onFilterChange,
    onCategoryToggle,
    onReset,
}: AssetPackFiltersProps) {
    const [priceOpen, setPriceOpen] = useState(false);

    const selectedCount =
        (filter.categoryIds?.length ?? 0) +
        (filter.minPrice !== undefined ? 1 : 0) +
        (filter.maxPrice !== undefined ? 1 : 0);

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

            {/* Keyword */}
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
                        placeholder="Search packs..."
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

            {/* Price Range */}
            <div className="space-y-2">
                <button
                    onClick={() => setPriceOpen((v) => !v)}
                    className="w-full flex items-center justify-between text-xs text-gray-500 uppercase tracking-wider hover:text-gray-400 transition-colors"
                >
                    <span>Price Range</span>
                    <svg
                        className={`w-3.5 h-3.5 transition-transform ${priceOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {priceOpen && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                            <label className="text-[10px] text-gray-600 mb-1 block">Min ($)</label>
                            <input
                                type="number"
                                min={0}
                                placeholder="0"
                                value={filter.minPrice ?? ""}
                                onChange={(e) =>
                                    onFilterChange({
                                        minPrice: e.target.value === "" ? undefined : Number(e.target.value),
                                    })
                                }
                                className="w-full bg-neutral-900 border border-green-900/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-600 mb-1 block">Max ($)</label>
                            <input
                                type="number"
                                min={0}
                                placeholder="∞"
                                value={filter.maxPrice ?? ""}
                                onChange={(e) =>
                                    onFilterChange({
                                        maxPrice: e.target.value === "" ? undefined : Number(e.target.value),
                                    })
                                }
                                className="w-full bg-neutral-900 border border-green-900/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-colors"
                            />
                        </div>
                        <button
                            onClick={() => onFilterChange({ minPrice: 0, maxPrice: 0 })}
                            className="col-span-2 text-xs bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 py-1.5 rounded-lg transition-colors"
                        >
                            Free only
                        </button>
                    </div>
                )}
            </div>

            {/* Sort */}
            <div className="space-y-2">
                <label className="text-xs text-gray-500 uppercase tracking-wider">Sort By</label>
                <div className="grid grid-cols-2 gap-2">
                    {(
                        [
                            { label: "Newest", sortBy: "createdAt", sortOrder: "desc" },
                            { label: "Oldest", sortBy: "createdAt", sortOrder: "asc" },
                            { label: "Price ↑", sortBy: "price", sortOrder: "asc" },
                            { label: "Price ↓", sortBy: "price", sortOrder: "desc" },
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