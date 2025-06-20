import React from 'react'
import "./Card.css"

export interface CardProps {
    deckType: string;
    value: string;
    faceUp: boolean; 
}

export const cards = {
    defaultCard: {
        value: "ace_of_spades2",
        deckType: "RegularCards",
        faceUp: true,
    }
};
  
export function Card({ value,  deckType, faceUp }: CardProps) {
    const cardDir = `/Decks/${deckType}/${value}.svg`;
    const faceDownCardDir = `/Decks/cardback 2.png`;

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
                <img // className="cardImg" // For some reason my styling isn't working
                    src= {faceUp ? cardDir : faceDownCardDir}
                    width={200}
                    height={290}
                    // onClick={() => console.log("Card clicked")} 
                    // onPointerEnter={() => console.log("Card pointer enter")} 
                    // onPointerLeave={() => console.log("Card pointer leave")}
                />
            </button>
        </div>
    )
}