import type { PageResponse } from "@/features/shared/components/types";

export function normalizePage<T>(data: PageResponse<T>): PageResponse<T> {
    if (data.page) {
        return {
            ...data,
            number: data.page.number,
            size: data.page.size,
            totalElements: data.page.totalElements,
            totalPages: data.page.totalPages,
        };
    }
    return data;
}