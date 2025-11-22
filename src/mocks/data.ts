// src/mocks/data.ts
import { RecommendationResponse } from '../types';

export const MOCK_RESPONSE_YONGSAN: RecommendationResponse = {
    summary: "용산구는 문화와 예술, 그리고 미식이 어우러진 매력적인 지역입니다. \n\n연인과 함께라면 '오네스토'에서의 식사 후 '남산공원' 야경 산책을 추천하며, 친구들과는 '아모레퍼시픽 미술관' 관람 후 '용산마루'에서 미식 탐방을 즐겨보세요. 주말에는 웨이팅이 있을 수 있으니 예약은 필수입니다.",
    places: [
        { id: "p1", name: "오네스토 (Onesto)", address: "서울 용산구 이태원로 54길 12", latitude: 37.53833, longitude: 127.00211, category: "이탈리안", rating: 4.8, reviewSummary: "분위기 깡패. 창가 자리 예약 필수입니다. 트러플 파스타 풍미가 일품이에요." },
        { id: "p2", name: "남산공원 야외식물원", address: "서울 용산구 소월로 323", latitude: 37.54251, longitude: 126.99800, category: "공원/명소", rating: 4.6, reviewSummary: "식사 후 소화시킬 겸 걷기 좋아요. 서울 야경이 한눈에 들어와서 로맨틱합니다." },
        { id: "p3", name: "앤트러사이트 한남", address: "서울 용산구 이태원로 240", latitude: 37.53602, longitude: 127.00122, category: "카페", rating: 4.3, reviewSummary: "폐공장 느낌의 힙한 인테리어. 커피 맛은 산미가 좀 있는 편입니다." },
        { id: "p4", name: "국립중앙박물관", address: "서울 용산구 서빙고로 137", latitude: 37.52385, longitude: 126.98047, category: "문화/예술", rating: 4.9, reviewSummary: "우리나라 최고의 박물관. 거울못 산책로가 정말 예쁘고 사진 찍기 좋아요." },
        { id: "p5", name: "용산마루", address: "서울 용산구 한강대로 15길 19", latitude: 37.52955, longitude: 126.96588, category: "일식", rating: 4.5, reviewSummary: "메밀김밥과 곱창나베가 유명한 곳. 웨이팅이 길지만 기다릴 가치가 있습니다." },
        { id: "p6", name: "하이브 인사이트", address: "서울 용산구 한강대로 42", latitude: 37.52862, longitude: 126.96688, category: "문화/전시", rating: 4.7, reviewSummary: "K-POP 팬이라면 성지순례 필수 코스. 다양한 체험형 전시가 인상적입니다." },
        { id: "p7", name: "단밤 (이태원 클라쓰)", address: "서울 용산구 녹사평대로 40길 57", latitude: 37.53911, longitude: 126.98733, category: "명소", rating: 4.2, reviewSummary: "드라마 팬들이 많이 찾는 곳. 루프탑 뷰가 좋아서 맥주 한잔하기 딱입니다." },
        { id: "p8", name: "전쟁기념관", address: "서울 용산구 이태원로 29", latitude: 37.53661, longitude: 126.97713, category: "박물관", rating: 4.8, reviewSummary: "역사 공부와 함께 넓은 광장에서 산책하기 좋습니다. 야외 전시물이 웅장해요." }
    ]
};