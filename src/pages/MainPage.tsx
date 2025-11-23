import React, { useState } from 'react';
import './MainPage.css';
import { AiSummaryPanel } from '../components/panels/AiSummaryPanel';
import { MapPanel } from '../components/panels/MapPanel';
import { PlaceListPanel } from '../components/panels/PlaceListPanel';
import { useRecommendation } from '../hooks/useRecommendation';
import { Place, Course } from '../types';

const MainPage: React.FC = () => {
    const { messages, isLoading, searchPlaces } = useRecommendation();

    // ★ 우측 패널(지도/리스트)에 표시될 장소 상태
    const [displayedPlaces, setDisplayedPlaces] = useState<Place[]>([]);

    // 선택된 특정 장소 ID (하이라이팅 용)
    const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

    // ★ 캐러셀에서 [적용하기] 버튼 클릭 시 실행될 함수
    const handleApplyCourse = (course: Course) => {
        // 1. 우측 패널 데이터 업데이트
        setDisplayedPlaces(course.places);
        // 2. 선택 초기화
        setSelectedPlaceId(null);
        // (선택 사항) 알림 띄우기? alert(`${course.title}가 지도에 적용되었습니다!`);
    };

    const handleSelectPlace = (id: string) => {
        setSelectedPlaceId(id);
    };

    return (
        <div className="main-container">
            <header className="main-header">
                <h1 className="app-title">썸플레이스 (SomePlace)</h1>
            </header>

            <main className="main-content">
                <div className="panels-grid">

                    {/* [좌측] AI 대화창 */}
                    {/* ★ 수정: overflow: 'hidden' 추가 -> 자식이 커져도 이 영역을 넘지 않음 */}
                    <section style={{ height: '100%', minWidth: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <AiSummaryPanel
                            messages={messages}
                            onSearch={searchPlaces}
                            onApplyCourse={handleApplyCourse}
                            isLoading={isLoading}
                        />
                    </section>

                    {/* [우측] 정보 패널 */}
                    <section className="right-column">
                        {/* ... 기존 우측 코드 유지 ... */}
                        <div className="right-top-panel">
                            <MapPanel
                                places={displayedPlaces}
                                selectedPlaceId={selectedPlaceId}
                                onSelectPlace={handleSelectPlace}
                            />
                        </div>
                        <div className="right-bottom-panel">
                            <PlaceListPanel
                                places={displayedPlaces}
                                selectedPlaceId={selectedPlaceId}
                                onSelectPlace={handleSelectPlace}
                            />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default MainPage;