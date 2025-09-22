import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import './MessageInput.css';

const MessageInput = forwardRef(({ onSendMessage, isTyping }, ref) => {
    const [input, setInput] = useState('');
    const inputRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current.focus();
        }
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;
        onSendMessage(input);
        setInput('');
    };

    return (
        <form className="message-input-form" onSubmit={handleSubmit}>
            <input
                ref={inputRef}
                type="text"
                className="message-input"
                placeholder="메시지를 입력하세요..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
            />
            <button type="submit" className="send-button" disabled={isTyping}>
                전송
            </button>
        </form>
    );
});

export default MessageInput;