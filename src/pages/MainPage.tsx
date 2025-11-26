import React, { useState } from 'react';
import './MainPage.css';
import { AiSummaryPanel } from '../components/panels/AiSummaryPanel';
import { MapPanel } from '../components/panels/MapPanel';
import { PlaceListPanel } from '../components/panels/PlaceListPanel';
import { useRecommendation } from '../hooks/useRecommendation';
import { Place, SavedPlace, Category } from '../types';
import { fetchRoute, RouteResponse, RouteMode } from '../api/routeApi';

const MainPage: React.FC = () => {
    const { data, messages, isLoading, searchPlaces } = useRecommendation();

    // --- 상태 관리 ---

    // 1. 표시할 장소 리스트 (누적됨)
    const [displayedPlaces, setDisplayedPlaces] = useState<Place[]>([]);

    // 2. 선택된 장소 ID
    const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

    // 3. 저장된 장소 리스트
    const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);

    // 4. 길찾기 관련 상태
    const [routeStartId, setRouteStartId] = useState<string | null>(null);
    const [routeEndId, setRouteEndId] = useState<string | null>(null);

    const [routeStartPlace, setRouteStartPlace] = useState<Place | null>(null);
    const [routeEndPlace, setRouteEndPlace] = useState<Place | null>(null);

    const [routeResult, setRouteResult] = useState<RouteResponse | null>(null);
    const [routeMode, setRouteMode] = useState<RouteMode>('car');

    const routePath = routeResult ? routeResult.path : [];

    // --- 헬퍼 함수 ---

    const findPlaceObject = (id: string, category: Category): Place | null => {
        const saved = savedPlaces.find(sp => sp.placeId === id && sp.category === category);
        if (saved) return saved.place;

        const displayed = displayedPlaces.find(p => p.id === id);
        if (displayed) return displayed;

        return null;
    };

    const updateRoute = async (start: Place | null, end: Place | null, mode: RouteMode) => {
        if (start && end) {
            try {
                console.log(`[Route] 탐색 시작: ${start.name} -> ${end.name} (${mode})`);
                const result = await fetchRoute(mode, start, end);
                setRouteResult(result);
            } catch (error) {
                console.error("[Route] 탐색 실패:", error);
                setRouteResult(null);
            }
        } else {
            setRouteResult(null);
        }
    };

    // --- 핸들러 ---

    // 1. [핵심 수정] 캐러셀에서 '지도에서 보기' 클릭 시 -> 리스트에 "추가" (Append)
    const handleApplyPlace = (place: Place) => {
        setDisplayedPlaces((prev) => {
            // 이미 리스트에 있는지 확인 (중복 방지)
            const isAlreadyDisplayed = prev.some((p) => p.id === place.id);

            if (isAlreadyDisplayed) {
                // 이미 있으면 순서만 맨 앞으로 보내거나, 그냥 유지
                // 여기서는 그냥 유지하고 선택만 함
                return prev;
            } else {
                // 없으면 기존 리스트 뒤에 추가
                return [...prev, place];
            }
        });

        // 해당 장소 하이라이트 및 지도 이동
        setSelectedPlaceId(place.id);
    };

    // 2. 지도/리스트 선택
    const handleSelectPlace = (id: string) => {
        setSelectedPlaceId(id);
    };

    // 3. 저장하기
    const handleSavePlace = (place: Place, category: Category) => {
        setSavedPlaces((prev) => {
            const exists = prev.some(sp => sp.placeId === place.id && sp.category === category);
            if (exists) return prev;

            return [...prev, {
                placeId: place.id,
                place,
                category,
                savedAt: Date.now()
            }];
        });
    };

    // 4. 저장 삭제
    const handleRemoveSavedPlace = (placeId: string, category: Category) => {
        setSavedPlaces((prev) =>
            prev.filter(sp => !(sp.placeId === placeId && sp.category === category))
        );

        if (routeStartId === placeId) {
            setRouteStartId(null); setRouteStartPlace(null); setRouteResult(null);
        }
        if (routeEndId === placeId) {
            setRouteEndId(null); setRouteEndPlace(null); setRouteResult(null);
        }
    };

    // 5. 출발지 설정
    const handleSetRouteStart = (placeId: string, category: Category) => {
        setRouteStartId(placeId);
        const placeObj = findPlaceObject(placeId, category);
        setRouteStartPlace(placeObj);

        if (routeEndPlace && placeObj) {
            updateRoute(placeObj, routeEndPlace, routeMode);
        }
    };

    // 6. 도착지 설정
    const handleSetRouteEnd = (placeId: string, category: Category) => {
        setRouteEndId(placeId);
        const placeObj = findPlaceObject(placeId, category);
        setRouteEndPlace(placeObj);

        if (routeStartPlace && placeObj) {
            updateRoute(routeStartPlace, placeObj, routeMode);
        }
    };

    // 7. 이동 수단 변경
    const handleChangeRouteMode = (mode: RouteMode) => {
        setRouteMode(mode);
        if (routeStartPlace && routeEndPlace) {
            updateRoute(routeStartPlace, routeEndPlace, mode);
        }
    };

    // (선택 사항) 리스트 초기화 버튼이 필요하다면 사용할 핸들러
    const handleClearList = () => {
        setDisplayedPlaces([]);
        setSelectedPlaceId(null);
        setRouteResult(null);
    };

    return (
        <div className="main-container">
            <header className="main-header">
                <h1 className="app-title">SomePlace 💕</h1>
                {/* (옵션) 리스트가 차있을 때만 보이는 초기화 버튼 */}
                {displayedPlaces.length > 0 && (
                    <button
                        onClick={handleClearList}
                        style={{
                            position: 'absolute', right: '20px',
                            padding: '8px 12px', border: '1px solid #fecdd3',
                            backgroundColor: 'white', color: '#e11d48',
                            borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem'
                        }}
                    >
                        지도 초기화 ↺
                    </button>
                )}
            </header>

            <main className="main-content">
                <div className="panels-grid">

                    {/* [좌측] AI 대화창 */}
                    <section style={{ height: '100%', minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <AiSummaryPanel
                            messages={messages}
                            onSearch={searchPlaces}
                            onApplyPlace={handleApplyPlace}
                            isLoading={isLoading}
                        />
                    </section>

                    {/* [우측] 지도 + 리스트 */}
                    <section className="right-column">

                        <div className="right-top-panel">
                            <MapPanel
                                places={displayedPlaces}
                                selectedPlaceId={selectedPlaceId}
                                onSelectPlace={handleSelectPlace}

                                routePath={routePath}
                                savedPlaces={savedPlaces}
                                routeStartId={routeStartId}
                                routeEndId={routeEndId}
                                onSavePlace={handleSavePlace}
                                onRemoveSavedPlace={handleRemoveSavedPlace}
                                onSetRouteStart={handleSetRouteStart}
                                onSetRouteEnd={handleSetRouteEnd}
                            />
                        </div>

                        <div className="right-bottom-panel">
                            <PlaceListPanel
                                places={displayedPlaces}
                                selectedPlaceId={selectedPlaceId}
                                onSelectPlace={handleSelectPlace}
                                savedPlaces={savedPlaces}

                                routeMode={routeMode}
                                routeInfo={routeResult ? routeResult.summary : null}
                                routeStartPlace={routeStartPlace}
                                routeEndPlace={routeEndPlace}
                                onChangeRouteMode={handleChangeRouteMode}
                            />
                        </div>

                    </section>

                </div>
            </main>
        </div>
    );
};

export default MainPage;