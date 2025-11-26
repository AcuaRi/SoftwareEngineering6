// src/mocks/data.ts
import { RecommendationResponse } from '../types';

export const MOCK_RESPONSE_YONGSAN: RecommendationResponse = {
    summary: "용산구의 매력을 느낄 수 있는 핫플레이스들을 엄선했습니다. \n\n각 카드의 사진을 넘겨서(↔) 분위기를 미리 확인해보세요. 마음에 드는 장소의 '지도에서 보기 📍' 버튼을 누르면 위치를 확인할 수 있습니다!",
    places: [
        {
            id: "p1",
            name: "오네스토 (Onesto)",
            address: "서울 용산구 이태원로 54길 12",
            latitude: 37.53833,
            longitude: 127.00211,
            category: "이탈리안",
            rating: 4.8,
            reviewSummary: "트러플 파스타가 일품인 분위기 맛집. 소개팅 장소로 강력 추천합니다.",
            imageUrls: [
                "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=500&q=80", // 파스타
                "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=500&q=80", // 칵테일
                "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=500&q=80"  // 디저트
            ]
        },
        {
            id: "p2",
            name: "남산공원 야외식물원",
            address: "서울 용산구 소월로 323",
            latitude: 37.54251,
            longitude: 126.99800,
            category: "공원/명소",
            rating: 4.6,
            reviewSummary: "식사 후 가볍게 산책하기 좋은 코스. 서울의 야경이 한눈에 들어옵니다.",
            imageUrls: [
                "https://images.unsplash.com/photo-1532517308734-0565178471d2?auto=format&fit=crop&w=500&q=80", // 야경
                "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=500&q=80", // 산책로
                "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=500&q=80"  // 서울타워
            ]
        },
        {
            id: "p3",
            name: "앤트러사이트 한남",
            address: "서울 용산구 이태원로 240",
            latitude: 37.53602,
            longitude: 127.00122,
            category: "카페",
            rating: 4.3,
            reviewSummary: "폐공장을 개조한 힙한 감성 카페. 커피 맛은 산미가 있는 편입니다.",
            imageUrls: [
                "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=500&q=80", // 카페 내부
                "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=500&q=80", // 커피
                "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=500&q=80"  // 외관
            ]
        },
        {
            id: "p4",
            name: "리움미술관",
            address: "서울 용산구 이태원로55길 60-16",
            latitude: 37.53900,
            longitude: 127.00250,
            category: "미술관",
            rating: 4.9,
            reviewSummary: "현대미술과 건축미가 어우러진 공간. 인생샷 남기기 좋습니다.",
            imageUrls: [
                "https://images.unsplash.com/photo-1518998053901-5348d3969105?auto=format&fit=crop&w=500&q=80", // 미술관
                "https://images.unsplash.com/photo-1545989253-02cc26577f88?auto=format&fit=crop&w=500&q=80", // 작품
                "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=500&q=80"  // 야외
            ]
        },
        {
            id: "p5",
            name: "용산마루",
            address: "서울 용산구 한강대로 15길 19",
            latitude: 37.52955,
            longitude: 126.96588,
            category: "일식",
            rating: 4.5,
            reviewSummary: "메밀김밥과 곱창나베 웨이팅 맛집. 점심 저녁 모두 인기 만점입니다.",
            imageUrls: [
                "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?auto=format&fit=crop&w=500&q=80", // 일식
                "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=80", // 나베
                "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=500&q=80"  // 김밥
            ]
        }
    ]
};