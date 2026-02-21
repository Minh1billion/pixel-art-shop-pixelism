"use client";

import { useState, useCallback } from "react";
import type { SpriteFilterRequest } from "@/features/sprite/types";

const DEFAULT_FILTER: SpriteFilterRequest = {
    keyword: "",
    categoryIds: [],
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
};

export function useSpriteFilter(initial?: Partial<SpriteFilterRequest>) {
    const [filter, setFilter] = useState<SpriteFilterRequest>({
        ...DEFAULT_FILTER,
        ...initial,
    });

    const updateFilter = useCallback((updates: Partial<SpriteFilterRequest>) => {
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