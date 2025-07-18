import React from 'react';
import './CardHand.css';
import { Card, CardProps } from '../Card'
import sets from '../Sets'

interface GridProps {
    Set: string;
    deckType: string;
    selectedOverlayCard: string | null;
    setSelectedOverlayCard: (card: string | null) => void;
}

function CardGrid({ Set , deckType, selectedOverlayCard, setSelectedOverlayCard}: GridProps) {
    const cards = sets.get(Set) ?? [];
    return (
    <div className="card-hand-container"
      style={{
            justifySelf: "center",
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
            isSelected={selectedOverlayCard === card}
            onCardClick={() => 
              setSelectedOverlayCard(selectedOverlayCard === card ? null : card)}
            className="overlay-card"
          />
        </div>
      ))}
    </div>
  );

}

export default CardGrid;