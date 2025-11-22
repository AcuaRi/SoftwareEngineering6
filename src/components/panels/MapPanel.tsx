import React from 'react';
import { KakaoMapViewer } from '../map/KakaoMapViewer';
import { Place } from '../../types';
import './PanelStyles.css';

interface Props {
    places: Place[];
    selectedPlaceId: string | null;
    onSelectPlace: (id: string) => void;
}

export const MapPanel: React.FC<Props> = ({ places, selectedPlaceId, onSelectPlace }) => {
    return (
        <div className="panel-container">
            <div className="panel-header" style={{ backgroundColor: '#1f2937' }}>
                <span>🗺️ 지도 보기</span>
                <small style={{ color: '#9ca3af' }}>KakaoMap API</small>
            </div>
            <div className="panel-body" style={{ padding: 0, position: 'relative' }}>
                <KakaoMapViewer places={places} selectedPlaceId={selectedPlaceId} onSelectPlace={onSelectPlace} />
            </div>
        </div>
    );
};