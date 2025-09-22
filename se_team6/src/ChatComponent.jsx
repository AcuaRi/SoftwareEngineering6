// ChatComponent.jsx

import { useState } from 'react';
// import { callChatAPI, mockCallChatAPI } from './api'; // 실제 사용할 API로 교체하세요.
import { mockCallChatAPI } from './api'; // 우선 목업 API로 테스트

function ChatComponent() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState(''); // 사용자 입력값을 관리할 상태 추가
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault(); // form 제출 시 페이지가 새로고침되는 것을 방지
        if (!input.trim()) return; // 입력값이 없으면 함수 종료

        const userInput = input;
        const newUserMessage = { sender: 'user', text: userInput };

        setMessages(prev => [...prev, newUserMessage]);
        setInput(''); // 입력창 비우기
        setIsLoading(true);

        const aiResponse = await mockCallChatAPI(userInput);
        const newAiMessage = { sender: 'ai', text: aiResponse };

        setMessages(prev => [...prev, newAiMessage]);
        setIsLoading(false);
    };

    // ✅ 이 return 부분이 화면을 그립니다.
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '10px' }}>
            {/* 1. 메시지 목록 표시 영역 */}
            <div style={{ flexGrow: 1, border: '1px solid #ccc', marginBottom: '10px', overflowY: 'auto', padding: '10px' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '5px 0' }}>
                        <span style={{
                            padding: '8px 12px',
                            borderRadius: '10px',
                            backgroundColor: msg.sender === 'user' ? '#007bff' : '#f1f1f1',
                            color: msg.sender === 'user' ? 'white' : 'black'
                        }}>
                            {msg.text}
                        </span>
                    </div>
                ))}
                {isLoading && <div style={{ textAlign: 'left' }}>AI가 입력 중...</div>}
            </div>

            {/* 2. 사용자 입력 폼 */}
            <form onSubmit={handleSendMessage} style={{ display: 'flex' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ flexGrow: 1, padding: '10px' }}
                    placeholder="메시지를 입력하세요..."
                    disabled={isLoading}
                />
                <button type="submit" style={{ padding: '10px' }} disabled={isLoading}>
                    전송
                </button>
            </form>
        </div>
    );
}

export default ChatComponent;