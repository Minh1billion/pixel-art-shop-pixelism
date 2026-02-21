"use client";

import { useState, useEffect } from "react";
import { CategoryService } from "../services/category.service";
import type { CategoryResponse } from "@/features/sprite/types";

export function useCategories() {
    const [data, setData] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await CategoryService.getAll();
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