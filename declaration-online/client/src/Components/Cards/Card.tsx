import React from 'react'
import "./Card.css"

export interface CardProps {
    deckType: string;
    value: string;
    faceUp: boolean;
    isSelected?: boolean;
    onCardClick?: (value: string) => void;
    className?: string;
    colorIndex?: number; 
    onCycleColor?: (value: string) => void; 
}

export const cards = {
    defaultCard: {
        value: "ace_of_spades",
        deckType: "RegularCards",
        faceUp: true,
    }
};
  
export function Card({ value,  deckType, faceUp, onCardClick, isSelected, className, colorIndex = 0, onCycleColor}: CardProps) {
    const cardDir = `/Decks/${deckType}/${value}.svg`;
    const faceDownCardDir = `/Decks/cardback.png`;

    const handleClick = () => {
        if (faceUp) {
            console.log(`Card clicked: ${value}`)
        } else {
            console.log('Face Down Card Clicked')
        }
        if (onCardClick) {
            onCardClick(value);
        }
        if (onCycleColor) {
            onCycleColor(value);
        }
    };

    return(
        <div>
            <button 
                className={`btn selected-color-${colorIndex} ${isSelected ? 'selected' : ''} ${className || ""}`}
                onClick={handleClick}> 
                <img 
                    className={`card-img ${faceUp ? '' : 'card-face-down'}`}
                    src= {faceUp ? cardDir : faceDownCardDir}
                />
            </button>
        </div>
    )
}