"use client";

import { useState, useEffect } from "react";
import { CategoryService } from "../services/category.service";
import type { CategoryResponse } from "@/features/sprite/types";

let cache: CategoryResponse[] | null = null;

export function useCategories() {
    const [data, setData] = useState<CategoryResponse[]>(cache ?? []);
    const [loading, setLoading] = useState(!cache);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (cache) return;

        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await CategoryService.getAll();
                cache = result;
                setData(result);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { data, loading, error };
}