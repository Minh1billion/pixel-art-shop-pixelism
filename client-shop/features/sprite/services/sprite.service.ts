import { api } from "@/lib/axios";
import type {
    SpriteRequest,
    SpriteResponse,
    SpriteFilterRequest,
} from "@/features/sprite/types";
import type { ApiResponse, PageResponse } from "@/features/shared/components/types";

export class SpriteService {
    static async getSprites(
        filter: SpriteFilterRequest,
        page = 0,
        size = 12
    ): Promise<PageResponse<SpriteResponse>> {
        try {
            const response = await api.get<ApiResponse<PageResponse<SpriteResponse>>>(
                "/sprites",
                { params: { ...filter, page, size } }
            );
            if (!response.data.success) throw new Error(response.data.message);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }

    static async create(data: SpriteRequest): Promise<SpriteResponse> {
        try {
            const response = await api.post<ApiResponse<SpriteResponse>>("/sprites", data);
            if (!response.data.success) throw new Error(response.data.message);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }

    static async deleteById(id: string): Promise<void> {
        try {
            const response = await api.delete<ApiResponse<null>>(`/sprites/${id}`);
            if (!response.data.success) throw new Error(response.data.message);
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }
}