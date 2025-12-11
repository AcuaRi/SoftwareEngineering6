// src/pages/MainPage.tsx
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
import { fetchRoute, RouteResponse, RouteMode, RouteSummary } from '../api/routeApi';

// 개별 경로 저장용 타입 (PlaceListPanel의 RouteCard와 동일 구조)
interface RouteEntry {
  id: string;
  startPlaceId: string;
  endPlaceId: string;
  mode: RouteMode;
  summary: RouteSummary;
  path: { lat: number; lng: number }[];
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}

/**
 * ✅ 프론트 전용 "고유 장소 키"
 *    - 원래 place.id 가 중복일 수 있어서,
 *      id + 위도 + 경도 기반으로 유니크 키를 만든다.
 */
const makePlaceKey = (place: Place): string => {
  const baseId = place.id ?? 'noid';
  return `${baseId}_${place.latitude}_${place.longitude}`;
};

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
  // ⚠️ 여기서의 selectedPlaceId는 "makePlaceKey"로 만든 키를 저장한다
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);

  // 4. 길찾기 관련 상태 (현재 선택된 경로 + 경로 히스토리)
  // ⚠️ routeStartId / routeEndId 역시 "makePlaceKey"로 만든 키를 사용한다
  const [routeStartId, setRouteStartId] = useState<string | null>(null);
  const [routeEndId, setRouteEndId] = useState<string | null>(null);
  const [routeResult, setRouteResult] = useState<RouteResponse | null>(null);
  const [routeMode, setRouteMode] = useState<RouteMode>('car'); // 내부 지도용 모드는 자동차만 사용
  const [routes, setRoutes] = useState<RouteEntry[]>([]); // 여러 경로 적재
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null); // 현재 지도에 표시 중인 경로

  // --- 헬퍼 함수 ---

  // ID(=makePlaceKey)로 장소 객체 찾기 (화면에 있는 장소 + 저장된 장소 모두 검색)
  const getPlaceById = (id: string | null): Place | null => {
    if (!id) return null;

    // 현재 리스트에 있는 장소 우선 검색
    const inDisplay = displayedPlaces.find((p) => makePlaceKey(p) === id);
    if (inDisplay) return inDisplay;

    // 저장된 장소 검색 (SavedPlace.placeId 역시 makePlaceKey 기반)
    const inSaved = savedPlaces.find((sp) => sp.placeId === id);
    if (inSaved) return inSaved.place;

    return null;
  };

  // --- 핸들러: 검색 및 채팅 ---

  const handleSearch = async (query: string) => {
    // 1. 사용자 메시지 추가 (UI 즉시 반영)
    chatStore.addMessage({ role: 'user', text: query });

    // 2. API 호출 (현재 스토어에 있는 메시지들을 함께 전달)
    const currentHistory = [...chatStore.currentMessages];

    // ★ query와 history를 함께 전달
    const result = await searchPlaces(query, currentHistory);

    // 3. 결과 처리
    if (result) {
      chatStore.addMessage({
        role: 'assistant',
        text: result.summary,
        places: result.places,
      });
    } else {
      chatStore.addMessage({
        role: 'assistant',
        text: '죄송합니다. 오류가 발생했습니다.',
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
    setRoutes([]); // 경로 히스토리 초기화
    setActiveRouteId(null);
  };

  // --- 핸들러: 장소 조작 (추가/삭제/선택) ---

  /**
   * [캐러셀]에서 '이 장소들 모두 지도에 표시' 또는 개별 장소 클릭 시
   * - AI / 백엔드에서 준 Place는 id가 중복일 수 있으므로,
   *   여기서 프론트 전용 고유 id로 한 번 변환해서 저장한다.
   */
  const handleApplyPlaces = (places: Place[]) => {
    setDisplayedPlaces((prev) => {
      // 1) 새로 들어온 장소들을 "id 교체"한 사본으로 만든다
      const normalizedNew = places.map((p) => ({
        ...p,
        id: makePlaceKey(p),
      }));

      // 2) 이미 표시 중인 장소들의 id 집합
      const existingIds = new Set(prev.map((p) => p.id));

      // 3) 중복되지 않는 것만 추가
      const newPlaces = normalizedNew.filter((p) => !existingIds.has(p.id));

      return [...prev, ...newPlaces];
    });

    // 첫 번째 장소를 선택 상태로
    if (places.length > 0) {
      const firstKey = makePlaceKey(places[0]);
      setSelectedPlaceId(firstKey);
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
    setDisplayedPlaces((prev) => prev.filter((p) => p.id !== placeId));
    if (selectedPlaceId === placeId) setSelectedPlaceId(null);
  };

  // 지도 마커나 리스트 아이템 클릭 시 선택
  const handleSelectPlace = (id: string) => {
    setSelectedPlaceId(id);
  };

  // --- 핸들러: 저장(북마크) 관리 ---

  const handleSavePlace = (place: Place, category: Category) => {
    const placeKey = makePlaceKey(place);

    setSavedPlaces((prev) => {
      // 중복 저장 방지 (같은 장소 + 같은 카테고리)
      const exists = prev.some(
        (sp) => sp.placeId === placeKey && sp.category === category,
      );
      if (exists) return prev;

      return [
        ...prev,
        {
          placeId: placeKey,
          place: { ...place, id: placeKey }, // place 내부 id도 키로 통일
          category,
          savedAt: Date.now(),
        },
      ];
    });
  };

  const handleRemoveSavedPlace = (placeId: string, category: Category) => {
    setSavedPlaces((prev) =>
      prev.filter(
        (sp) => !(sp.placeId === placeId && sp.category === category),
      ),
    );

    // 현재 선택 중이던 출발/도착지에 해당하면 선택만 초기화
    if (routeStartId && routeStartId === placeId) {
      setRouteStartId(null);
      setRouteResult(null);
      setActiveRouteId(null);
    }
    if (routeEndId && routeEndId === placeId) {
      setRouteEndId(null);
      setRouteResult(null);
      setActiveRouteId(null);
    }
  };

  // --- 핸들러: 길찾기 ---

  const requestRoute = async (
    startId: string,
    endId: string,
    mode: RouteMode,
  ) => {
    const start = getPlaceById(startId);
    const end = getPlaceById(endId);

    if (start && end) {
      try {
        console.log(
          `[MainPage] 경로 탐색 요청: ${start.name} -> ${end.name} (${mode})`,
        );
        const result = await fetchRoute(mode, start, end);

        // 내부 지도에 표시할 현재 경로
        const routeResponse: RouteResponse = {
          path: result.path,
          summary: result.summary,
        };
        setRouteResult(routeResponse);

        // 여러 경로 적재: 동일한 (start, end, mode)는 덮어쓰기
        setRoutes((prev) => {
          const id = `${makePlaceKey(start)}-${makePlaceKey(end)}-${mode}`;

          const baseEntry: RouteEntry = {
            id,
            startPlaceId: makePlaceKey(start),
            endPlaceId: makePlaceKey(end),
            mode,
            summary: result.summary,
            path: result.path,
            startLat: start.latitude,
            startLng: start.longitude,
            endLat: end.latitude,
            endLng: end.longitude,
          };

          const filtered = prev.filter(
            (r) =>
              !(
                r.startPlaceId === baseEntry.startPlaceId &&
                r.endPlaceId === baseEntry.endPlaceId &&
                r.mode === mode
              ),
          );

          const nextRoutes = [...filtered, baseEntry];
          return nextRoutes;
        });

        // 이 경로를 현재 활성 경로로 표시
        setActiveRouteId(
          `${makePlaceKey(start)}-${makePlaceKey(end)}-${mode}`,
        );

        // ✅ 한 번 쌍이 만들어졌으니 출발/도착 선택 상태 flush
        setRouteStartId(null);
        setRouteEndId(null);
      } catch (error) {
        console.error('경로 탐색 실패:', error);
        alert('경로를 찾을 수 없습니다.');
      }
    }
  };

  const handleSetRouteStart = (placeId: string, category: Category) => {
    // placeId는 이미 makePlaceKey 기반의 값이라고 가정
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

    // 이미 출발/도착이 선택된 상태에서 모드 변경 시 다시 요청
    if (routeStartId && routeEndId) {
      requestRoute(routeStartId, routeEndId, mode);
    }
  };

  // --- 핸들러: 경로 삭제 & 경로 선택 (PlaceListPanel과 연동) ---

  const handleRemoveRoute = (routeId: string) => {
    setRoutes((prev) => prev.filter((r) => r.id !== routeId));

    if (activeRouteId === routeId) {
      setActiveRouteId(null);
      setRouteResult(null);
    }
  };

  const handleSelectRoute = (routeId: string) => {
    const target = routes.find((r) => r.id === routeId);
    if (!target) return;

    setActiveRouteId(routeId);
    setRouteResult({
      path: target.path,
      summary: target.summary,
    });
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
            <span style={{ fontWeight: 'bold', color: '#334155' }}>
              지도 & 상세정보
            </span>
            <button
              className="close-btn"
              onClick={closeInfoPanel}
              title="패널 닫기"
            >
              ✖
            </button>
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
              savedPlaces={savedPlaces}
              selectedPlaceId={selectedPlaceId}
              onSelectPlace={handleSelectPlace}
              onRemovePlace={handleRemovePlace}
              routeMode={routeMode}
              routes={routes}
              onChangeRouteMode={handleChangeRouteMode}
              onRemoveRoute={handleRemoveRoute}
              onSelectRoute={handleSelectRoute}
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
