import React, { useEffect, useRef } from 'react';
import CardMessage from './CardMessage';
import CardCarousel from './CardCarousel';
import SummaryCarouselMessage from './SummaryCarouselMessage';
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
            {messages.map((msg, index) => {
                if (msg.sender === 'user') {
                    return (
                        <div key={index} className="message-bubble user">
                            <div className="message-text">{msg.content}</div>
                        </div>
                    );
                }

                switch (msg.type) {
                    case 'summaryCarousel':
                        return <SummaryCarouselMessage key={index} content={msg.content} />;
                    case 'carousel':
                        return <CardCarousel key={index} cards={msg.content} />;
                    case 'card':
                        return (
                            <div key={index} className="message-bubble ai">
                                <CardMessage content={msg.content} />
                            </div>
                        );
                    default: // 'text'
                        return (
                            <div key={index} className="message-bubble ai">
                                <div className="message-text">{msg.content}</div>
                            </div>
                        );
                }
            })}
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