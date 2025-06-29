import React from 'react'
import "./Card.css"

export interface CardProps {
    deckType: string;
    value: string;
    faceUp: boolean;
    onCardClick?: (value: string) => void;
    isSelected?: boolean;
}

export const cards = {
    defaultCard: {
        value: "ace_of_spades",
        deckType: "RegularCards",
        faceUp: true,
    }
};
  
export function Card({ value,  deckType, faceUp, onCardClick, isSelected }: CardProps) {
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
    };

    return(
        <div>
            <button 
                className={`btn ${isSelected ? 'selected' : ''}`}
                onClick={handleClick}> 
                <img 
                    className={`card-img ${faceUp ? '' : 'card-face-down'}`}
                    src= {faceUp ? cardDir : faceDownCardDir}
                    // onClick={() => console.log("Card clicked")}
                />
            </button>
        </div>
    )
}