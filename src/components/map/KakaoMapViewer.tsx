import React, { useEffect, useState, useRef } from 'react';
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { Place } from '../../types';

interface Props {
    places?: Place[];
    selectedPlaceId: string | null;
    onSelectPlace: (id: string) => void;
}

export const KakaoMapViewer: React.FC<Props> = ({ places = [], selectedPlaceId, onSelectPlace }) => {
    const [loading, error] = useKakaoLoader({
        appkey: "YOUR_JAVASCRIPT_KEY", // ★ 본인 키 입력
        libraries: ["services", "clusterer"],
    });

    const defaultCenter = { lat: 37.532600, lng: 127.024612 };
    const [center, setCenter] = useState(defaultCenter);

    // ★ 지도 객체를 저장할 ref
    const mapRef = useRef<kakao.maps.Map>(null);

    // 1. 선택된 장소가 바뀌면 그곳으로 이동 (기존 로직 유지)
    useEffect(() => {
        if (selectedPlaceId && places.length > 0) {
            const selectedPlace = places.find(p => p.id === selectedPlaceId);
            if (selectedPlace) {
                setCenter({ lat: selectedPlace.latitude, lng: selectedPlace.longitude });
            }
        }
    }, [selectedPlaceId, places]);

    // ★ 2. 장소 리스트(places)가 새로 들어오면 모든 마커가 보이도록 지도 범위 재설정
    useEffect(() => {
        if (places.length > 0 && mapRef.current) {
            // Kakao Maps Bounds 객체 생성
            const bounds = new kakao.maps.LatLngBounds();

            // 모든 장소의 좌표를 bounds에 추가
            places.forEach((place) => {
                bounds.extend(new kakao.maps.LatLng(place.latitude, place.longitude));
            });

            // 지도가 bounds에 맞춰지도록 설정 (여백을 두고 조정)
            mapRef.current.setBounds(bounds);
        }
    }, [places]); // places가 바뀔 때마다 실행

    if (loading) return <div style={{width:"100%", height:"100%", background:"#f3f4f6"}}>로딩중...</div>;
    if (error) return <div style={{width:"100%", height:"100%", background:"#fee2e2"}}>지도 에러</div>;

    return (
        <Map
            center={center}
            style={{ width: "100%", height: "100%" }}
            level={3}
            onCreate={(map) => (mapRef.current = map)} // ★ 지도가 생성되면 ref에 저장
        >
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