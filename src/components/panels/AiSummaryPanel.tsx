// src/components/panels/AiSummaryPanel.tsx
import React, { useEffect, useRef } from 'react';
import './PanelStyles.css'; // 공통 패널 스타일
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

    // 메시지가 추가되거나 로딩 상태가 바뀔 때마다 스크롤을 맨 아래로 부드럽게 이동
    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTo({
                top: bodyRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages, isLoading]);

    return (
        // 전체 패널 컨테이너
        <div className="panel-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* 헤더: 핑크 그라데이션 적용 */}
            <div
                className="panel-header"
                style={{
                    background: 'linear-gradient(to right, #fb7185, #e11d48)',
                    flex: 'none'
                }}
            >
        <span style={{ fontSize: '1.05rem', letterSpacing: '-0.5px' }}>
          🤖 AI 썸플레이스 어시스턴트
        </span>
            </div>

            {/* 채팅 내용 영역 */}
            <div
                className="panel-body"
                ref={bodyRef}
                style={{
                    backgroundColor: '#fff1f2', // 아주 연한 핑크 배경 (대화창 느낌)
                    flex: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    padding: '24px',
                    minHeight: 0
                }}
            >
                {messages.map((msg, index) => {
                    const isUser = msg.role === 'user';

                    return (
                        <div
                            key={index}
                            style={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: isUser ? 'flex-end' : 'flex-start'
                            }}
                        >
                            {/* 말풍선 스타일 */}
                            <div
                                style={{
                                    // ★ 사용자: 진한 핫핑크, AI: 흰색
                                    backgroundColor: isUser ? '#e11d48' : 'white',
                                    color: isUser ? 'white' : '#374151',

                                    padding: '14px 18px',
                                    borderRadius: '20px',
                                    // 말풍선 꼬리 효과
                                    borderTopRightRadius: isUser ? '4px' : '20px',
                                    borderTopLeftRadius: isUser ? '20px' : '4px',

                                    // AI 말풍선은 연한 핑크 테두리로 구분
                                    border: isUser ? 'none' : '1px solid #fce7f3',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',

                                    maxWidth: '85%',
                                    lineHeight: '1.6',
                                    whiteSpace: 'pre-wrap',
                                    fontSize: '0.95rem',
                                    wordBreak: 'keep-all'
                                }}
                            >
                                {msg.text}
                            </div>

                            {/* ★ 코스 추천 캐러셀 (AI 메시지이고, 코스 데이터가 있을 때만 렌더링) */}
                            {!isUser && msg.courses && msg.courses.length > 0 && (
                                <div style={{ width: '100%', marginTop: '12px' }}>
                                    <CourseCarousel courses={msg.courses} onApply={onApplyCourse} />
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* 로딩 인디케이터 */}
                {isLoading && (
                    <div
                        style={{
                            alignSelf: 'flex-start',
                            backgroundColor: 'white',
                            padding: '12px 20px',
                            borderRadius: '20px',
                            borderTopLeftRadius: '4px',
                            border: '1px solid #fce7f3',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                        }}
                    >
            <span className="animate-pulse" style={{ color: '#fb7185', fontWeight: 'bold' }}>
              Thinking... 💭
            </span>
                    </div>
                )}
            </div>

            {/* 하단 입력창 영역 (고정) */}
            <div
                style={{
                    padding: '16px 20px',
                    backgroundColor: 'white',
                    borderTop: '1px solid #fce7f3',
                    flex: 'none'
                }}
            >
                <SearchBar onSearch={onSearch} isLoading={isLoading} />
            </div>
        </div>
    );
};