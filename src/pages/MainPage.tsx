import React, { useState } from 'react';
import './MainPage.css';
import { AiSummaryPanel } from '../components/panels/AiSummaryPanel';
import { MapPanel } from '../components/panels/MapPanel';
import { PlaceListPanel } from '../components/panels/PlaceListPanel';
import { useRecommendation } from '../hooks/useRecommendation';

const MainPage: React.FC = () => {
    // hook에서 messages도 받아옴
    const { data, messages, isLoading, error, searchPlaces } = useRecommendation();
    const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

    // data가 없어도 places는 빈 배열로 처리 (초기 렌더링 오류 방지)
    const places = data?.places || [];

    const handleSelectPlace = (id: string) => {
        setSelectedPlaceId(id);
    };

    return (
        <div className="main-container">
            <header className="main-header">
                <h1 className="app-title">썸플레이스 (SomePlace)</h1>
            </header>

            <main className="main-content">
                {/* 로딩 표시는 이제 채팅창 내부에 말줄임표(...)로 처리하거나, 필요시 유지 */}

                <div className="panels-grid">

                    {/* [좌측] AI 채팅창 */}
                    <section style={{ height: '100%', minWidth: 0 }}>
                        <AiSummaryPanel
                            messages={messages} // ★ summary 대신 messages 전달
                            onSearch={searchPlaces}
                            isLoading={isLoading}
                        />
                    </section>

                    {/* [우측] 지도 + 상세정보 */}
                    <section className="right-column">
                        <div className="right-top-panel">
                            <MapPanel
                                places={places}
                                selectedPlaceId={selectedPlaceId}
                                onSelectPlace={handleSelectPlace}
                            />
                        </div>
                        <div className="right-bottom-panel">
                            <PlaceListPanel
                                places={places}
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