import React from 'react';
import { KakaoMapViewer } from '../map/KakaoMapViewer';
import { Place, SavedPlace, Category } from '../../types';
import './PanelStyles.css';

interface Props {
    places: Place[];
    selectedPlaceId: string | null;
    onSelectPlace: (id: string) => void;
    // ✅ 경로 좌표 배열
    routePath?: { lat: number; lng: number }[];
    savedPlaces: SavedPlace[];
    routeStartId: string | null;
    routeEndId: string | null;
    onSavePlace: (place: Place, category: Category) => void;
    onRemoveSavedPlace: (placeId: string, category: Category) => void;
    onSetRouteStart: (placeId: string, category: Category) => void;
    onSetRouteEnd: (placeId: string, category: Category) => void;
}

export const MapPanel: React.FC<Props> = ({ places, selectedPlaceId, onSelectPlace, routePath, savedPlaces, routeStartId, routeEndId, onSavePlace, onRemoveSavedPlace, onSetRouteStart, onSetRouteEnd }) => {
    return (
        <div className="panel-container">
            <div className="panel-header" style={{ backgroundColor: '#1f2937' }}>
                <span>🗺️ 지도 보기</span>
                <small style={{ color: '#9ca3af' }}>KakaoMap API</small>
            </div>
            <div className="panel-body" style={{ padding: 0, position: 'relative' }}>
                <KakaoMapViewer places={places} selectedPlaceId={selectedPlaceId} onSelectPlace={onSelectPlace} routePath={routePath} savedPlaces={savedPlaces} routeStartId={routeStartId} routeEndId={routeEndId} onSavePlace={onSavePlace} onRemoveSavedPlace={onRemoveSavedPlace} onSetRouteStart={onSetRouteStart} onSetRouteEnd={onSetRouteEnd} />
            </div>
        </div>
    );
};