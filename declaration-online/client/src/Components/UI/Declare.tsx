import { useEffect, useState } from 'react';
import CardGrid from "../Cards/MultiCard/CardGrid";
import { getSetStrFromCard } from '../Cards/Sets';
import sets from '../Cards/Sets';

import './Declare.css';

interface DeclareProps {
  deckType: string;
  selectedOverlayCard: string | null;
  setSelectedOverlayCard: (card: string | null) => void;
}

export default function Declare({ deckType, selectedOverlayCard, setSelectedOverlayCard }: DeclareProps) {
  const [showGrid, setShowDeclareGrid] = useState(false);
  const [declareSetStr, setDeclareSetStr] = useState("SetOfSets");
  const [cardCycle, setCardCycle] = useState(false);

  useEffect(() => {
                console.log("declareSetStr updated:", declareSetStr);
                console.log("cardCycle updated:", cardCycle);
            }, [declareSetStr, cardCycle]);
            
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
                />

                {cardCycle ? (
                    <div>
                      <button 
                        className="close-button"
                        onClick={() => {
                            setShowDeclareGrid(false);
                            setDeclareSetStr("SetOfSets");
                            setCardCycle(false);
                        }}
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
                    onClick={() => {
                        setShowDeclareGrid(false);
                        setDeclareSetStr("SetOfSets");
                        setCardCycle(false);
                    }}
                    >
                    Close
                    </button>
                )}
            </div>
        )}
    </>
  );
}
