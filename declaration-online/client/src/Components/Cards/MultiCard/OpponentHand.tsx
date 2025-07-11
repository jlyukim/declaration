import CardHand from "./CardHand";

interface OpponentHandProps {
  cardCount: number;
  position: "top" | "left" | "right";
  teamColor: string; // "red" | "blue"
  playerId: string; // this opponent's ID
  selectedTargetId: string | null;
  setSelectedTargetId: (id: string | null) => void;
  isOpponent: boolean;
  responseResult?: 'has' | 'not';
  askedByPlayerId?: string;
}

function OpponentHand({
  cardCount,
  position,
  teamColor,
  playerId,
  selectedTargetId,
  setSelectedTargetId,
  isOpponent,
  responseResult,
  askedByPlayerId
}: OpponentHandProps) {
  const cardsToShow = Math.min(cardCount, 4);
  const cardBacks = new Array(cardsToShow).fill({
    value: "cardback",
    deckType: "RegularCards",
    faceUp: false,
  });

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
      {askedByPlayerId && responseResult && (
      <div className="speech-bubble response">
        {responseResult === 'has' ? '✅' : '❌'}
      </div>
    )}
    </div>
  );
}

export default OpponentHand;