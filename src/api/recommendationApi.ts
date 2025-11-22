import axios from 'axios';
import { RecommendationResponse } from '../types';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    timeout: 12000, // SRS 3.4.2: 응답 시간 12초 제한 고려 [cite: 213]
});

export const getRecommendation = async (query: string): Promise<RecommendationResponse> => {
    const response = await apiClient.post<RecommendationResponse>('/recommend', { query });
    return response.data;
};