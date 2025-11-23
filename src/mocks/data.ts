import { RecommendationResponse } from '../types';

export const MOCK_RESPONSE_YONGSAN: RecommendationResponse = {
    summary: "용산구는 다양한 매력을 가진 지역입니다. 취향에 맞춰 4가지 맞춤형 코스를 준비했습니다.\n\n연인을 위한 **'로맨틱 야경 코스'**, 친구들과 힙하게 즐기는 **'한남동 문화 예술 코스'**, 미식가를 위한 **'용리단길 핫플 투어'**, 그리고 여유로운 **'한강 힐링 산책 코스'**가 있습니다. 아래 카드에서 원하시는 코스를 선택해 주세요!",
    courses: [
        {
            id: "course_1",
            title: "💖 로맨틱 야경 데이트",
            description: "이태원 파스타 맛집에서 식사 후, 남산공원에서 서울의 야경을 바라보는 정석 데이트 코스입니다.",
            places: [
                {
                    id: "p1",
                    name: "오네스토 (Onesto)",
                    address: "서울 용산구 이태원로 54길 12",
                    latitude: 37.53833,
                    longitude: 127.00211,
                    category: "이탈리안",
                    rating: 4.8,
                    reviewSummary: "소개팅 성공률 100% 분위기. 트러플 파스타와 스테이크가 일품이며 창가 자리 예약은 필수입니다."
                },
                {
                    id: "p2",
                    name: "남산공원 야외식물원",
                    address: "서울 용산구 소월로 323",
                    latitude: 37.54251,
                    longitude: 126.99800,
                    category: "공원/명소",
                    rating: 4.6,
                    reviewSummary: "식사 후 가볍게 산책하기 좋습니다. 벤치에 앉아 서울 타워와 야경을 보면 로맨틱한 분위기가 완성됩니다."
                },
                {
                    id: "p3",
                    name: "더파이널스 (루프탑 바)",
                    address: "서울 용산구 이태원로 23길",
                    latitude: 37.53450,
                    longitude: 126.99350,
                    category: "바/술집",
                    rating: 4.5,
                    reviewSummary: "칵테일 한잔하며 하루를 마무리하기 좋은 곳. 이태원 메인 거리 뷰가 훌륭합니다."
                }
            ]
        },
        {
            id: "course_2",
            title: "🎨 한남동 문화 예술 산책",
            description: "미술관 관람으로 감성을 채우고, 힙한 카페에서 커피 한 잔의 여유를 즐기는 코스입니다.",
            places: [
                {
                    id: "p4",
                    name: "리움미술관",
                    address: "서울 용산구 이태원로55길 60-16",
                    latitude: 37.53900,
                    longitude: 127.00250,
                    category: "미술관",
                    rating: 4.9,
                    reviewSummary: "현대미술과 고미술을 한 번에 볼 수 있는 곳. 건축물 자체만으로도 예술 작품입니다."
                },
                {
                    id: "p5",
                    name: "앤트러사이트 한남",
                    address: "서울 용산구 이태원로 240",
                    latitude: 37.53602,
                    longitude: 127.00122,
                    category: "카페",
                    rating: 4.3,
                    reviewSummary: "폐공장을 개조한 힙한 감성 카페. 커피 맛은 산미가 있는 편이며 사진 찍기 좋습니다."
                },
                {
                    id: "p6",
                    name: "사운즈 한남",
                    address: "서울 용산구 대사관로 35",
                    latitude: 37.53550,
                    longitude: 127.00500,
                    category: "복합문화공간",
                    rating: 4.7,
                    reviewSummary: "서점, 꽃집, 식당이 모여있는 작은 마을 같은 공간. 조용하게 구경하기 좋습니다."
                }
            ]
        },
        {
            id: "course_3",
            title: "🔥 용리단길 미식 핫플",
            description: "요즘 가장 핫한 용리단길에서 웨이팅 필수 맛집들을 정복하는 미식 투어 코스입니다.",
            places: [
                {
                    id: "p7",
                    name: "용산마루",
                    address: "서울 용산구 한강대로 15길 19",
                    latitude: 37.52955,
                    longitude: 126.96588,
                    category: "일식",
                    rating: 4.5,
                    reviewSummary: "메밀김밥과 곱창나베가 시그니처. 점심, 저녁 모두 웨이팅이 있으니 오픈런 추천합니다."
                },
                {
                    id: "p8",
                    name: "테디뵈르하우스",
                    address: "서울 용산구 한강대로40길 14",
                    latitude: 37.53050,
                    longitude: 126.96850,
                    category: "카페/베이커리",
                    rating: 4.6,
                    reviewSummary: "프랑스 감성의 크루아상 맛집. 인테리어가 정말 예뻐서 어디서 찍어도 인생샷이 나옵니다."
                },
                {
                    id: "p9",
                    name: "쌤쌤쌤 (Sam Sam Sam)",
                    address: "서울 용산구 한강대로50길 25",
                    latitude: 37.53100,
                    longitude: 126.97000,
                    category: "양식",
                    rating: 4.4,
                    reviewSummary: "샌프란시스코 가정식 느낌의 라자냐 맛집. 아기자기한 분위기가 매력적입니다."
                }
            ]
        },
        {
            id: "course_4",
            title: "🌿 한강 힐링 피크닉",
            description: "복잡한 도심을 벗어나 박물관 거울못을 걷고 한강공원에서 노을을 보는 힐링 코스입니다.",
            places: [
                {
                    id: "p10",
                    name: "국립중앙박물관",
                    address: "서울 용산구 서빙고로 137",
                    latitude: 37.52385,
                    longitude: 126.98047,
                    category: "문화/역사",
                    rating: 4.9,
                    reviewSummary: "웅장한 건축물과 아름다운 거울못 산책로. 남산 타워가 보이는 뷰 포인트가 있습니다."
                },
                {
                    id: "p11",
                    name: "이촌 한강공원",
                    address: "서울 용산구 이촌로72길 62",
                    latitude: 37.51750,
                    longitude: 126.97100,
                    category: "공원",
                    rating: 4.8,
                    reviewSummary: "다른 한강공원보다 조용하고 갈대밭이 예쁩니다. 자전거 타거나 피크닉 하기에 최고입니다."
                }
            ]
        }
    ]
};