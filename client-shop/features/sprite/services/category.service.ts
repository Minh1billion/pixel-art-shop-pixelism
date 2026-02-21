import { api } from "@/lib/axios";
import type { CategoryResponse, CategoryRequest } from "@/features/sprite/types";
import type { ApiResponse } from "@/features/shared/components/types";

export class CategoryService {
    static async getAll(): Promise<CategoryResponse[]> {
        try {
            const response = await api.get<ApiResponse<CategoryResponse[]>>("/categories");
            if (!response.data.success) throw new Error(response.data.message);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }

    static async create(data: CategoryRequest): Promise<CategoryResponse> {
        try {
            const response = await api.post<ApiResponse<CategoryResponse>>("/categories", data);
            if (!response.data.success) throw new Error(response.data.message);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }
}