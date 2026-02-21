"use client";

import { useState, useCallback } from "react";

export function usePagination(initialPage = 0, initialSize = 12) {
    const [page, setPage] = useState(initialPage);
    const [size] = useState(initialSize);

    const goToPage = useCallback((p: number) => setPage(p), []);
    const nextPage = useCallback(() => setPage((p) => p + 1), []);
    const prevPage = useCallback(() => setPage((p) => Math.max(0, p - 1)), []);
    const reset = useCallback(() => setPage(0), []);

    return { page, size, goToPage, nextPage, prevPage, reset };
}