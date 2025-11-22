import React, { useEffect, useState } from 'react';
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { Place } from '../../types';

interface Props {
    places?: Place[];
    selectedPlaceId: string | null;
    onSelectPlace: (id: string) => void;
}

export const KakaoMapViewer: React.FC<Props> = ({ places = [], selectedPlaceId, onSelectPlace }) => {
    // 1. 카카오맵 SDK 동적 로드
    const [loading, error] = useKakaoLoader({
        appkey: "YOUR_JAVASCRIPT_KEY", // ★ 여기에 발급받은 키 입력
        libraries: ["services", "clusterer"],
    });

    const defaultCenter = { lat: 37.532600, lng: 127.024612 };
    const [center, setCenter] = useState(defaultCenter);

    // 2. 선택된 장소나 리스트에 따라 지도 중심 이동
    useEffect(() => {
        if (selectedPlaceId && places.length > 0) {
            const selectedPlace = places.find(p => p.id === selectedPlaceId);
            if (selectedPlace) {
                setCenter({ lat: selectedPlace.latitude, lng: selectedPlace.longitude });
            }
        } else if (places.length > 0) {
            setCenter({ lat: places[0].latitude, lng: places[0].longitude });
        }
    }, [selectedPlaceId, places]);

    if (loading) return <div style={{width:"100%", height:"100%", background:"#f3f4f6", display:"flex", justifyContent:"center", alignItems:"center"}}>지도를 불러오는 중...</div>;
    if (error) return <div style={{width:"100%", height:"100%", background:"#fee2e2", display:"flex", justifyContent:"center", alignItems:"center"}}>지도 로드 실패</div>;

    return (
        <Map center={center} style={{ width: "100%", height: "100%" }} level={3}>
            {places.map((place) => (
                <MapMarker
                    key={place.id}
                    position={{ lat: place.latitude, lng: place.longitude }}
                    onClick={() => onSelectPlace(place.id)}
                    clickable={true}
                >
                    {selectedPlaceId === place.id && (
                        <div style={{ padding: "5px", color: "#000", textAlign: "center", minWidth: "150px" }}>
                            {place.name}
                        </div>
                    )}
                </MapMarker>
            ))}
        </Map>
    );
};