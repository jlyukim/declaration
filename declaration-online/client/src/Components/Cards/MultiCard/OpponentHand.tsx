import CardHand from "./CardHand";
import { formatTextObjectToString, formatTextStringToSymbol } from "../../../Types/Utils";

interface OpponentHandProps {
  cardCount: number;
  position: "top" | "left" | "right";
  teamColor: string; // "red" | "blue"
  playerId: string; // this opponent's ID
  selectedTargetId: string | null;
  setSelectedTargetId: (id: string | null) => void;
  isOpponent: boolean;
  askState?: {
    from: string;
    to: string;
    card: string;
    result?: "has" | "not" | null;
  } | null
}

function OpponentHand({
  cardCount,
  position,
  teamColor,
  playerId,
  selectedTargetId,
  setSelectedTargetId,
  isOpponent,
  askState
}: OpponentHandProps) {
  const cardsToShow = Math.min(cardCount, 4);
  const cardBacks = Array.from({ length: cardsToShow }, (_, i) => ({
  value: `cardback-${i}`,
  deckType: "RegularCards",
  faceUp: false,
}));

  const handleUsernameClick = () => {
    if (!isOpponent) return; // Only allow selection for opponents
    if (selectedTargetId === playerId) {
      setSelectedTargetId(null); // Deselect if already selected
    } else {
      setSelectedTargetId(playerId); // Select this player
    }
  };
  
  const isSelected = selectedTargetId === playerId;

  return (
    <div className={`opponent-hand opponent-${position}`}>
      <div 
        className={`username-box ${teamColor} ${position} ${isSelected ? "selected" : ""}`}
        onClick={handleUsernameClick}
        style={{ cursor: isOpponent ? "pointer" : "default"}}
      >
        <p className="username">{playerId}</p>
      </div>
      <CardHand Cards={cardBacks} deckType="RegularCards" faceUp={false} />
      {cardCount > 4 && <div className="card-count-label">{cardCount}</div>}
      {askState && askState.from === playerId && (
      // {/* {askState &&( */}
        <>
          <div className="speech-bubble ask">
            {formatTextStringToSymbol(askState.card)}
          </div>
          {console.log("askState in OpponentHand:", askState)}
        </>
        
      )}
      {askState && askState.from === playerId && askState.result && (
      // {/* {askState && askState.result && ( */}
      <>
        {console.log("Rendering response bubble for", playerId, "with result:", askState.result)}
        <div className="speech-bubble response">
          {askState.result === "has" ? "✅" : "❌"}
          <div style={{ background: "red", zIndex: 9999 }}>
            RESPONSE
          </div>
        </div>
      </>
    )}
    </div>
  );
}

export default OpponentHand;