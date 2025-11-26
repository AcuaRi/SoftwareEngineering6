// src/components/layout/Sidebar.tsx
import React from 'react';
import './Sidebar.css';

interface Props {
    isOpen: boolean;
    onNewChat: () => void;
    // 실제로는 대화 기록 데이터 배열을 받아야겠지만, UI 구현을 위해 임시로 처리
}

export const Sidebar: React.FC<Props> = ({ isOpen, onNewChat }) => {
    // UI 테스트용 더미 데이터
    const recentChats = [
        "서울 데이트 코스 추천",
        "강남역 맛집 리스트",
        "이번 주말 여행지",
        "기념일 분위기 좋은 식당"
    ];

    return (
        <div className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <button className="new-chat-btn" onClick={onNewChat}>
                    <span style={{ marginRight: '8px' }}>+</span> 새로운 대화
                </button>
            </div>

            <div className="sidebar-content">
                <div className="section-label">최근 활동</div>
                <ul className="chat-list">
                    {recentChats.map((title, index) => (
                        <li key={index} className="chat-item">
                            <span className="chat-icon">💬</span>
                            <span className="chat-title">{title}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="sidebar-footer">
                <button className="footer-item">⚙️ 설정</button>
            </div>
        </div>
    );
};