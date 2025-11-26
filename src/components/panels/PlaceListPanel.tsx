import React, { useEffect, useRef, useState } from 'react';
import { Place, SavedPlace } from '../../types';
import { RouteMode, RouteSummary } from '../../api/routeApi';
import './PanelStyles.css';

interface Props {
    places: Place[];
    savedPlaces: SavedPlace[];
    selectedPlaceId: string | null;
    onSelectPlace: (id: string) => void;
    // ★ 추가: 삭제 핸들러
    onRemovePlace: (id: string) => void;

    routeMode: RouteMode;
    routeInfo: RouteSummary | null;
    routeStartPlace: Place | null;
    routeEndPlace: Place | null;
    onChangeRouteMode: (mode: RouteMode) => void;
}

export const PlaceListPanel: React.FC<Props> = ({
                                                    places,
                                                    savedPlaces,
                                                    selectedPlaceId,
                                                    onSelectPlace,
                                                    onRemovePlace, // props 받기
                                                    routeMode,
                                                    routeInfo,
                                                    routeStartPlace,
                                                    routeEndPlace,
                                                    onChangeRouteMode,
                                                }) => {
    const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
    const [activeTab, setActiveTab] = useState<'recommended' | 'saved' | 'route'>('recommended');

    // ... (스크롤 useEffect 등 기존 로직 동일) ...

    const listToRender = activeTab === 'recommended' ? places : savedPlaces.map(sp => sp.place);
    const isRouteTab = activeTab === 'route';

    return (
        <div className="panel-container">
            {/* 탭 헤더 (기존 동일) */}
            <div className="panel-header" style={{ padding: 0, display: 'flex', background: 'white', borderBottom: '1px solid #fce7f3' }}>
                <button onClick={() => setActiveTab('recommended')} style={{ flex: 1, padding: '12px 0', border: 'none', borderBottom: activeTab === 'recommended' ? '3px solid #e11d48' : '3px solid transparent', background: 'transparent', color: activeTab === 'recommended' ? '#e11d48' : '#9ca3af', fontWeight: 'bold', cursor: 'pointer' }}>
                    추천 ({places.length})
                </button>
                <button onClick={() => setActiveTab('saved')} style={{ flex: 1, padding: '12px 0', border: 'none', borderBottom: activeTab === 'saved' ? '3px solid #e11d48' : '3px solid transparent', background: 'transparent', color: activeTab === 'saved' ? '#e11d48' : '#9ca3af', fontWeight: 'bold', cursor: 'pointer' }}>
                    저장 ({savedPlaces.length})
                </button>
                <button onClick={() => setActiveTab('route')} style={{ flex: 1, padding: '12px 0', border: 'none', borderBottom: activeTab === 'route' ? '3px solid #e11d48' : '3px solid transparent', background: 'transparent', color: activeTab === 'route' ? '#e11d48' : '#9ca3af', fontWeight: 'bold', cursor: 'pointer' }}>
                    경로 안내
                </button>
            </div>

            <div className="panel-body" style={{ backgroundColor: '#fff', padding: '16px' }}>
                {/* ... (경로 탭 내용은 기존 동일) ... */}
                {isRouteTab ? (
                    // (경로 탭 코드 생략 - 기존과 동일)
                    <div className="empty-text">경로 안내 탭입니다.</div>
                ) : (
                    <>
                        {listToRender.length === 0 ? (
                            <div className="empty-text">
                                {activeTab === 'recommended' ? '추천 목록이 비어있습니다.' : '저장된 장소가 없습니다.'}
                            </div>
                        ) : (
                            listToRender.map((place) => {
                                const isSelected = selectedPlaceId === place.id;
                                return (
                                    <div
                                        key={place.id}
                                        ref={(el) => { itemRefs.current[place.id] = el; }}
                                        onClick={() => onSelectPlace(place.id)}
                                        style={{
                                            backgroundColor: isSelected ? '#fff1f2' : 'white',
                                            borderColor: isSelected ? '#fb7185' : '#f3f4f6',
                                            borderWidth: isSelected ? '2px' : '1px',
                                            borderStyle: 'solid',
                                            borderRadius: '12px',
                                            marginBottom: '12px',
                                            cursor: 'pointer',
                                            position: 'relative', // 삭제 버튼 배치를 위해 relative
                                            padding: '16px',
                                            boxShadow: isSelected ? '0 4px 12px rgba(251, 113, 133, 0.2)' : '0 1px 2px rgba(0,0,0,0.05)',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {/* ★ 삭제 버튼 (추천 탭일 때만 표시) */}
                                        {activeTab === 'recommended' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // 카드 클릭 방지
                                                    onRemovePlace(place.id);
                                                }}
                                                style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    right: '8px',
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#9ca3af',
                                                    fontSize: '1.1rem',
                                                    cursor: 'pointer',
                                                    padding: '4px',
                                                    lineHeight: 1
                                                }}
                                                title="목록에서 제거"
                                            >
                                                ✖
                                            </button>
                                        )}

                                        <div style={{ marginBottom: '6px', paddingRight: '24px' }}> {/* 버튼 공간 확보 */}
                                            <strong style={{ fontSize: '1rem', color: '#1f2937' }}>{place.name}</strong>
                                            <span style={{ marginLeft: '8px', backgroundColor: '#fff1f2', color: '#e11d48', padding: '2px 6px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        ★ {place.rating}
                      </span>
                                        </div>

                                        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '8px' }}>{place.address}</p>
                                        <div style={{ backgroundColor: isSelected ? 'white' : '#f9fafb', padding: '8px', borderRadius: '8px', fontSize: '0.85rem', color: '#4b5563' }}>
                                            💡 {place.reviewSummary}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </>
                )}
            </div>
        </div>
    );
};