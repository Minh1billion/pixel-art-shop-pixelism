"use client";

import { useEffect } from "react";
import { useAssetPackFilter } from "@/features/assetpack/hooks/useAssetPackFilter";
import { useAssetPacks } from "@/features/assetpack/hooks/useAssetPacks";
import { usePagination } from "@/features/sprite/hooks/usePagination";
import { useCategories } from "@/features/sprite/hooks/useCategories";
import AssetPackFilters from "@/features/assetpack/components/AssetPackFilters";
import AssetPackGrid from "@/features/assetpack/components/AssetPackGrid";
import Pagination from "@/features/sprite/components/Pagination";

export default function AssetPackPage() {
    const { filter, updateFilter, resetFilter, toggleCategory } = useAssetPackFilter();
    const { page, size, goToPage, reset: resetPage } = usePagination(0, 12);
    const { data, loading, error } = useAssetPacks(filter, page, size);
    const { data: categories } = useCategories();

    useEffect(() => {
        resetPage();
    }, [filter]);

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Asset Pack <span className="text-green-400">Store</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Browse curated sprite packs for your next game
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-56 xl:w-64 shrink-0">
                        <AssetPackFilters
                            filter={filter}
                            categories={categories}
                            onFilterChange={updateFilter}
                            onCategoryToggle={toggleCategory}
                            onReset={resetFilter}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0 space-y-6">
                        {data && !loading && (
                            <p className="text-xs text-gray-500">
                                {data.totalElements} pack{data.totalElements !== 1 ? "s" : ""} found
                            </p>
                        )}

                        <AssetPackGrid
                            packs={data?.content ?? []}
                            loading={loading}
                            error={error}
                        />

                        {data && (
                            <Pagination
                                page={data.number}
                                totalPages={data.totalPages}
                                totalElements={data.totalElements}
                                size={data.size}
                                onPageChange={goToPage}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}