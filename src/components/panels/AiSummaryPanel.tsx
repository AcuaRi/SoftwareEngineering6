// src/components/panels/AiSummaryPanel.tsx
import React, { useEffect, useRef } from 'react';
import './PanelStyles.css';
import { SearchBar } from '../search/SearchBar';
import { ChatMessage, Course } from '../../types';
import { CourseCarousel } from '../chat/CourseCarousel';

interface Props {
    messages: ChatMessage[];
    onSearch: (query: string) => void;
    onApplyCourse: (course: Course) => void;
    isLoading: boolean;
}

export const AiSummaryPanel: React.FC<Props> = ({ messages, onSearch, onApplyCourse, isLoading }) => {
    // 스크롤 될 영역(div)을 잡기 위한 ref
    const bodyRef = useRef<HTMLDivElement>(null);

    // ★ 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTo({
                top: bodyRef.current.scrollHeight,
                behavior: 'smooth', // 부드럽게 스르륵 이동
            });
        }
    }, [messages, isLoading]); // 메시지가 오거나 로딩 상태가 바뀔 때 실행

    return (
        // ★ style 수정: height: 100%를 주어 부모 영역을 가득 채움
        <div className="panel-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* 헤더 (고정) */}
            <div className="panel-header" style={{ backgroundColor: '#4f46e5', flex: 'none' }}>
                <span>🤖 AI Place Assistant</span>
            </div>

            {/* ★ 채팅 내용 영역 (가변 + 스크롤) */}
            <div
                className="panel-body"
                ref={bodyRef} // Ref 연결
                style={{
                    backgroundColor: '#f3f4f6',
                    flex: 1, // 남은 공간 모두 차지
                    overflowY: 'auto', // ★ 핵심: 내용이 넘치면 여기에만 스크롤바 생성
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    padding: '20px',
                    minHeight: 0 // Flex 아이템 축소 허용
                }}
            >
                {messages.map((msg, index) => {
                    const isUser = msg.role === 'user';
                    return (
                        <div key={index} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                            {/* 말풍선 */}
                            <div style={{
                                backgroundColor: isUser ? '#4f46e5' : 'white',
                                color: isUser ? 'white' : '#374151',
                                padding: '12px 16px',
                                borderRadius: '16px',
                                borderTopRightRadius: isUser ? '4px' : '16px',
                                borderTopLeftRadius: isUser ? '16px' : '4px',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                maxWidth: '85%',
                                lineHeight: '1.5',
                                whiteSpace: 'pre-wrap',
                                fontSize: '0.95rem'
                            }}>
                                {msg.text}
                            </div>

                            {/* 캐러셀 */}
                            {!isUser && msg.courses && msg.courses.length > 0 && (
                                <div style={{ width: '100%', marginTop: '8px' }}>
                                    <CourseCarousel courses={msg.courses} onApply={onApplyCourse} />
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* 로딩 표시 */}
                {isLoading && (
                    <div style={{ alignSelf: 'flex-start', backgroundColor: 'white', padding: '12px', borderRadius: '16px', borderTopLeftRadius: '4px' }}>
                        <span className="animate-pulse text-gray-400">...</span>
                    </div>
                )}
            </div>

            {/* ★ 하단 입력창 (고정) */}
            <div style={{
                padding: '16px',
                backgroundColor: 'white',
                borderTop: '1px solid #e5e7eb',
                flex: 'none' // 크기 고정
            }}>
                <SearchBar onSearch={onSearch} isLoading={isLoading} />
            </div>
        </div>
    );
};