import React, { useState } from 'react';
import './SearchBar.css';

interface Props {
    onSearch: (query: string) => void;
    isLoading: boolean;
}

export const SearchBar: React.FC<Props> = ({ onSearch, isLoading }) => {
    const [input, setInput] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(input);
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <div className="search-wrapper">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="예: 용산 데이트 코스 추천해줘" className="search-input" disabled={isLoading} />
                <button type="submit" disabled={isLoading} className="search-btn">{isLoading ? '...' : '전송'}</button>
            </div>
        </form>
    );
};