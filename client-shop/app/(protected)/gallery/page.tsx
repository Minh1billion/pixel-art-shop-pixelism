"use client";

import { useEffect } from "react";
import { useSpriteFilter} from "@/features/sprite/hooks/useSpriteFilter";
import { usePagination } from "@/features/sprite/hooks/usePagination";
import { useSprites } from "@/features/sprite/hooks/useSprites";
import { useCategories } from "@/features/sprite/hooks/useCategories";
import SpriteFilters from "@/features/sprite/components/SpriteFilters";
import SpriteGrid from "@/features/sprite/components/SpriteGrid";
import Pagination from "@/features/sprite/components/Pagination";

export default function SpritePage() {
    const { filter, updateFilter, resetFilter, toggleCategory } = useSpriteFilter();
    const { page, size, goToPage, reset: resetPage } = usePagination(0, 12);
    const { data, loading, error } = useSprites(filter, page, size);
    const { data: categories } = useCategories();

    // Reset to page 0 whenever filter changes
    useEffect(() => {
        resetPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Sprite <span className="text-green-400">Store</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Browse and download pixel-perfect game sprites
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="lg:w-56 xl:w-64 shrink-0">
                        <SpriteFilters
                            filter={filter}
                            categories={categories}
                            onFilterChange={updateFilter}
                            onCategoryToggle={toggleCategory}
                            onReset={resetFilter}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0 space-y-6">
                        {/* Result count */}
                        {data && !loading && (
                            <p className="text-xs text-gray-500">
                                {data.totalElements} sprite{data.totalElements !== 1 ? "s" : ""} found
                            </p>
                        )}

                        <SpriteGrid
                            sprites={data?.content ?? []}
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