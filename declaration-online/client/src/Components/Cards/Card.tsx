import React from 'react'
import "./Card.css"
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';

export interface CardProps {
    deckType: string;
    value: string;
    faceUp: boolean;
    isSelected?: boolean;
    onCardClick?: (value: string) => void;
    className?: string;
    dragHandleProps?: DraggableProvidedDragHandleProps;
}

export const cards = {
    defaultCard: {
        value: "ace_of_spades",
        deckType: "RegularCards",
        faceUp: true,
    }
};
  
export function Card({ value,  deckType, faceUp, onCardClick, isSelected, className, dragHandleProps}: CardProps) {
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
            <div
                className={`btn ${isSelected ? 'selected' : ''} ${className || ""}`}
                onClick={handleClick}
                draggable={true}
                {...dragHandleProps}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                  }
                }}
            >
                <img
                    className={`card-img ${faceUp ? '' : 'card-face-down'}`}
                    src={faceUp ? cardDir : faceDownCardDir}
                />
            </div>
        </div>
    )
}