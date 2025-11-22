import React from 'react';
import './PanelStyles.css';

export const AiSummaryPanel: React.FC<{ summary: string }> = ({ summary }) => {
    return (
        <div className="panel-container">
            <div className="panel-header" style={{ backgroundColor: '#4f46e5' }}>
                <span>🤖 AI 분석 리포트</span>
            </div>
            <div className="panel-body" style={{ backgroundColor: '#eef2ff' }}>
                <p style={{ lineHeight: '1.6', color: '#374151', whiteSpace: 'pre-wrap' }}>
                    {summary || "검색어를 입력하시면 AI가 장소를 추천해 드립니다."}
                </p>
            </div>
        </div>
    );
};