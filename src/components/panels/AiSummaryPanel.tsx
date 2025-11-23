import React, { useEffect, useRef } from 'react';
import './PanelStyles.css';
import { SearchBar } from '../search/SearchBar';
import { ChatMessage } from '../../types';

interface Props {
    messages: ChatMessage[]; // ★ 변경: 문자열 대신 메시지 배열 받음
    onSearch: (query: string) => void;
    isLoading: boolean;
}

export const AiSummaryPanel: React.FC<Props> = ({ messages, onSearch, isLoading }) => {
    // 자동 스크롤을 위한 Ref
    const scrollRef = useRef<HTMLDivElement>(null);

    // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="panel-container" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="panel-header" style={{ backgroundColor: '#4f46e5' }}>
                <span>🤖 AI Place Assistant</span>
            </div>

            {/* 채팅 영역 */}
            <div
                className="panel-body"
                ref={scrollRef} // 스크롤 타겟 설정
                style={{
                    backgroundColor: '#f3f4f6',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px', // 말풍선 간 간격
                    padding: '20px'
                }}
            >
                {messages.map((msg, index) => {
                    const isUser = msg.role === 'user';
                    return (
                        <div
                            key={index}
                            style={{
                                alignSelf: isUser ? 'flex-end' : 'flex-start', // 내 말은 오른쪽, AI는 왼쪽
                                backgroundColor: isUser ? '#4f46e5' : 'white', // 내 말은 파란색, AI는 흰색
                                color: isUser ? 'white' : '#374151',
                                padding: '12px 16px',
                                borderRadius: '16px',
                                borderTopRightRadius: isUser ? '4px' : '16px', // 말꼬리 효과
                                borderTopLeftRadius: isUser ? '16px' : '4px',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                maxWidth: '85%',
                                lineHeight: '1.5',
                                whiteSpace: 'pre-wrap',
                                fontSize: '0.95rem'
                            }}
                        >
                            {msg.text}
                        </div>
                    );
                })}

                {/* 로딩 중일 때 말 줄임표 애니메이션 효과 (선택사항) */}
                {isLoading && (
                    <div style={{ alignSelf: 'flex-start', backgroundColor: 'white', padding: '12px', borderRadius: '16px', borderTopLeftRadius: '4px' }}>
                        <span className="animate-pulse">...</span>
                    </div>
                )}
            </div>

            <div style={{ padding: '16px', backgroundColor: 'white', borderTop: '1px solid #e5e7eb' }}>
                <SearchBar onSearch={onSearch} isLoading={isLoading} />
            </div>
        </div>
    );
};