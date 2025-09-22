import React, { useEffect, useRef } from 'react';
import './MessageList.css';

function MessageList({ messages, isTyping }) {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    return (
        <div className="message-list" ref={scrollRef}>
            {messages.map((msg, index) => (
                <div key={index} className={`message-bubble ${msg.sender}`}>
                    <div className="message-text">{msg.text}</div>
                </div>
            ))}
            {isTyping && (
                <div className="message-bubble ai">
                    <div className="typing-indicator">
                        AI가 입력 중...
                    </div>
                </div>
            )}
        </div>
    );
}

export default MessageList;