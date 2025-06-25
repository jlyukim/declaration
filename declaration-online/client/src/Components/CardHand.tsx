import React from 'react';
import './CardHand.css';
import { Card, CardProps } from './Card'

interface HandProps {
    Cards: CardProps[];
    deckType: string;
    faceUp: boolean; 
}

function CardHand({ Cards, deckType, faceUp }: HandProps) {
  return (
    <div className="card-hand-container">
      {Cards.map((card, index) => (
        <div
          key={index}
          className="card-item"
          style={{
            marginLeft: index === 0 ? "0px" : "-60px", // dynamic overlap
            zIndex: index, // so cards later in the hand render on top
          }}
        >
          <Card {...card} deckType={deckType} faceUp={faceUp} />
        </div>
      ))}
    </div>
  );
}

export default CardHand;