// src/hooks/useRecommendation.ts
import { useState } from 'react';
import { getMockRecommendation } from '../api/mockRecommendationApi'; // 또는 실제 API
import { RecommendationResponse, ChatMessage } from '../types';

export const useRecommendation = () => {
    // 전체 데이터 상태 (필요 시 유지, 주로 messages 사용)
    const [data, setData] = useState<RecommendationResponse | null>(null);

    // 채팅 메시지 상태 관리
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'assistant', text: "안녕하세요! 설레는 데이트를 위한 장소를 추천해 드릴게요. \n원하시는 지역이나 분위기를 말씀해주세요! 💕" }
    ]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchPlaces = async (query: string) => {
        if (!query.trim()) return;

        // 1. 사용자 메시지 추가
        setMessages(prev => [...prev, { role: 'user', text: query }]);
        setIsLoading(true);
        setError(null);

        try {
            // 2. API 호출
            const result = await getMockRecommendation(query);
            setData(result);

            // 3. AI 응답 메시지 추가 (장소 리스트 포함)
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: result.summary,
                places: result.places // ★ 코스 대신 장소 리스트 전달
            }]);

        } catch (err: any) {
            setError("오류가 발생했습니다.");
            setMessages(prev => [...prev, { role: 'assistant', text: "죄송합니다. 정보를 가져오는 중 오류가 발생했습니다." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return { data, messages, isLoading, error, searchPlaces };
};