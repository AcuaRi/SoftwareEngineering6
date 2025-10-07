import React from 'react';
import './CardMessage.css';

function CardMessage({ content }) {
    return (
        <div className="card-message">
            {content.imageUrl && <img src={content.imageUrl} alt={content.title} className="card-image" />}
            <div className="card-content">
                <h3 className="card-title">{content.title}</h3>
                <p className="card-text">{content.text}</p>
                {content.link && (
                    <a href={content.link} target="_blank" rel="noopener noreferrer" className="card-link">
                        더 알아보기
                    </a>
                )}
            </div>
        </div>
    );
}

export default CardMessage;