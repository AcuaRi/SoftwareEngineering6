// api.js (수정 후)

// 1. 불필요한 import App 삭제

// 실제 백엔드와 통신하는 함수
async function callChatAPI(userInput) {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput }),
        });

        const data = await response.json();
        return data.reply;

    } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
        return "죄송합니다. 오류가 발생했어요.";
    }
}

// 임시 목업 함수
async function mockCallChatAPI(userInput) {
    console.log("가짜 API 호출:", userInput);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return "이것은 백엔드 없이 테스트하는 가짜 AI 답변입니다.";
}

async function mockChatAPI(userInput) {
    console.log("Mock API 호출됨:", userInput);

    // 네트워크 지연 시간 흉내 내기 (1.5초)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 간단한 응답 로직
    if (userInput.toLowerCase().includes("안녕")) {
        return "안녕하세요! 무엇을 도와드릴까요?";
    }
    if (userInput.toLowerCase().includes("리액트")) {
        return "리액트는 사용자 인터페이스를 만들기 위한 JavaScript 라이브러리입니다.";
    }

    return `'${userInput}'라고 말씀하셨네요. 흥미로운 주제입니다.`;
}

// 2. ✅ 두 함수를 각각 export 합니다.
export {
    callChatAPI,
    mockCallChatAPI,
    mockChatAPI
};