import { api } from "@/lib/axios";
import type {
    SpriteRequest,
    SpriteResponse,
    SpriteFilterRequest,
    SpriteListResponse,
} from "@/features/sprite/types";
import type { ApiResponse, PageResponse } from "@/features/shared/components/types";

export class SpriteService {
    static async getSprites(
        filter: SpriteFilterRequest,
        page = 0,
        size = 12
    ): Promise<PageResponse<SpriteListResponse>> {
        try {
            const response = await api.get<ApiResponse<PageResponse<SpriteListResponse>>>(
                "/sprites",
                { params: { ...filter, page, size } }
            );
            if (!response.data.success) throw new Error(response.data.message);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }

    static async getMySprites(
        filter: SpriteFilterRequest,
        page = 0,
        size = 12
    ): Promise<PageResponse<SpriteListResponse>> {
        try {
            const response = await api.get<ApiResponse<PageResponse<SpriteListResponse>>>(
                "/sprites/me",
                { params: { ...filter, page, size } }
            );
            if (!response.data.success) throw new Error(response.data.message);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }

    static async getSpritesByUser(
        userId: string,
        filter: SpriteFilterRequest,
        page = 0,
        size = 12
    ): Promise<PageResponse<SpriteListResponse>> {
        try {
            const response = await api.get<ApiResponse<PageResponse<SpriteListResponse>>>(
                `/sprites/user/${userId}`,
                { params: { ...filter, page, size } }
            );
            if (!response.data.success) throw new Error(response.data.message);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }

    static async getById(id: string): Promise<SpriteResponse> {
        try {
            const response = await api.get<ApiResponse<SpriteResponse>>(`/sprites/${id}`);
            if (!response.data.success) throw new Error(response.data.message);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }

    static async create(data: SpriteRequest, image: File): Promise<SpriteResponse> {
        try {
            const response = await api.post<ApiResponse<SpriteResponse>>(
                "/sprites",
                this.buildFormData(data, image)
            );
            if (!response.data.success) throw new Error(response.data.message);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message ?? error.message);
        }
    }

    static async update(
        id: string,
        data: SpriteRequest,
        image?: File
    ): Promise<SpriteResponse> {
        try {
            const response = await api.put<ApiResponse<SpriteResponse>>(
                `/sprites/${id}`,
                this.buildFormData(data, image)
            );
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

    private static buildFormData(data: SpriteRequest, image?: File): FormData {
        const formData = new FormData();
        formData.append(
            "data",
            new Blob([JSON.stringify(data)], { type: "application/json" })
        );
        if (image) formData.append("image", image);
        return formData;
    }

}