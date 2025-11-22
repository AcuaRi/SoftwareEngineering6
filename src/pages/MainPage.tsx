import React, { useState } from 'react';
import './MainPage.css';
import { SearchBar } from '../components/search/SearchBar';
import { AiSummaryPanel } from '../components/panels/AiSummaryPanel';
import { MapPanel } from '../components/panels/MapPanel';
import { PlaceListPanel } from '../components/panels/PlaceListPanel';
import { useRecommendation } from '../hooks/useRecommendation';

const MainPage: React.FC = () => {
    const { data, isLoading, error, searchPlaces } = useRecommendation();
    const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

    const summary = data?.summary || "";
    const places = data?.places || [];

    const handleSelectPlace = (id: string) => {
        setSelectedPlaceId(id);
    };

    return (
        <div className="main-container">
            <header className="main-header">
                <h1 className="app-title">썸플레이스</h1>
                <SearchBar onSearch={searchPlaces} isLoading={isLoading} />
            </header>
            <main className="main-content">
                {isLoading && (
                    <div className="loading-overlay">
                        <div className="loading-text">AI 분석 중...</div>
                        <p>사용자 의도 파악 • 장소 검색 • 리뷰 분석</p>
                    </div>
                )}
                <div className="panels-grid">
                    <AiSummaryPanel summary={summary} />
                    <MapPanel places={places} selectedPlaceId={selectedPlaceId} onSelectPlace={handleSelectPlace} />
                    <PlaceListPanel places={places} selectedPlaceId={selectedPlaceId} onSelectPlace={handleSelectPlace} />
                </div>
            </main>
        </div>
    );
};

export default MainPage;