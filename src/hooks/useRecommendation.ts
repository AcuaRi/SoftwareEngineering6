import { useState } from 'react';
import { getMockRecommendation } from '../api/mockRecommendationApi';
import { ChatMessage } from '../types';

export const useRecommendation = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'assistant', text: "안녕하세요! 원하시는 데이트 지역이나 테마를 말씀해주세요." }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const searchPlaces = async (query: string) => {
        if (!query.trim()) return;

        // 1. 유저 메시지 추가
        setMessages(prev => [...prev, { role: 'user', text: query }]);
        setIsLoading(true);

        try {
            // 2. API 호출
            const result = await getMockRecommendation(query);

            // 3. AI 응답 메시지 추가 (여기에 courses를 포함!)
            // ★ 중요: 여기서 우측 패널 데이터를 갱신하지 않음.
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: result.summary,
                courses: result.courses // 코스 후보군 첨부
            }]);

        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: "오류가 발생했습니다." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return { messages, isLoading, searchPlaces };
};