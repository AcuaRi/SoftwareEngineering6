import React, { useState } from 'react';
import './MainPage.css';
import { Sidebar } from '../components/layout/Sidebar';
import { AiSummaryPanel } from '../components/panels/AiSummaryPanel';
import { MapPanel } from '../components/panels/MapPanel';
import { PlaceListPanel } from '../components/panels/PlaceListPanel';
import { useRecommendation } from '../hooks/useRecommendation';
import { useChatStore } from '../hooks/useChatStore';
import { Place, SavedPlace, Category } from '../types';
import { fetchRoute, RouteResponse, RouteMode } from '../api/routeApi';

const MainPage: React.FC = () => {
    // 1. 훅 초기화
    // useRecommendation은 이제 API 호출 담당 (데이터 상태 X)
    const { isLoading, searchPlaces } = useRecommendation();

    // 채팅 기록 및 세션 관리는 chatStore가 담당
    const chatStore = useChatStore();

    // 2. UI 상태 (패널 열림/닫힘)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);

    // 3. 데이터 상태 (지도/리스트용)
    const [displayedPlaces, setDisplayedPlaces] = useState<Place[]>([]);
    const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
    const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);

    // 4. 길찾기 상태
    const [routeStartId, setRouteStartId] = useState<string | null>(null);
    const [routeEndId, setRouteEndId] = useState<string | null>(null);
    const [routeResult, setRouteResult] = useState<RouteResponse | null>(null);
    const [routeMode, setRouteMode] = useState<RouteMode>('car');

    // --- 헬퍼 함수 ---

    // ID로 장소 객체 찾기 (화면에 있는 장소 + 저장된 장소 모두 검색)
    const getPlaceById = (id: string | null): Place | null => {
        if (!id) return null;
        const allPlaces = [
            ...displayedPlaces,
            ...savedPlaces.map(sp => sp.place)
        ];
        return allPlaces.find(p => p.id === id) || null;
    };

    // --- 핸들러: 검색 및 채팅 ---

    // 사용자가 검색어를 입력했을 때
    const handleSearch = async (query: string) => {
        // 1. 사용자 메시지 추가
        chatStore.addMessage({ role: 'user', text: query });

        // 2. API 호출
        const result = await searchPlaces(query);

        // 3. 결과 처리
        if (result) {
            chatStore.addMessage({
                role: 'assistant',
                text: result.summary,
                places: result.places
            });
        } else {
            chatStore.addMessage({
                role: 'assistant',
                text: "죄송합니다. 정보를 가져오는 중 오류가 발생했습니다."
            });
        }
    };

    // 새 채팅 버튼
    const handleNewChat = () => {
        chatStore.startNewChat();
        setIsInfoPanelOpen(false); // 우측 패널 닫기
        setDisplayedPlaces([]);    // 리스트 초기화
        setSelectedPlaceId(null);
        setRouteResult(null);
        setRouteStartId(null);
        setRouteEndId(null);
    };

    // --- 핸들러: 장소 및 지도 조작 ---

    // [캐러셀]에서 장소들(배열)을 지도에 추가
    const handleApplyPlaces = (places: Place[]) => {
        setDisplayedPlaces((prev) => {
            // 중복되지 않은 새 장소만 추가 (Append)
            const newPlaces = places.filter(p => !prev.some(existing => existing.id === p.id));
            return [...prev, ...newPlaces];
        });

        // 첫 번째 장소 하이라이트
        if (places.length > 0) {
            setSelectedPlaceId(places[0].id);
        }

        // 우측 패널 열기
        setIsInfoPanelOpen(true);

        // 모바일 환경이면 사이드바 닫기
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };

    // [리스트 패널]에서 X 버튼 눌러 장소 삭제
    const handleRemovePlace = (placeId: string) => {
        setDisplayedPlaces(prev => prev.filter(p => p.id !== placeId));
        if (selectedPlaceId === placeId) setSelectedPlaceId(null);
    };

    // 지도 마커나 리스트 아이템 클릭 시
    const handleSelectPlace = (id: string) => {
        setSelectedPlaceId(id);
    };

    // [저장] 버튼 클릭 (토글)
    const handleSavePlace = (place: Place, category: Category) => {
        setSavedPlaces((prev) => {
            const exists = prev.some(sp => sp.placeId === place.id && sp.category === category);
            if (exists) {
                return prev; // 이미 저장됨
            }
            return [...prev, { placeId: place.id, place, category, savedAt: Date.now() }];
        });
    };

    // [저장 취소] 버튼 클릭
    const handleRemoveSavedPlace = (placeId: string, category: Category) => {
        setSavedPlaces((prev) =>
            prev.filter(sp => !(sp.placeId === placeId && sp.category === category))
        );
        // 만약 경로 설정된 곳이 삭제되면 경로 초기화
        if (routeStartId?.includes(placeId)) {
            setRouteStartId(null); setRouteResult(null);
        }
        if (routeEndId?.includes(placeId)) {
            setRouteEndId(null); setRouteResult(null);
        }
    };

    // --- 핸들러: 길찾기 ---

    const requestRoute = async (startId: string, endId: string, mode: RouteMode) => {
        const start = getPlaceById(startId); // 실제로는 ID 파싱 로직이 필요할 수 있음 (category-id 형태라면)
        const end = getPlaceById(endId);

        // 단순 ID 매칭 시도 (SavedPlace의 경우 ID가 겹칠 수 있으므로 주의)
        // 여기서는 단순화를 위해 ID로 찾습니다.
        const startPlace = displayedPlaces.find(p => p.id === startId)
            || savedPlaces.find(sp => sp.placeId === startId)?.place;
        const endPlace = displayedPlaces.find(p => p.id === endId)
            || savedPlaces.find(sp => sp.placeId === endId)?.place;

        if (startPlace && endPlace) {
            try {
                const result = await fetchRoute(mode, startPlace, endPlace);
                setRouteResult(result);
            } catch (error) {
                console.error("경로 탐색 실패:", error);
                alert("경로를 찾을 수 없습니다.");
            }
        }
    };

    const handleSetRouteStart = (placeId: string, category: Category) => {
        // 식별을 위해 단순 ID만 저장하거나, 필요 시 category 조합 사용
        // 여기서는 편의상 placeId를 사용
        setRouteStartId(placeId);
        if (routeEndId && placeId !== routeEndId) {
            requestRoute(placeId, routeEndId, routeMode);
        }
    };

    const handleSetRouteEnd = (placeId: string, category: Category) => {
        setRouteEndId(placeId);
        if (routeStartId && routeStartId !== placeId) {
            requestRoute(routeStartId, placeId, routeMode);
        }
    };

    const handleChangeRouteMode = (mode: RouteMode) => {
        setRouteMode(mode);
        if (routeStartId && routeEndId) {
            requestRoute(routeStartId, routeEndId, mode);
        }
    };

    // UI 토글 핸들러
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeInfoPanel = () => setIsInfoPanelOpen(false);

    return (
        <div className="main-container">
            {/* 1. 좌측 사이드바 (채팅 목록) */}
            <Sidebar
                isOpen={isSidebarOpen}
                sessions={chatStore.sessions}
                currentSessionId={chatStore.currentSessionId}
                onNewChat={handleNewChat}
                onSelectChat={(id) => {
                    chatStore.selectSession(id);
                    // 세션 변경 시 우측 패널 상태 유지 또는 닫기 (여기선 유지)
                }}
                onDeleteChat={chatStore.deleteSession}
            />

            {/* 2. 중앙 AI 대화 패널 */}
            <div className="center-panel">
                <AiSummaryPanel
                    messages={chatStore.currentMessages} // chatStore에서 가져온 메시지 사용
                    onSearch={handleSearch}
                    onApplyPlaces={handleApplyPlaces}
                    isLoading={isLoading}
                    onToggleSidebar={toggleSidebar}
                />
            </div>

            {/* 3. 우측 정보 패널 (지도 + 리스트) */}
            <div className={`info-panel-wrapper ${isInfoPanelOpen ? 'open' : ''}`}>
                <div className="info-panel-content">
                    <div className="info-header">
                        <span style={{fontWeight:'bold', color:'#334155'}}>지도 & 상세정보</span>
                        <button className="close-btn" onClick={closeInfoPanel} title="패널 닫기">✖</button>
                    </div>

                    {/* 지도 패널 */}
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

                    {/* 리스트 패널 */}
                    <div className="right-bottom-panel">
                        <PlaceListPanel
                            places={displayedPlaces}
                            selectedPlaceId={selectedPlaceId}
                            onSelectPlace={handleSelectPlace}
                            onRemovePlace={handleRemovePlace} // 삭제 핸들러 전달

                            savedPlaces={savedPlaces}

                            routeMode={routeMode}
                            routeInfo={routeResult ? routeResult.summary : null}
                            routeStartPlace={
                                routeStartId
                                    ? (displayedPlaces.find(p => p.id === routeStartId) || savedPlaces.find(sp => sp.placeId === routeStartId)?.place || null)
                                    : null
                            }
                            routeEndPlace={
                                routeEndId
                                    ? (displayedPlaces.find(p => p.id === routeEndId) || savedPlaces.find(sp => sp.placeId === routeEndId)?.place || null)
                                    : null
                            }
                            onChangeRouteMode={handleChangeRouteMode}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;