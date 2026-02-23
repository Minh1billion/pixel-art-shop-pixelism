import { api } from "@/lib/axios";
import type { UserListResponse } from "@/features/user/types";
import type { ApiResponse, PageResponse } from "@/features/shared/components/types";

export class UserService {
  static async getAll(
    keyword?: string,
    page = 0,
    size = 12
  ): Promise<PageResponse<UserListResponse>> {
    try {
      const response = await api.get<ApiResponse<PageResponse<UserListResponse>>>(
        "/users",
        { params: { keyword, page, size } }
      );
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message ?? error.message);
    }
  }
}