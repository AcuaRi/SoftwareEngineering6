import { RecommendationResponse } from '../types';
import { MOCK_RESPONSE_YONGSAN } from '../mocks/data';

export const getMockRecommendation = (query: string): Promise<RecommendationResponse> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_RESPONSE_YONGSAN);
        }, 1500);
    });
};