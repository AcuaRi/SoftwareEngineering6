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

// ★ 추가: 채팅 메시지 타입
export interface ChatMessage {
    role: 'user' | 'assistant'; // user: 사용자, assistant: AI
    text: string;
}