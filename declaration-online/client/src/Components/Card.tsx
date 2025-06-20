import React from 'react'
import "./Card.css"

export interface CardProps {
    deckType: string;
    value: string;
    faceUp: boolean; 
}

export const cards = {
    defaultCard: {
        deckType: "RegularCards",
        value: "ace_of_spades2",
        faceUp: true,
    }
};
  
export function Card({ deckType, value, faceUp }: CardProps) {
    const cardDir = `/Decks/${deckType}/${value}.svg`;
    const faceDownCardDir = `/Decks/cardback 2.png`;
    return(
        <div>
            <button 
                className="btn"
                onClick={() => console.log("Button Clicked")}> 
                <img className="cardImg" // For some reason my styling isn't working
                    src= {faceUp ? cardDir : faceDownCardDir}
                    width={200}
                    onClick={() => console.log("Card clicked")} 
                    onPointerEnter={() => console.log("Card pointer enter")} 
                    onPointerLeave={() => console.log("Card pointer leave")}
                />
            </button>
        </div>
    )
}