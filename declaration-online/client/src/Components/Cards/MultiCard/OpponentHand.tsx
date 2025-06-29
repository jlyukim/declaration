import CardHand from "./CardHand";

function OpponentHand({
  cardCount,
  position,
  teamColor, // "red" | "blue"
}: {
  cardCount: number;
  position: "top" | "left" | "right";
  teamColor: string; // "red" | "blue"
}) {
  const cardsToShow = Math.min(cardCount, 4);
  const cardBacks = new Array(cardsToShow).fill({
    value: "cardback",
    deckType: "RegularCards",
    faceUp: false,
  });

  return (
    <div className={`opponent-hand opponent-${position}`}>
      <div className={`username-box ${teamColor}`}>
        <p className="username">username</p>
      </div>
      <CardHand Cards={cardBacks} deckType="RegularCards" faceUp={false} />
      {cardCount > 4 && <div className="card-count-label">{cardCount}</div>}
    </div>
  );
}

export default OpponentHand;