export interface SpriteRequest {
    name: string;
    categories: string[];
}

export interface SpriteListResponse {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  createdAt: string;
}

export interface SpriteResponse {
    id: string;
    name: string;
    slug: string;
    imageUrl: string;
    categoryIds: string[];
    categoryNames: string[];
    createdBy: string;
    createdAt: string;
}

export interface SpriteFilterRequest {
    categoryIds?: string[];   
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