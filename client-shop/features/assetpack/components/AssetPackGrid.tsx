"use client";

import { useState } from "react";
import AssetPackCard from "./AssetPackCard";
import type { AssetPackResponse } from "@/features/assetpack/types";

type ViewMode = "grid" | "list";

interface AssetPackGridProps {
    packs: AssetPackResponse[];
    loading: boolean;
    error: string | null;
}

function GridIcon({ active }: { active: boolean }) {
    return (
        <svg
            className={`w-4 h-4 transition-colors ${active ? "text-green-400" : "text-gray-500"}`}
            fill="currentColor"
            viewBox="0 0 16 16"
        >
            <rect x="1" y="1" width="6" height="6" rx="1" />
            <rect x="9" y="1" width="6" height="6" rx="1" />
            <rect x="1" y="9" width="6" height="6" rx="1" />
            <rect x="9" y="9" width="6" height="6" rx="1" />
        </svg>
    );
}

function ListIcon({ active }: { active: boolean }) {
    return (
        <svg
            className={`w-4 h-4 transition-colors ${active ? "text-green-400" : "text-gray-500"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
    );
}

export default function AssetPackGrid({ packs, loading, error }: AssetPackGridProps) {
    const [view, setView] = useState<ViewMode>("grid");

    const toolbar = (
        <div className="flex items-center justify-end mb-4">
            <div className="flex items-center gap-1 bg-neutral-900 border border-green-900/20 rounded-lg p-1">
                <button
                    onClick={() => setView("grid")}
                    className={`p-1.5 rounded-md transition-all ${view === "grid" ? "bg-green-500/20" : "hover:bg-white/5"}`}
                    aria-label="Grid view"
                >
                    <GridIcon active={view === "grid"} />
                </button>
                <button
                    onClick={() => setView("list")}
                    className={`p-1.5 rounded-md transition-all ${view === "list" ? "bg-green-500/20" : "hover:bg-white/5"}`}
                    aria-label="List view"
                >
                    <ListIcon active={view === "list"} />
                </button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div>
                {toolbar}
                {view === "grid" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-neutral-900 border border-green-900/10 rounded-2xl overflow-hidden animate-pulse"
                            >
                                <div className="aspect-square bg-neutral-800" />
                                <div className="p-4 space-y-2">
                                    <div className="h-3 bg-neutral-800 rounded w-3/4" />
                                    <div className="h-2.5 bg-neutral-800 rounded w-1/2" />
                                    <div className="h-7 bg-neutral-800 rounded mt-3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 bg-neutral-900 border border-green-900/10 rounded-2xl p-3 animate-pulse"
                            >
                                <div className="w-16 h-16 rounded-xl bg-neutral-800 shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-neutral-800 rounded w-1/3" />
                                    <div className="h-2.5 bg-neutral-800 rounded w-1/4" />
                                </div>
                                <div className="h-7 w-20 bg-neutral-800 rounded-lg shrink-0" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (error) {
        return (
            <div>
                {toolbar}
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="text-4xl mb-4">⚠️</div>
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (packs.length === 0) {
        return (
            <div>
                {toolbar}
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="text-5xl mb-4">📦</div>
                    <p className="text-gray-500 text-sm">No packs found. Try adjusting your filters.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {toolbar}
            {view === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                    {packs.map((pack) => (
                        <AssetPackCard key={pack.id} pack={pack} view="grid" />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {packs.map((pack) => (
                        <AssetPackCard key={pack.id} pack={pack} view="list" />
                    ))}
                </div>
            )}
        </div>
    );
}