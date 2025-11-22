import React, { useEffect, useRef } from 'react';
import { Place } from '../../types';
import './PanelStyles.css';

interface Props {
    places: Place[];
    selectedPlaceId: string | null;
    onSelectPlace: (id: string) => void;
}

export const PlaceListPanel: React.FC<Props> = ({ places, selectedPlaceId, onSelectPlace }) => {
    const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    useEffect(() => {
        if (selectedPlaceId && itemRefs.current[selectedPlaceId]) {
            itemRefs.current[selectedPlaceId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [selectedPlaceId]);

    return (
        <div className="panel-container">
            <div className="panel-header" style={{ backgroundColor: '#059669' }}>
                <span>📍 추천 장소 목록 ({places.length})</span>
            </div>
            <div className="panel-body">
                {places.length === 0 ? <p className="empty-text">결과 없음</p> : places.map((place) => {
                    const isSelected = selectedPlaceId === place.id;
                    return (
                        <div
                            key={place.id}
                            // ★ TS 에러 수정: 중괄호 {} 사용
                            ref={(el) => { itemRefs.current[place.id] = el; }}
                            onClick={() => onSelectPlace(place.id)}
                            style={{
                                backgroundColor: isSelected ? '#ecfdf5' : 'white',
                                borderColor: isSelected ? '#059669' : '#e5e7eb',
                                borderWidth: isSelected ? '2px' : '1px',
                                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                transition: 'all 0.2s ease',
                                padding: '12px', borderRadius: '8px', marginBottom: '12px', cursor: 'pointer',
                                boxShadow: isSelected ? '0 4px 6px rgba(5, 150, 105, 0.2)' : '0 1px 2px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <strong style={{ fontSize: '0.95rem', color: '#1f2937' }}>{place.name}</strong>
                                <span style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>★ {place.rating}</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '8px' }}>{place.address}</p>
                            <div style={{ backgroundColor: isSelected ? 'white' : '#f3f4f6', padding: '8px', borderRadius: '4px', fontSize: '0.8rem', color: '#4b5563' }}>💡 {place.reviewSummary}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};