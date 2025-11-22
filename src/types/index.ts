// src/types/index.ts
export interface Place {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    category: string;
    rating: number;
    reviewSummary: string;
}

export interface RecommendationResponse {
    summary: string;
    places: Place[];
}