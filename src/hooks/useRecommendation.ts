import { useState } from 'react';
import { getMockRecommendation } from '../api/mockRecommendationApi';
import { RecommendationResponse } from '../types';

export const useRecommendation = () => {
    const [data, setData] = useState<RecommendationResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchPlaces = async (query: string) => {
        if (!query.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const result = await getMockRecommendation(query);
            setData(result);
        } catch (err: any) {
            setError("오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return { data, isLoading, error, searchPlaces };
};