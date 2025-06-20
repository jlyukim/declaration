import React from 'react';
import './CardHand.css';
import { Card, CardProps } from './Card'

interface HandProps {
    Cards: CardProps[];
    deckType: string;
    faceUp: boolean; 
}

function CardHand({ Cards, deckType, faceUp }: HandProps) {
  const columnCount = Cards.length;

  const containerStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
    gap: "0px",
    translate: "10px",
  };

  const itemStyle: React.CSSProperties = {
    all: "unset",
    marginLeft: `${columnCount * -10}px`,
    zIndex: 0,
  };

  return (
    <div style={containerStyle}>
      {Cards.map((card, index) => (
        <div key={index} style={itemStyle}>
          <Card {...card} deckType={deckType} faceUp={faceUp} />
        </div>
      ))}
    </div>
  );
}



export default CardHand;