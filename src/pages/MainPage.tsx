import React, { useState } from 'react';
import './MainPage.css';

// 컴포넌트 임포트
import { Sidebar } from '../components/layout/Sidebar';
import { AiSummaryPanel } from '../components/panels/AiSummaryPanel';
import { MapPanel } from '../components/panels/MapPanel';
import { PlaceListPanel } from '../components/panels/PlaceListPanel';
import { Modal } from '../components/common/Modal'; // 모달 컴포넌트
import { KakaoMapViewer } from '../components/map/KakaoMapViewer'; // 모달 내부용 지도

// 훅 & 타입 & API
import { useRecommendation } from '../hooks/useRecommendation';
import { useChatStore } from '../hooks/useChatStore';
import { Place, SavedPlace, Category } from '../types';
import { fetchRoute, RouteResponse, RouteMode } from '../api/routeApi';

const MainPage: React.FC = () => {
    // 1. 훅 초기화
    // API 호출 담당 (데이터 상태 관리 X)
    const { isLoading, searchPlaces } = useRecommendation();

    // 채팅 세션 및 메시지 관리 담당
    const chatStore = useChatStore();

    // 2. UI 상태 (패널 및 모달 열림 여부)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false); // 지도 확장 모달

    // 3. 데이터 상태 (지도/리스트 표시용)
    const [displayedPlaces, setDisplayedPlaces] = useState<Place[]>([]);
    const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
    const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);

    // 4. 길찾기 관련 상태
    const [routeStartId, setRouteStartId] = useState<string | null>(null);
    const [routeEndId, setRouteEndId] = useState<string | null>(null);
    const [routeResult, setRouteResult] = useState<RouteResponse | null>(null);
    const [routeMode, setRouteMode] = useState<RouteMode>('car');

    // --- 헬퍼 함수 ---

    // ID로 장소 객체 찾기 (화면에 있는 장소 + 저장된 장소 모두 검색)
    const getPlaceById = (id: string | null): Place | null => {
        if (!id) return null;

        // 현재 리스트에 있는 장소 우선 검색
        const inDisplay = displayedPlaces.find(p => p.id === id);
        if (inDisplay) return inDisplay;

        // 저장된 장소 검색
        const inSaved = savedPlaces.find(sp => sp.placeId === id);
        if (inSaved) return inSaved.place;

        return null;
    };

    // --- 핸들러: 검색 및 채팅 ---

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

    const handleNewChat = () => {
        chatStore.startNewChat();
        // UI 및 데이터 초기화
        setIsInfoPanelOpen(false);
        setDisplayedPlaces([]);
        setSelectedPlaceId(null);
        setRouteResult(null);
        setRouteStartId(null);
        setRouteEndId(null);
    };

    // --- 핸들러: 장소 조작 (추가/삭제/선택) ---

    // [캐러셀]에서 '이 장소들 모두 지도에 표시' 또는 개별 장소 클릭 시
    const handleApplyPlaces = (places: Place[]) => {
        setDisplayedPlaces((prev) => {
            // 중복되지 않은 새 장소만 추가 (Append 방식)
            const newPlaces = places.filter(p => !prev.some(existing => existing.id === p.id));
            return [...prev, ...newPlaces];
        });

        // 첫 번째 장소 하이라이트
        if (places.length > 0) {
            setSelectedPlaceId(places[0].id);
        }

        // 우측 정보 패널 열기
        setIsInfoPanelOpen(true);

        // 모바일 환경이면 사이드바 닫기
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    };

    // [리스트 패널]에서 X 버튼으로 장소 삭제
    const handleRemovePlace = (placeId: string) => {
        setDisplayedPlaces(prev => prev.filter(p => p.id !== placeId));
        if (selectedPlaceId === placeId) setSelectedPlaceId(null);
    };

    // 지도 마커나 리스트 아이템 클릭 시 선택
    const handleSelectPlace = (id: string) => {
        setSelectedPlaceId(id);
    };

    // --- 핸들러: 저장(북마크) 관리 ---

    const handleSavePlace = (place: Place, category: Category) => {
        setSavedPlaces((prev) => {
            // 중복 저장 방지
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

    const handleRemoveSavedPlace = (placeId: string, category: Category) => {
        setSavedPlaces((prev) =>
            prev.filter(sp => !(sp.placeId === placeId && sp.category === category))
        );

        // 경로 설정에 쓰이던 장소가 삭제되면 경로 초기화
        if (routeStartId?.includes(placeId)) {
            setRouteStartId(null); setRouteResult(null);
        }
        if (routeEndId?.includes(placeId)) {
            setRouteEndId(null); setRouteResult(null);
        }
    };

    // --- 핸들러: 길찾기 ---

    const requestRoute = async (startId: string, endId: string, mode: RouteMode) => {
        const start = getPlaceById(startId);
        const end = getPlaceById(endId);

        if (start && end) {
            try {
                console.log(`[MainPage] 경로 탐색 요청: ${start.name} -> ${end.name} (${mode})`);
                const result = await fetchRoute(mode, start, end);
                setRouteResult(result);
            } catch (error) {
                console.error("경로 탐색 실패:", error);
                alert("경로를 찾을 수 없습니다.");
            }
        }
    };

    const handleSetRouteStart = (placeId: string, category: Category) => {
        // 식별자: 실제로는 category-id 조합이 더 안전할 수 있으나 편의상 placeId 사용
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

    // --- UI 토글 핸들러 ---
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
                    // 대화방 변경 시 우측 패널 닫기 (선택 사항)
                    // setIsInfoPanelOpen(false);
                }}
                onDeleteChat={chatStore.deleteSession}
            />

            {/* 2. 중앙 AI 대화 패널 */}
            <div className="center-panel">
                <AiSummaryPanel
                    messages={chatStore.currentMessages}
                    onSearch={handleSearch}
                    onApplyPlaces={handleApplyPlaces}
                    isLoading={isLoading}
                    onToggleSidebar={toggleSidebar}
                />
            </div>

            {/* 3. 우측 정보 패널 (지도 + 리스트) */}
            <div className={`info-panel-wrapper ${isInfoPanelOpen ? 'open' : ''}`}>
                <div className="info-panel-content">
                    {/* 패널 헤더 */}
                    <div className="info-header">
                        <span style={{fontWeight:'bold', color:'#334155'}}>지도 & 상세정보</span>
                        <button className="close-btn" onClick={closeInfoPanel} title="패널 닫기">✖</button>
                    </div>

                    {/* 상단: 지도 패널 */}
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

                            // ★ 지도 확장 버튼 핸들러
                            onExpand={() => setIsMapModalOpen(true)}
                        />
                    </div>

                    {/* 하단: 리스트 패널 */}
                    <div className="right-bottom-panel">
                        <PlaceListPanel
                            places={displayedPlaces}
                            selectedPlaceId={selectedPlaceId}
                            onSelectPlace={handleSelectPlace}
                            onRemovePlace={handleRemovePlace} // 삭제 핸들러

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

            {/* 4. 지도 확장 모달 (Overlay) */}
            <Modal isOpen={isMapModalOpen} onClose={() => setIsMapModalOpen(false)}>
                <div style={{ width: '100%', height: '100%' }}>
                    {/* 모달 내부에서 큰 지도 렌더링 */}
                    <KakaoMapViewer
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
            </Modal>

        </div>
    );
};

export default MainPage;