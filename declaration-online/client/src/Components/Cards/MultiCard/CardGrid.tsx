import React from 'react';
import './CardHand.css';
import { Card, CardProps } from '../Card'
import sets from '../Sets'

interface GridProps {
    Set: string;
    deckType: string;
}

function CardGrid({ Set , deckType }: GridProps) {
    const cards = sets.get(Set) ?? [];
    return (
    <div className="card-hand-container"
      style={{
            justifySelf: "center",
            // position: "absolute",
            // top: "35%",
            // left: "10%",
            // transform: "translate(0%, 0%)",
          }}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          className="card-item"
          style={{
            // gap: "10px",  
            marginLeft: index === 0 ? "0px" : "20px",
            // zIndex: index,
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