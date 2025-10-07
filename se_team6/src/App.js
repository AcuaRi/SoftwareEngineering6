import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { mockChatAPI } from './api';
import './App.css';

function App() {
    const [chatRooms, setChatRooms] = useState([
        { id: 1, name: 'Gemini와 대화', messages: [{ sender: 'ai', type: 'text', content: '안녕하세요! Gemini입니다. "카드" 또는 "캐러셀"을 입력해보세요.' }] },
        { id: 2, name: '코드 리뷰', messages: [] },
    ]);
    const [selectedRoomId, setSelectedRoomId] = useState(1);
    const [isTyping, setIsTyping] = useState(false);
    const messageInputRef = useRef(null);

    useEffect(() => {
        if (!isTyping && messageInputRef.current) {
            messageInputRef.current.focus();
        }
    }, [isTyping, selectedRoomId]);

    const handleNewChat = () => {
        const newRoomId = Date.now();
        const newRoom = {
            id: newRoomId,
            name: `새로운 대화 ${chatRooms.length - 1}`,
            messages: []
        };
        setChatRooms(prevRooms => [...prevRooms, newRoom]);
        setSelectedRoomId(newRoomId);
    };

    const handleSendMessage = async (roomId, messageText) => {
        const userMessage = { sender: 'user', type: 'text', content: messageText };
        setChatRooms(prevRooms => prevRooms.map(room =>
            room.id === roomId ? { ...room, messages: [...room.messages, userMessage] } : room
        ));

        setIsTyping(true);
        const aiResponse = await mockChatAPI(messageText);
        const aiMessage = { sender: 'ai', type: aiResponse.type, content: aiResponse.content };

        setChatRooms(prevRooms => prevRooms.map(room =>
            room.id === roomId ? { ...room, messages: [...room.messages, aiMessage] } : room
        ));
        setIsTyping(false);
    };

    const selectedRoom = chatRooms.find(room => room.id === selectedRoomId);

    return (
        <div className="app-container">
            <Sidebar
                chatRooms={chatRooms}
                selectedRoomId={selectedRoomId}
                onSelectRoom={setSelectedRoomId}
                onNewChat={handleNewChat}
            />
            <ChatWindow
                ref={messageInputRef}
                room={selectedRoom}
                isTyping={isTyping}
                onSendMessage={handleSendMessage}
            />
        </div>
    );
}

export default App;