import { useState } from 'react';
import { getMockRecommendation } from '../api/mockRecommendationApi'; // 또는 실제 API
import { RecommendationResponse, ChatMessage } from '../types';

export const useRecommendation = () => {
    const [data, setData] = useState<RecommendationResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ★ 추가: 대화 기록 상태 관리 (초기값: 환영 메시지)
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'assistant', text: "안녕하세요! 어디로 떠나고 싶으신가요?\n장소, 목적, 인원을 말씀해주시면 최고의 코스를 추천해 드릴게요." }
    ]);

    const searchPlaces = async (query: string) => {
        if (!query.trim()) return;

        // 1. 사용자 메시지 추가
        const userMsg: ChatMessage = { role: 'user', text: query };
        setMessages(prev => [...prev, userMsg]);

        setIsLoading(true);
        setError(null);

        try {
            // API 호출
            const result = await getMockRecommendation(query);

            // 2. 데이터 갱신
            setData(result);

            // 3. AI 응답 메시지 추가
            const aiMsg: ChatMessage = { role: 'assistant', text: result.summary };
            setMessages(prev => [...prev, aiMsg]);

        } catch (err: any) {
            setError("오류가 발생했습니다.");
            // 에러 발생 시에도 메시지로 알려주면 좋음
            setMessages(prev => [...prev, { role: 'assistant', text: "죄송합니다. 정보를 가져오는 중 오류가 발생했습니다." }]);
        } finally {
            setIsLoading(false);
        }
    };

    // messages 상태도 반환
    return { data, messages, isLoading, error, searchPlaces };
};