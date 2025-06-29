import { useEffect, useState, useMemo } from "react"
import { initSets, getSetFromCard} from "./Components/Cards/Sets"
import { Card } from "./Types/Card";

import OpponentHand from "./Components/Cards/MultiCard/OpponentHand";
import CardHand from "./Components/Cards/MultiCard/CardHand";
import CardGrid from './Components/Cards/MultiCard/CardGrid'
import Settings from "./Components/UI/Settings";


import "./Components/UI/TableLayout.css";
import "./Components/UI/Overlay.css";
import "./Components/Cards/Card.css";
import "./App.css";

function App() {
  const [deckType, changeDeck] = useState("RegularCards");
  const [currentSet, changeSet] = useState("HighDiamonds");
  const [hands, setHands] = useState<Record<
    string,
    { count: number; cards?: Card[] }
  > | null>(null);

  // Hardcoded players and team color
  const players = [
    "player1",
    "player2",
    "player3",
    "player4",
    "player5",
    "player6",
  ];
  const [playerId, setPlayerId] = useState("player1"); // Hardcoded current player

  const playerTeams: Record<string, "red" | "blue"> = {
  "player1": "red",
  "player2": "red",
  "player3": "blue",
  "player4": "red",
  "player5": "blue",
  "player6": "blue",
  };

  
  const sets = useMemo(() => initSets(), []);
  const [selectedCard, setSelectedCardValue] = useState<string | null>(null); //might be able to delete?
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const handleCardClick = (cardValue: string) => {
    setSelectedCardValue(cardValue); // might be able to delete?
    const cardSet = getSetFromCard(cardValue, sets);

    for (const [key, cardsInSet] of sets.entries()) {
      if (cardsInSet.includes(cardValue)) {
        setSelectedSet(key); // 👈 this triggers CardGrid to render
        break;
      }
    }
    console.log("Set for card:", cardValue, cardSet);
    
  };

  const topPlayers = players.slice(1, 4); // players 2, 3, 4
  const sidePlayers = players.slice(4); // players 5, 6

  // Fetch all hands from backend
  useEffect(() => {
    function fetchHands() {
      fetch(`http://localhost:3001/api/hands/${playerId}`)
        .then((res) => res.json())
        .then((data) => setHands(data))
        .catch(console.error);
    }
    fetchHands();
    const interval = setInterval(fetchHands, 3000);
    return () => clearInterval(interval);
  }, [playerId]);

  const toggleDeck = () => {
    changeDeck((deck) =>
      deck === "RegularCards" ? "HighContrastPlayingCards" : "RegularCards"
    );
  };

  if (!hands) return <div>Loading...</div>;

  return (
    <div className="App">
      <Settings deckType={deckType} toggleDeck={toggleDeck} />
      <div className="table-layout">
        
        <div className="top-players">
          {topPlayers.map((pid) => (
            <OpponentHand
              key={pid}
              cardCount={hands[pid]?.count || 0}
              position="top"
              teamColor={playerTeams[pid]}
            />
          ))}
        </div>

        <div className="middle-row">
          <OpponentHand
            cardCount={hands[sidePlayers[0]]?.count || 0}
            position="left"
            teamColor={playerTeams["player5"]}
          />
          <h1 className="title">declaration</h1>
          <OpponentHand
            cardCount={hands[sidePlayers[1]]?.count || 0}
            position="right"
            teamColor={playerTeams["player6"]}
          />
        </div>

        <div className="current-player-hand">
            <CardHand
              Cards={
                hands[playerId]?.cards?.map((card) => ({
                  deckType,
                  faceUp: true,
                  value:
                    "rank" in card && "suit" in card
                      ? `${card.rank.toLowerCase()}_of_${card.suit.toLowerCase()}`
                      : `${card.color.toLowerCase()}_joker`,
                })) || []
              }
              deckType={deckType}
              faceUp={true}
              onCardClick={handleCardClick}
              selectedCardValue={selectedCard}
            />
            <div className={`player-username ${playerTeams["player1"]}`}>You</div>
            <div className="set-display">
              {/* console.log(initSets()); */}
            </div>
          </div>
      </div>

      {selectedSet && (
        <div className="overlay">
          <CardGrid 
            Set={selectedSet} 
            deckType={deckType} 
          />
          <button className="close" onClick={() => {setSelectedSet(null); setSelectedCardValue(null);}}>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;
