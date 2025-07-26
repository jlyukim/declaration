import React, { useEffect } from 'react';
import './CardHand.css';
import { Card, CardProps } from '../Card'
import sets from '../Sets'

interface GridProps {
    Set: string;
    deckType: string;
    selectedOverlayCard: string | null;
    setSelectedOverlayCard: (card: string | null) => void;
    cardCycle: boolean;
}

function CardGrid({ Set , deckType, selectedOverlayCard, setSelectedOverlayCard, cardCycle}: GridProps) {
  const cards = sets.get(Set) ?? [];
  const [colorIndices, setColorIndices] = React.useState<number[]>(Array(cards.length).fill(0));

  function updateColorIndex(idx: number) {
    if (!cardCycle) return; // Only cycle colors if cardCycle is true

    setColorIndices(prev =>
      prev.map((val, i) => i === idx ? (val < 3 ? val + 1 : 0) : val)
    );
  }

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
            colorIndex={colorIndices[index]}
            onCycleColor={() => updateColorIndex(index)}
          />
        </div>
      ))}
    </div>
  );
}

export default CardGrid;