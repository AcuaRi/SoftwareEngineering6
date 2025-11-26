// src/components/panels/AiSummaryPanel.tsx
import React, { useEffect, useRef } from 'react';
import './PanelStyles.css';
import { SearchBar } from '../search/SearchBar';
import { ChatMessage, Place } from '../../types';
import { PlaceCarousel } from '../chat/PlaceCarousel';

interface Props {
    messages: ChatMessage[];
    onSearch: (query: string) => void;
    onApplyPlace: (place: Place) => void;
    isLoading: boolean;
    onToggleSidebar: () => void; // ★ 추가: 사이드바 토글 핸들러
}

export const AiSummaryPanel: React.FC<Props> = ({ messages, onSearch, onApplyPlace, isLoading, onToggleSidebar }) => {
    const bodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    return (
        <div className="panel-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', border: 'none', borderRadius: 0, boxShadow: 'none' }}>

            {/* 헤더 변경: 메뉴 버튼 추가 및 심플하게 */}
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                {/* 햄버거 메뉴 버튼 */}
                <button
                    onClick={onToggleSidebar}
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '1.5rem', marginRight: '16px', color: '#64748b',
                        padding: '4px', display: 'flex', alignItems: 'center'
                    }}
                >
                    ☰
                </button>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#e11d48' }}>SomePlace AI</span>
            </div>

            <div
                className="panel-body"
                ref={bodyRef}
                style={{
                    backgroundColor: '#fff', // 제미나이처럼 흰색 배경
                    flex: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    padding: '20px 10%', // 중앙 정렬 느낌을 위해 좌우 여백 줌
                    minHeight: 0
                }}
            >
                {messages.map((msg, index) => {
                    const isUser = msg.role === 'user';
                    return (
                        <div key={index} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                            {/* 말풍선 */}
                            <div style={{
                                backgroundColor: isUser ? '#f1f5f9' : 'transparent', // 유저는 회색 박스, AI는 투명
                                color: '#334155',
                                padding: isUser ? '12px 20px' : '0',
                                borderRadius: '24px',
                                maxWidth: '85%',
                                lineHeight: '1.7',
                                whiteSpace: 'pre-wrap',
                                fontSize: '1rem'
                            }}>
                                {/* AI 아이콘 표시 */}
                                {!isUser && <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#e11d48' }}>✨ 답변</div>}
                                {msg.text}
                            </div>

                            {!isUser && msg.places && msg.places.length > 0 && (
                                <div style={{ width: '100%', marginTop: '16px' }}>
                                    <PlaceCarousel places={msg.places} onSelect={onApplyPlace} />
                                </div>
                            )}
                        </div>
                    );
                })}

                {isLoading && (
                    <div style={{ alignSelf: 'flex-start', padding: '10px' }}>
                        <span className="animate-pulse" style={{ color: '#e11d48' }}>● ● ●</span>
                    </div>
                )}
            </div>

            <div style={{ padding: '20px 10%', backgroundColor: 'white' }}>
                <SearchBar onSearch={onSearch} isLoading={isLoading} />
                <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.75rem', color: '#94a3b8' }}>
                    AI는 실수를 할 수 있습니다. 중요한 정보는 확인해 주세요.
                </div>
            </div>
        </div>
    );
};