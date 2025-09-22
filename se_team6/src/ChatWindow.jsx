import React, { forwardRef } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import './ChatWindow.css';

const ChatWindow = forwardRef(({ room, isTyping, onSendMessage }, ref) => {
    if (!room) {
        return (
            <div className="chat-window" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <h2>채팅방을 선택하세요.</h2>
            </div>
        );
    }

    return (
        <div className="chat-window">
            <header className="chat-header">
                <h2>{room.name}</h2>
            </header>
            <MessageList messages={room.messages} isTyping={isTyping} />
            <MessageInput
                ref={ref}
                onSendMessage={(messageText) => onSendMessage(room.id, messageText)}
                isTyping={isTyping}
            />
        </div>
    );
});

export default ChatWindow;