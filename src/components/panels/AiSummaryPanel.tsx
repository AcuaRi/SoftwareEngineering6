// src/components/panels/AiSummaryPanel.tsx
import React, { useEffect, useRef } from 'react';
import './PanelStyles.css'; // 공통 패널 스타일
import { SearchBar } from '../search/SearchBar';
import { ChatMessage, Place } from '../../types';
import { PlaceCarousel } from '../chat/PlaceCarousel';

interface Props {
    messages: ChatMessage[];
    onSearch: (query: string) => void;
    onApplyPlace: (place: Place) => void; // 장소 선택 핸들러
    isLoading: boolean;
}

export const AiSummaryPanel: React.FC<Props> = ({ messages, onSearch, onApplyPlace, isLoading }) => {
    // 자동 스크롤을 위한 Ref
    const bodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTo({
                top: bodyRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages, isLoading]);

    return (
        <div className="panel-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* 헤더: 핑크 그라데이션 */}
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

            {/* 채팅 영역 */}
            <div
                className="panel-body"
                ref={bodyRef}
                style={{
                    backgroundColor: '#fff1f2', // 연한 핑크 배경
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
                            {/* 말풍선 */}
                            <div
                                style={{
                                    backgroundColor: isUser ? '#e11d48' : 'white',
                                    color: isUser ? 'white' : '#374151',
                                    padding: '14px 18px',
                                    borderRadius: '20px',
                                    borderTopRightRadius: isUser ? '4px' : '20px',
                                    borderTopLeftRadius: isUser ? '20px' : '4px',
                                    border: isUser ? 'none' : '1px solid #fce7f3',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    maxWidth: '85%',
                                    lineHeight: '1.6',
                                    whiteSpace: 'pre-wrap',
                                    fontSize: '0.95rem'
                                }}
                            >
                                {msg.text}
                            </div>

                            {/* ★ 장소 캐러셀 (AI 메시지 & 장소 데이터 존재 시) */}
                            {!isUser && msg.places && msg.places.length > 0 && (
                                <div style={{ width: '100%', marginTop: '12px' }}>
                                    <PlaceCarousel places={msg.places} onSelect={onApplyPlace} />
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* 로딩 표시 */}
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

            {/* 입력창 영역 */}
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