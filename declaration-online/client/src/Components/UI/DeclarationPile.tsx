import CardHand from "../Cards/MultiCard/CardHand";
import { formatTextObjectToString, formatTextStringToSymbol } from "../../Types/Utils";

interface DeclarationPileProps {
  decCount: number;
  decSets: string[] | undefined;
  teamColor: string; // "red" | "blue"
}

function DeclarationPile({
  decCount,
  decSets,
  teamColor,
}: DeclarationPileProps) {
  var cards = Array.from({ length: 1 }, (_, i) => ({
    value: `cardback`,
    deckType: "RegularCards",
    faceUp: false,
  }));
  if (decSets) {
    cards = decSets.map((cardName) => ({
    value: cardName,
    deckType: "RegularCards",
    faceUp: true,
    }));
  }

  return (
    <div className={`declaration-pile-${teamColor}`}>
      <div className={`username-box dec-label-box ${teamColor}`}>
        <p className="username">{teamColor}</p>
      </div>
      <CardHand Cards={cards} deckType="RegularCards" faceUp={cards[0].faceUp} decPile={true} />
      <div className="card-count-label count-dec-pile">{decCount}</div>
    </div>
  );
}

export default DeclarationPile;