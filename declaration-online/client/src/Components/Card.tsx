import React from 'react'
import "./Card.css"

export interface CardProps {
    deckType: string;
    value: string;
    faceUp: boolean; 
}

export const cards = {
    defaultCard: {
        value: "ace_of_spades",
        deckType: "RegularCards",
        faceUp: true,
    }
};
  
export function Card({ value,  deckType, faceUp }: CardProps) {
    const cardDir = `/Decks/${deckType}/${value}.svg`;
    const faceDownCardDir = `/Decks/cardback.png`;

    const handleClick = () => {
        if (faceUp) {
            console.log(`Card clicked: ${value}`);
        } else {
            console.log('Face Down Card Clicked')
        }
    };

    return(
        <div>
            <button 
                className="btn"
                onClick={handleClick}> 
                <img className="card-img" //styling in Card.css
                    src= {faceUp ? cardDir : faceDownCardDir}
                    // onClick={() => console.log("Card clicked")} 
                    // onPointerEnter={() => console.log("Card pointer enter")} 
                    // onPointerLeave={() => console.log("Card pointer leave")}
                />
            </button>
        </div>
    )
}