import React, { useEffect, useRef, useState } from 'react';
import { Place, SavedPlace } from '../../types';
import { RouteMode, RouteSummary } from '../../api/routeApi';
import './PanelStyles.css';

interface Props {
  places: Place[];
  savedPlaces: SavedPlace[];
  selectedPlaceId: string | null;
  onSelectPlace: (id: string) => void;

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
  routeMode,
  routeInfo,
  routeStartPlace,
  routeEndPlace,
  onChangeRouteMode,
}) => {
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [activeTab, setActiveTab] =
    useState<'recommended' | 'saved' | 'route'>('recommended');

  useEffect(() => {
    if (!selectedPlaceId) return;
    if (activeTab !== 'recommended' && activeTab !== 'saved') return;

    const el = itemRefs.current[selectedPlaceId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedPlaceId, activeTab]);

  const recommendedCount = places.length;
  const savedCount = savedPlaces.length;

  const listToRender: Place[] =
    activeTab === 'recommended'
      ? places
      : activeTab === 'saved'
      ? savedPlaces.map((sp) => sp.place)
      : [];

  const isRouteTab = activeTab === 'route';

  const hasStart = !!routeStartPlace;
  const hasEnd = !!routeEndPlace;
  const hasRouteInfo = !!routeInfo;

  return (
    <div className="panel-container">
      {/* 탭 헤더 */}
      <div
        className="panel-header"
        style={{ backgroundColor: '#059669', padding: 0, display: 'flex' }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('recommended')}
          style={{
            flex: 1,
            padding: '8px 10px',
            border: 'none',
            backgroundColor: activeTab === 'recommended' ? '#ecfdf5' : 'transparent',
            color: activeTab === 'recommended' ? '#065f46' : '#d1fae5',
            fontWeight: activeTab === 'recommended' ? 700 : 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          📍 추천 장소 ({recommendedCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('saved')}
          style={{
            flex: 1,
            padding: '8px 10px',
            border: 'none',
            backgroundColor: activeTab === 'saved' ? '#ecfdf5' : 'transparent',
            color: activeTab === 'saved' ? '#065f46' : '#d1fae5',
            fontWeight: activeTab === 'saved' ? 700 : 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          ⭐ 저장한 장소 ({savedCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('route')}
          style={{
            flex: 1,
            padding: '8px 10px',
            border: 'none',
            backgroundColor: activeTab === 'route' ? '#ecfdf5' : 'transparent',
            color: activeTab === 'route' ? '#065f46' : '#d1fae5',
            fontWeight: activeTab === 'route' ? 700 : 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          🧭 경로 안내
        </button>
      </div>

      {/* 본문 */}
      <div className="panel-body">
        {isRouteTab ? (
          // ==========================
          // 🧭 경로 안내 탭
          // ==========================
          hasStart && hasEnd && hasRouteInfo ? (
            <div style={{ fontSize: '0.9rem', color: '#374151' }}>
              <div style={{ marginBottom: 8 }}>
                <strong>출발지:</strong> {routeStartPlace!.name}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>도착지:</strong> {routeEndPlace!.name}
              </div>

              {/* 이동 모드 선택 */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button
                  onClick={() => onChangeRouteMode('car')}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db',
                    backgroundColor: routeMode === 'car' ? '#dcfce7' : '#f9fafb',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  🚗 자차
                </button>
                <button
                  onClick={() => onChangeRouteMode('transit')}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db',
                    backgroundColor: routeMode === 'transit' ? '#dcfce7' : '#f9fafb',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  🚇 대중교통
                </button>
                <button
                  onClick={() => onChangeRouteMode('walk')}
                  style={{
                    flex: 1,
                    padding: '6px 8px',
                    borderRadius: 6,
                    border: '1px solid #d1d5db',
                    backgroundColor: routeMode === 'walk' ? '#dcfce7' : '#f9fafb',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  🚶 도보
                </button>
              </div>

              {/* 소요 시간/거리 */}
              <div
                style={{
                  backgroundColor: '#f3f4f6',
                  padding: 10,
                  borderRadius: 8,
                  lineHeight: 1.5,
                }}
              >
                <div style={{ marginBottom: 4 }}>
                  ⏱ 예상 소요 시간:{' '}
                  <strong>{Math.round(routeInfo!.duration / 60)}분</strong>
                </div>
                <div>
                  📏 이동 거리:{' '}
                  <strong>{(routeInfo!.distance / 1000).toFixed(1)} km</strong>
                </div>
              </div>
            </div>
          ) : hasStart && hasEnd && !hasRouteInfo ? (
            <p className="empty-text">
              출발지와 도착지는 선택되었지만 경로 정보를 불러오지 못했습니다.
              경로 API 호출이 실패했을 수 있습니다.
            </p>
          ) : (
            <p className="empty-text">
              출발지와 도착지를 지도 마커에서 설정하면 경로가 여기 표시됩니다.
            </p>
          )
        ) : (
          // ==========================
          // 📍 추천 / ⭐ 저장 탭
          // ==========================
          <>
            {listToRender.length === 0 ? (
              <p className="empty-text">
                {activeTab === 'recommended'
                  ? '추천 결과 없음'
                  : '저장한 장소가 없습니다.'}
              </p>
            ) : (
              listToRender.map((place) => {
                const isSelected = selectedPlaceId === place.id;
                const saved = savedPlaces.find((sp) => sp.placeId === place.id);

                const categoryLabel =
                  saved?.category === 'restaurant'
                    ? '음식점'
                    : saved?.category === 'cafe'
                    ? '카페'
                    : saved?.category === 'spot'
                    ? '가볼만한 곳'
                    : null;

                const categoryColor =
                  saved?.category === 'restaurant'
                    ? '#ef4444'
                    : saved?.category === 'cafe'
                    ? '#22c55e'
                    : saved?.category === 'spot'
                    ? '#3b82f6'
                    : '#6b7280';

                return (
                  <div
                    key={place.id}
                    ref={(el) => {
                      itemRefs.current[place.id] = el;
                    }}
                    onClick={() => onSelectPlace(place.id)}
                    style={{
                      backgroundColor: isSelected ? '#ecfdf5' : 'white',
                      borderColor: isSelected ? '#059669' : '#e5e7eb',
                      borderWidth: isSelected ? '2px' : '1px',
                      borderStyle: 'solid',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                      padding: '12px',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      cursor: 'pointer',
                      boxShadow: isSelected
                        ? '0 4px 6px rgba(5, 150, 105, 0.2)'
                        : '0 1px 2px rgba(0,0,0,0.05)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '4px',
                        alignItems: 'center',
                      }}
                    >
                      <strong
                        style={{ fontSize: '0.95rem', color: '#1f2937' }}
                      >
                        {place.name}
                      </strong>

                      {activeTab === 'recommended' ? (
                        <span
                          style={{
                            backgroundColor: '#ecfdf5',
                            color: '#059669',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                          }}
                        >
                          ★ {place.rating}
                        </span>
                      ) : (
                        categoryLabel && (
                          <span
                            style={{
                              backgroundColor: '#f9fafb',
                              color: categoryColor,
                              padding: '2px 6px',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            {categoryLabel}
                          </span>
                        )
                      )}
                    </div>

                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: '#6b7280',
                        marginBottom: '8px',
                      }}
                    >
                      {place.address}
                    </p>

                    <div
                      style={{
                        backgroundColor: isSelected ? 'white' : '#f3f4f6',
                        padding: '8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        color: '#4b5563',
                      }}
                    >
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
