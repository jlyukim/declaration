import { useEffect, useState } from 'react';
import CardGrid from "../Cards/MultiCard/CardGrid";
import { getSetStrFromCard } from '../Cards/Sets';
import sets from '../Cards/Sets';

import './Declare.css';
import React from 'react';
import { Card } from '../../Types/Card';
import { formatTextObjectToString } from '../../Types/Utils';

interface DeclareProps {
  deckType: string;
  selectedOverlayCard: string | null;
  setSelectedOverlayCard: (card: string | null) => void;
  playerHand: Card[];
  // backPlayerHands: Card[][];
}

export default function Declare({ deckType, selectedOverlayCard, setSelectedOverlayCard, playerHand }: DeclareProps) {
  const [showGrid, setShowDeclareGrid] = useState(false);
  const [declareSetStr, setDeclareSetStr] = useState("SetOfSets");
  const [cardCycle, setCardCycle] = useState(false);
  const [colorIndices, setColorIndices] = React.useState<number[]>(Array(6).fill(0));

  var declarationSuccess = true;

  useEffect(() => {
                console.log("declareSetStr updated:", declareSetStr);
                console.log("cardCycle updated:", cardCycle);
            }, [declareSetStr, cardCycle]);

  function updateColorIndex(idx: number) {
    if (!cardCycle) return; // Only cycle colors if cardCycle is true

    setColorIndices(prev =>
      prev.map((val, i) => i === idx ? (val < 3 ? val + 1 : 0) : val)
    );
  }

  function checkForOwnCard(cardToCheck: string): boolean {
    return playerHand.some(
      (card) => formatTextObjectToString(card) === cardToCheck
    )
  }

  function handleClose() {
    setShowDeclareGrid(false);
    setDeclareSetStr("SetOfSets");
    setCardCycle(false);
    setSelectedOverlayCard(null);
    setColorIndices(Array(6).fill(0)); // Reset color indices
  }
            
  function handleConfirm() {
    if (declareSetStr === "SetOfSets") {
      // Logic to handle confirmation of the selected card
      console.log("Card confirmed:", selectedOverlayCard);
      // Reset the selected card after confirmation
      
      if (selectedOverlayCard) {
          setDeclareSetStr(getSetStrFromCard(selectedOverlayCard, sets));
          setCardCycle(true);

          console.log("Selected card set");
      } else {
          console.log("No card selected for confirmation.");
      }
      
      setSelectedOverlayCard(null);
    } else {
      for (let idx = 0; idx < colorIndices.length; idx++) {
        const color = colorIndices[idx];
        switch (color) {
          case 0:
            alert("All cards must have a player assigned to them");
            break;
          case 1:
            declarationSuccess = checkForOwnCard(sets.get(declareSetStr)?.[idx] ?? "");
            break;
          case 2:
            // Backend logic for color index 2
            break;
          case 3:
            // Backend logic for color index 3
            break;
          default:
            console.log("Error color index is valid:", color);
            declarationSuccess = false;
            break;
        }

        if (!declarationSuccess) {
          alert(sets.get(declareSetStr)?.[idx] + " was not assigned correctly");
          break;
        }
      }

      // TODO: Add logic to take cards from people's hands
      // TODO: Add logic to make declaration piles

      setShowDeclareGrid(false);
      setDeclareSetStr("SetOfSets");
      setCardCycle(false);
      setSelectedOverlayCard(null);
      setColorIndices(Array(6).fill(0)); // Reset color indices
      
      if (declarationSuccess) {
        alert("Declaration successful!");
      } else {
        console.log("Declaration failed");
      }
    }
  }

  return (
    <>
      <button
        className="declare-button"
        onClick={() => setShowDeclareGrid(prev => !prev)}
        aria-label="Toggle Declare Grid">
            Declaration
      </button>

        {showGrid && (
            <div className="overlay">
                <CardGrid 
                    Set={declareSetStr} 
                    deckType={deckType}
                    selectedOverlayCard={selectedOverlayCard}
                    setSelectedOverlayCard={setSelectedOverlayCard}
                    cardCycle={cardCycle}
                    colorIndices={colorIndices}
                    updateColorIndex={updateColorIndex}
                />

                {cardCycle ? (
                    <div>
                      <button 
                        className="close-button"
                        onClick={handleClose}
                        >
                        Close
                      </button>
                      <button 
                        className="confirm-button"
                        onClick={handleConfirm}
                        >
                        Confirm
                      </button>
                    </div>
                ) : selectedOverlayCard ? (
                    <button 
                    className="ask-button"
                    onClick={handleConfirm}
                    >
                    Confirm
                    </button>
                ) : (
                  <button 
                    className="close-button"
                    onClick={handleClose}
                    >
                    Close
                    </button>
                )}
            </div>
        )}
    </>
  );
}
