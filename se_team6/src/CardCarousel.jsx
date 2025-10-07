import React, { useState } from 'react';
import CardMessage from './CardMessage';
import './CardCarousel.css';

function CardCarousel({ cards }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => {
        const isFirstCard = currentIndex === 0;
        const newIndex = isFirstCard ? cards.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastCard = currentIndex === cards.length - 1;
        const newIndex = isLastCard ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <div className="carousel-container">
            <div className="carousel-window">
                <div
                    className="carousel-track"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {cards.map((cardContent, index) => (
                        <div className="carousel-card" key={index}>
                            <CardMessage content={cardContent} />
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={goToPrevious} className="carousel-button prev">‹</button>
            <button onClick={goToNext} className="carousel-button next">›</button>
            <div className="pagination-dots">
                {cards.map((_, index) => (
                    <div
                        key={index}
                        className={`dot ${currentIndex === index ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    ></div>
                ))}
            </div>
        </div>
    );
}

export default CardCarousel;