"use client";

import { useState, useRef, useEffect } from "react";
import { HiOutlineFunnel, HiOutlineMagnifyingGlass, HiChevronDown, HiCheck } from "react-icons/hi2";
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
    const [catOpen, setCatOpen] = useState(false);
    const [catSearch, setCatSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedCount = filter.categoryIds?.length ?? 0;

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setCatOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filteredCategories = categories.filter((c) =>
        c.name.toLowerCase().includes(catSearch.toLowerCase())
    );

    const selectedNames = categories
        .filter((c) => filter.categoryIds?.includes(c.id))
        .map((c) => c.name);

    return (
        <div className="w-full rounded-2xl border border-green-900/20 bg-neutral-900">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-green-900/20 shrink-0 rounded-t-2xl bg-neutral-900">
                <div className="flex items-center gap-2">
                    <HiOutlineFunnel className="w-3.5 h-3.5 text-green-500" />
                    <h2 className="text-white font-semibold text-xs tracking-widest uppercase">Filters</h2>
                </div>
                {selectedCount > 0 && (
                    <button
                        onClick={onReset}
                        className="text-[10px] text-green-400 hover:text-green-300 transition-colors bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20"
                    >
                        Clear ({selectedCount})
                    </button>
                )}
            </div>

            {/* Body */}
            <div className="p-4 space-y-5">

                {/* Search */}
                <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest">Search</label>
                    <div className="relative">
                        <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={filter.keyword ?? ""}
                            onChange={(e) => onFilterChange({ keyword: e.target.value })}
                            className="w-full bg-neutral-800 border border-green-900/20 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-500/40 transition-colors"
                        />
                    </div>
                </div>

                <div className="border-t border-green-900/10" />

                {/* Categories */}
                <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest">Categories</label>
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setCatOpen((v) => !v)}
                            className="w-full flex items-center justify-between gap-2 bg-neutral-800 border border-green-900/20 rounded-xl px-3 py-2 text-sm text-left transition-colors hover:border-green-500/30 focus:outline-none"
                        >
                            <span className="truncate text-sm text-gray-400">
                                {selectedCount === 0
                                    ? "Categories"
                                    : selectedCount === 1
                                    ? selectedNames[0]
                                    : `${selectedCount} selected`}
                            </span>
                            <HiChevronDown className={`w-3.5 h-3.5 text-gray-500 shrink-0 transition-transform ${catOpen ? "rotate-180" : ""}`} />
                        </button>

                        {catOpen && (
                            <div className="absolute z-50 mt-1 w-full bg-neutral-800 border border-green-900/20 rounded-xl shadow-2xl overflow-hidden">
                                <div className="p-2 border-b border-green-900/10">
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Filter"
                                        value={catSearch}
                                        onChange={(e) => setCatSearch(e.target.value)}
                                        className="w-full bg-neutral-700 border border-green-900/20 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-green-500/40 transition-colors"
                                    />
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                    {filteredCategories.length === 0 ? (
                                        <p className="text-xs text-gray-600 px-3 py-3">No categories found.</p>
                                    ) : (
                                        filteredCategories.map((cat) => {
                                            const active = filter.categoryIds?.includes(cat.id);
                                            return (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => onCategoryToggle(cat.id)}
                                                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors hover:bg-white/5 ${active ? "text-green-300" : "text-gray-400"}`}
                                                >
                                                    <span className={`w-3.5 h-3.5 shrink-0 rounded border flex items-center justify-center transition-colors ${active ? "bg-green-500/30 border-green-500/60" : "border-green-900/40"}`}>
                                                        {active && <HiCheck className="w-2 h-2 text-green-400" />}
                                                    </span>
                                                    {cat.name}
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                                {selectedCount > 0 && (
                                    <div className="border-t border-green-900/10 p-2">
                                        <button
                                            onClick={() => { onReset(); setCatOpen(false); }}
                                            className="w-full text-xs text-gray-500 hover:text-red-400 py-1 transition-colors"
                                        >
                                            Clear selection
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {selectedCount > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                            {selectedNames.map((name, i) => (
                                <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20 text-green-400">
                                    {name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t border-green-900/10" />

                {/* Sort */}
                <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest">Sort By</label>
                    <div className="grid grid-cols-2 gap-1.5">
                        {(
                            [
                                { label: "Newest", sortBy: "createdAt", sortOrder: "desc" },
                                { label: "Oldest", sortBy: "createdAt", sortOrder: "asc" },
                            ] as const
                        ).map((opt) => {
                            const active = filter.sortBy === opt.sortBy && filter.sortOrder === opt.sortOrder;
                            return (
                                <button
                                    key={opt.label}
                                    onClick={() => onFilterChange({ sortBy: opt.sortBy, sortOrder: opt.sortOrder })}
                                    className={`text-xs px-3 py-2 rounded-lg border transition-all ${
                                        active
                                            ? "bg-green-500/20 border-green-500/50 text-green-300"
                                            : "bg-neutral-800 border-green-900/20 text-gray-400 hover:border-green-500/30 hover:text-gray-300"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}