import React, { useState } from 'react';
import './MainPage.css';
import { Sidebar } from '../components/layout/Sidebar'; // ★ 신규 사이드바
import { AiSummaryPanel } from '../components/panels/AiSummaryPanel';
import { MapPanel } from '../components/panels/MapPanel';
import { PlaceListPanel } from '../components/panels/PlaceListPanel';
import { useRecommendation } from '../hooks/useRecommendation';
import { Place, SavedPlace } from '../types';
import { fetchRoute, RouteResponse, RouteMode } from '../api/routeApi';

const MainPage: React.FC = () => {
    const { data, messages, isLoading, searchPlaces } = useRecommendation();

    // --- UI 상태 ---
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 사이드바 열림 여부
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false); // ★ 우측 패널 열림 여부

    // --- 데이터 상태 ---
    const [displayedPlaces, setDisplayedPlaces] = useState<Place[]>([]);
    const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
    const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
    const [routeStartId, setRouteStartId] = useState<string | null>(null);
    const [routeEndId, setRouteEndId] = useState<string | null>(null);
    const [routeResult, setRouteResult] = useState<RouteResponse | null>(null);
    const [routeMode, setRouteMode] = useState<RouteMode>('car');

    // --- 헬퍼 함수 ---
    const getPlaceById = (id: string | null): Place | null => {
        if (!id) return null;
        const allPlaces = [...displayedPlaces, ...savedPlaces.map(sp => sp.place)];
        return allPlaces.find(p => p.id === id) || null;
    };

    // --- 핸들러 ---

    // 1. [캐러셀]에서 '지도에서 보기' 클릭 시 -> 우측 패널 열기!
    const handleApplyPlace = (place: Place) => {
        if (data?.places) setDisplayedPlaces(data.places);
        else setDisplayedPlaces([place]);

        setSelectedPlaceId(place.id);

        // ★ 핵심: 우측 패널 자동으로 열기
        setIsInfoPanelOpen(true);
        // 모바일이라면 사이드바는 닫아주는 센스 (선택)
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const handleSelectPlace = (id: string) => setSelectedPlaceId(id);

    const handleSavePlace = (place: Place, category: any) => {
        setSavedPlaces((prev) => {
            const isSaved = prev.some((sp) => sp.placeId === place.id);
            if (isSaved) return prev.filter((sp) => sp.placeId !== place.id);
            return [...prev, { placeId: place.id, place, category, savedAt: Date.now() }];
        });
    };

    const handleRemoveSavedPlace = (placeId: string, category: any) => {
        setSavedPlaces(prev => prev.filter(sp => sp.placeId !== placeId));
    };

    const requestRoute = async (startId: string, endId: string, mode: RouteMode) => {
        const start = getPlaceById(startId);
        const end = getPlaceById(endId);
        if (start && end) {
            try {
                const result = await fetchRoute(mode, start, end);
                setRouteResult(result);
            } catch (e) { alert("경로를 찾을 수 없습니다."); }
        }
    };

    const handleSetRouteStart = (id: string) => {
        setRouteStartId(id);
        if (routeEndId && id !== routeEndId) requestRoute(id, routeEndId, routeMode);
    };

    const handleSetRouteEnd = (id: string) => {
        setRouteEndId(id);
        if (routeStartId && routeStartId !== id) requestRoute(routeStartId, id, routeMode);
    };

    const handleChangeRouteMode = (mode: RouteMode) => {
        setRouteMode(mode);
        if (routeStartId && routeEndId) requestRoute(routeStartId, routeEndId, mode);
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeInfoPanel = () => setIsInfoPanelOpen(false);

    return (
        <div className="main-container">
            {/* 1. 좌측 사이드바 */}
            <Sidebar
                isOpen={isSidebarOpen}
                onNewChat={() => window.location.reload()} // 임시: 새로고침
            />

            {/* 2. 중앙 AI 대화 패널 */}
            <div className="center-panel">
                <AiSummaryPanel
                    messages={messages}
                    onSearch={searchPlaces}
                    onApplyPlace={handleApplyPlace}
                    isLoading={isLoading}
                    onToggleSidebar={toggleSidebar} // 토글 함수 전달
                />
            </div>

            {/* 3. 우측 정보 패널 (지도 + 리스트) - 조건부 렌더링 클래스 */}
            <div className={`info-panel-wrapper ${isInfoPanelOpen ? 'open' : ''}`}>
                <div className="info-panel-content">
                    {/* 우측 패널 헤더 (닫기 버튼) */}
                    <div className="info-header">
                        <span style={{fontWeight:'bold', color:'#334155'}}>지도 & 상세정보</span>
                        <button className="close-btn" onClick={closeInfoPanel} title="패널 닫기">✖</button>
                    </div>

                    {/* 지도 */}
                    <div className="right-top-panel">
                        <MapPanel
                            places={displayedPlaces}
                            selectedPlaceId={selectedPlaceId}
                            onSelectPlace={handleSelectPlace}
                            routePath={routeResult?.path}
                            savedPlaces={savedPlaces}
                            routeStartId={routeStartId}
                            routeEndId={routeEndId}
                            onSavePlace={handleSavePlace}
                            onRemoveSavedPlace={handleRemoveSavedPlace}
                            onSetRouteStart={handleSetRouteStart}
                            onSetRouteEnd={handleSetRouteEnd}
                        />
                    </div>

                    {/* 리스트 */}
                    <div className="right-bottom-panel">
                        <PlaceListPanel
                            places={displayedPlaces}
                            selectedPlaceId={selectedPlaceId}
                            onSelectPlace={handleSelectPlace}
                            savedPlaces={savedPlaces}
                            routeMode={routeMode}
                            routeInfo={routeResult ? routeResult.summary : null}
                            routeStartPlace={getPlaceById(routeStartId)}
                            routeEndPlace={getPlaceById(routeEndId)}
                            onChangeRouteMode={handleChangeRouteMode}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;