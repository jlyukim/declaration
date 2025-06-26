import React from 'react';
import './CardHand.css';
import { Card, CardProps } from './Card'
import { sets } from '../App'

interface GridProps {
    Set: string;
    deckType: string;
}

function CardGrid({ Set , deckType }: GridProps) {
    const cards = sets.get(Set) ?? [];
    return (
    <div className="card-hand-container">
      {cards.map((card, index) => (
        <div
          key={index}
          className="card-item"
          style={{
            gap: "10px",
            marginLeft: index === 0 ? "0px" : "0px",
            zIndex: index,
          }}
        >
          <Card
            value={card}
            deckType={deckType}
            faceUp={true}
          />
        </div>
      ))}
    </div>
  );

}

export default CardGrid;