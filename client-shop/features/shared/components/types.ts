export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
    content: T[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;

    page?: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    };
}