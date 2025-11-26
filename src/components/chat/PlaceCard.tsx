// src/components/chat/PlaceCard.tsx
import React, { useState } from 'react';
import { Place } from '../../types';
import './PlaceCarousel.css'; // 스타일 공유

interface Props {
    place: Place;
    onSelect: (place: Place) => void;
}

export const PlaceCard: React.FC<Props> = ({ place, onSelect }) => {
    // 현재 보고 있는 이미지의 인덱스 (기본값 0)
    const [imgIndex, setImgIndex] = useState(0);

    // 다음 이미지로 넘기기
    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
        if (place.imageUrls && place.imageUrls.length > 0) {
            setImgIndex((prev) => (prev + 1) % place.imageUrls.length);
        }
    };

    // 이전 이미지로 넘기기
    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (place.imageUrls && place.imageUrls.length > 0) {
            setImgIndex((prev) => (prev - 1 + place.imageUrls.length) % place.imageUrls.length);
        }
    };

    // 현재 표시할 이미지 URL (데이터가 없으면 placeholder 사용)
    const currentImageUrl = place.imageUrls && place.imageUrls.length > 0
        ? place.imageUrls[imgIndex]
        : 'https://via.placeholder.com/300x200?text=No+Image';

    const hasMultipleImages = place.imageUrls && place.imageUrls.length > 1;

    return (
        <div className="place-card">
            {/* 이미지 슬라이더 영역 */}
            <div className="card-image-wrapper">
                <img
                    src={currentImageUrl}
                    alt={place.name}
                    className="card-image"
                />

                {/* 카테고리 뱃지 */}
                <span className="card-category">{place.category}</span>

                {/* 좌우 화살표 (이미지가 2장 이상일 때만 표시) */}
                {hasMultipleImages && (
                    <>
                        <button className="img-nav-btn prev" onClick={prevImage}>‹</button>
                        <button className="img-nav-btn next" onClick={nextImage}>›</button>

                        {/* 하단 점(Dots) 인디케이터 */}
                        <div className="img-dots">
                            {place.imageUrls.map((_, idx) => (
                                <span
                                    key={idx}
                                    className={`dot ${idx === imgIndex ? 'active' : ''}`}
                                    // 점을 클릭해도 해당 이미지로 이동 가능하게 하려면 추가
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setImgIndex(idx);
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* 장소 정보 영역 */}
            <div className="card-content">
                <div className="card-header">
                    <h3 className="card-title">{place.name}</h3>
                    <span className="card-rating">★ {place.rating}</span>
                </div>

                <p className="card-review">{place.reviewSummary}</p>

                <button className="action-btn" onClick={() => onSelect(place)}>
                    지도에서 보기 📍
                </button>
            </div>
        </div>
    );
};