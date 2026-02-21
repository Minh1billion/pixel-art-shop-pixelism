export interface SpriteRequest {
    name: string;
    description: string;
    price: number;
    categories: string[];
}

export interface SpriteResponse {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    imageUrl: string;
    categoryIds: string[];
    categoryNames: string[];
    createdBy: string;
    createdAt: string;
}

export interface SpriteFilterRequest {
    categoryIds?: string[];   
    minPrice?: number;
    maxPrice?: number;
    keyword?: string;
    sortBy?: 'price' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface CategoryResponse {
    id: string;
    name: string;
    slug: string;
    description: string;
    createdAt: string;
}

export interface CategoryRequest {
    name: string;
    description: string;
}