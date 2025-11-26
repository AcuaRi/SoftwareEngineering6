import React, { useState } from 'react';
import './MainPage.css';
import { AiSummaryPanel } from '../components/panels/AiSummaryPanel';
import { MapPanel } from '../components/panels/MapPanel';
import { PlaceListPanel } from '../components/panels/PlaceListPanel';
import { useRecommendation } from '../hooks/useRecommendation';
import { Place, Course, SavedPlace, Category } from '../types';
import { RouteMode, fetchRoute, RouteResponse } from "../api/routeApi";

const MainPage: React.FC = () => {
  const { messages, isLoading, searchPlaces } = useRecommendation();

  const [displayedPlaces, setDisplayedPlaces] = useState<Place[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);

  const [routeStartId, setRouteStartId] = useState<string | null>(null);
  const [routeEndId, setRouteEndId] = useState<string | null>(null);

  const [routeStartPlaceId, setRouteStartPlaceId] = useState<string | null>(null);
  const [routeEndPlaceId, setRouteEndPlaceId] = useState<string | null>(null);

  const [routePath, setRoutePath] = useState<{ lat: number; lng: number }[]>([]);
  const [routeMode, setRouteMode] = useState<RouteMode>("car");
  const [routeInfo, setRouteInfo] = useState<RouteResponse["summary"] | null>(null);

  const handleApplyCourse = (course: Course) => {
    setDisplayedPlaces(course.places);
    setSelectedPlaceId(null);
  };

  const handleSelectPlace = (id: string) => {
    setSelectedPlaceId(id);
  };

  const handleSavePlace = (place: Place, category: Category) => {
    setSavedPlaces(prev => {
      const exists = prev.some(p => p.placeId === place.id && p.category === category);
      if (exists) return prev;
      return [...prev, { placeId: place.id, place, category }];
    });
  };

  const handleRemoveSavedPlace = (placeId: string, category: Category) => {
    setSavedPlaces(prev => prev.filter(p => !(p.placeId === placeId && p.category === category)));

    if (routeStartPlaceId === placeId || routeEndPlaceId === placeId) {
      console.log("[route] 저장된 출발/도착지를 지워서 경로 초기화");
      setRoutePath([]);
      setRouteInfo(null);
      if (routeStartPlaceId === placeId) { setRouteStartPlaceId(null); setRouteStartId(null); }
      if (routeEndPlaceId === placeId) { setRouteEndPlaceId(null); setRouteEndId(null); }
    }
  };

  // ✅ 경로 API 호출
  const tryUpdateRoute = async (
    mode: RouteMode = routeMode,
    startOverride?: string | null,
    endOverride?: string | null
  ) => {
    const sId = startOverride ?? routeStartPlaceId;
    const eId = endOverride ?? routeEndPlaceId;

    console.log("[route] tryUpdateRoute 호출", { mode, sId, eId });

    if (!sId || !eId) {
      console.log("[route] 출발지/도착지 ID 없음 → 경로 호출 안 함");
      return;
    }

    const start = savedPlaces.find(sp => sp.placeId === sId);
    const end = savedPlaces.find(sp => sp.placeId === eId);

    console.log("[route] savedPlaces 검색 결과", { start, end });

    if (!start || !end) {
      console.warn("[route] savedPlaces 안에서 출발/도착 place를 찾지 못함");
      return;
    }

    try {
      const res = await fetchRoute(mode, start.place, end.place);
      console.log("[route] fetchRoute 성공", res);
      setRoutePath(res.path);
      setRouteInfo(res.summary);
    } catch (err) {
      console.error("[route] 경로 API 오류:", err);
      setRoutePath([]);
      setRouteInfo(null);
    }
  };

  const handleSetRouteStart = (placeId: string, category: Category) => {
    console.log("[route] 출발지 설정", { placeId, category });
    setRouteStartId(`${category}-${placeId}`);
    setRouteStartPlaceId(placeId);

    if (routeEndPlaceId) {
      tryUpdateRoute(routeMode, placeId, routeEndPlaceId);
    }
  };

  const handleSetRouteEnd = (placeId: string, category: Category) => {
    console.log("[route] 도착지 설정", { placeId, category });
    setRouteEndId(`${category}-${placeId}`);
    setRouteEndPlaceId(placeId);

    if (routeStartPlaceId) {
      tryUpdateRoute(routeMode, routeStartPlaceId, placeId);
    }
  };

  const handleChangeRouteMode = (mode: RouteMode) => {
    console.log("[route] 이동 모드 변경", mode);
    setRouteMode(mode);
    tryUpdateRoute(mode);
  };

  const routeStartPlace =
    routeStartPlaceId
      ? savedPlaces.find(sp => sp.placeId === routeStartPlaceId)?.place ?? null
      : null;

  const routeEndPlace =
    routeEndPlaceId
      ? savedPlaces.find(sp => sp.placeId === routeEndPlaceId)?.place ?? null
      : null;

  console.log("[route] 렌더링 시 상태", {
    routeStartPlaceId,
    routeEndPlaceId,
    routeStartPlace,
    routeEndPlace,
    routeInfo,
    routePathLen: routePath.length,
  });

  return (
    <div className="main-container">
      <header className="main-header">
        <h1 className="app-title">썸플레이스 (SomePlace)</h1>
      </header>

      <main className="main-content">
        <div className="panels-grid">
          <section
            style={{
              height: '100%',
              minWidth: 0,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <AiSummaryPanel
              messages={messages}
              onSearch={searchPlaces}
              onApplyCourse={handleApplyCourse}
              isLoading={isLoading}
            />
          </section>

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
                savedPlaces={savedPlaces}
                selectedPlaceId={selectedPlaceId}
                onSelectPlace={handleSelectPlace}
                routeMode={routeMode}
                routeInfo={routeInfo}
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
