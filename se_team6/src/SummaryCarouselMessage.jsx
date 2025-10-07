import React from 'react';
import CardCarousel from './CardCarousel';
import './SummaryCarouselMessage.css';

function SummaryCarouselMessage({ content }) {
    return (
        <div className="summary-carousel-container">
            <div className="summary-text-box">
                {content.text}
            </div>
            <div className="summary-carousel-box">
                <CardCarousel cards={content.cards} />
            </div>
        </div>
    );
}

export default SummaryCarouselMessage;