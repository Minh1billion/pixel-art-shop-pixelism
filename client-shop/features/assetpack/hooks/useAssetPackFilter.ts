"use client";

import { useState, useCallback } from "react";
import type { AssetPackFilterRequest } from "@/features/assetpack/types";

const DEFAULT_FILTER: AssetPackFilterRequest = {
    keyword: "",
    categoryIds: [],
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
};

export function useAssetPackFilter(initial?: Partial<AssetPackFilterRequest>) {
    const [filter, setFilter] = useState<AssetPackFilterRequest>({
        ...DEFAULT_FILTER,
        ...initial,
    });

    const updateFilter = useCallback((updates: Partial<AssetPackFilterRequest>) => {
        setFilter((prev) => ({ ...prev, ...updates }));
    }, []);

    const resetFilter = useCallback(() => {
        setFilter(DEFAULT_FILTER);
    }, []);

    const toggleCategory = useCallback((id: string) => {
        setFilter((prev) => {
            const ids = prev.categoryIds ?? [];
            return {
                ...prev,
                categoryIds: ids.includes(id)
                    ? ids.filter((c) => c !== id)
                    : [...ids, id],
            };
        });
    }, []);

    return { filter, updateFilter, resetFilter, toggleCategory };
}