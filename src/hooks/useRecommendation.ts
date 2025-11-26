// src/hooks/useRecommendation.ts
import { useState } from 'react';
import { getMockRecommendation } from '../api/mockRecommendationApi';
import { RecommendationResponse } from '../types';

export const useRecommendation = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 단순히 데이터를 가져와서 반환(return)만 함. 저장은 MainPage가 함.
    const searchPlaces = async (query: string): Promise<RecommendationResponse | null> => {
        if (!query.trim()) return null;

        setIsLoading(true);
        setError(null);

        try {
            const result = await getMockRecommendation(query);
            return result;
        } catch (err: any) {
            setError("오류가 발생했습니다.");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, searchPlaces };
};