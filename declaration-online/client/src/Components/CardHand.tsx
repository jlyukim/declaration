import React from 'react';
import './CardHand.css';
import { Card, CardProps } from './Card'

interface HandProps {
    Cards: CardProps[];
    faceUp: boolean; 
}

function CardHand({ Cards, faceUp}: HandProps) {
  return (
    <div className="grid-container">
        {Cards.map((card, index) => {
        const itemClass =
          index === 0 ? "item item1" :
          index === 1 ? "item item2" :
          "item";

        return (
          <div key={index} className={itemClass}>
            <Card {...card} faceUp={faceUp} />
          </div>
        );
      })}

    </div>
  );
}

export default CardHand;a