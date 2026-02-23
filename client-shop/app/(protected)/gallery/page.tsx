"use client";

import { useEffect, useState } from "react";
import { useSpriteFilter } from "@/features/sprite/hooks/useSpriteFilter";
import { usePagination } from "@/features/sprite/hooks/usePagination";
import { useSprites } from "@/features/sprite/hooks/useSprites";
import { useCategories } from "@/features/sprite/hooks/useCategories";
import { useAuth } from "@/features/auth/hooks/useAuth";
import SpriteFilters from "@/features/sprite/components/SpriteFilters";
import SpriteGrid from "@/features/sprite/components/SpriteGrid";
import Pagination from "@/features/sprite/components/Pagination";
import SavingSpriteForm from "@/features/sprite/components/SavingSpriteForm";
import type { SpriteListResponse } from "@/features/sprite/types";

export default function GalleryPage() {
    const { filter, updateFilter, resetFilter, toggleCategory } = useSpriteFilter();
    const { page, size, goToPage, reset: resetPage } = usePagination(0, 12);
    const { data, loading, error, refresh } = useSprites(filter, page, size);
    const { data: categories } = useCategories();
    const { user } = useAuth();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingSprite, setEditingSprite] = useState<SpriteListResponse | null>(null);

    useEffect(() => {
        resetPage();
    }, [filter, resetPage]);

    const openCreate = () => {
        setEditingSprite(null);
        setModalOpen(true);
    };

    const openEdit = (sprite: SpriteListResponse) => {
        setEditingSprite(sprite);
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
        setEditingSprite(null);
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            Sprite <span className="text-green-400">Store</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Browse and download pixel-perfect game sprites
                        </p>
                    </div>

                    {user && (
                        <button
                            onClick={openCreate}
                            className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium bg-green-500 hover:bg-green-400 text-black transition-colors"
                        >
                            + Upload Sprite
                        </button>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-56 xl:w-64 shrink-0">
                        <SpriteFilters
                            filter={filter}
                            categories={categories}
                            onFilterChange={updateFilter}
                            onCategoryToggle={toggleCategory}
                            onReset={resetFilter}
                        />
                    </div>

                    <div className="flex-1 min-w-0 space-y-6">
                        {data && !loading && (
                            <p className="text-xs text-gray-500">
                                {data.totalElements} sprite{data.totalElements !== 1 ? "s" : ""} found
                            </p>
                        )}

                        <SpriteGrid
                            sprites={data?.content ?? []}
                            loading={loading}
                            error={error}
                            onEdit={user ? openEdit : undefined}
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

            <SavingSpriteForm
                open={modalOpen}
                editingSprite={editingSprite}
                onClose={handleClose}
                onSaved={refresh}
            />
        </div>
    );
}