import { useEffect, useState } from "react";
import CardHand from "./Components/CardHand";
import { Card } from "./Types/Card";
import CardGrid from './Components/CardGrid'
import OpponentHand from "./Components/OpponentHand";
import Settings from "./Components/Settings";
import sets from "./Components/Sets"

import "./Components/TableLayout.css";
import "./Components/Card.css";
import "./App.css";

function App() {
  const [deckType, changeDeck] = useState("RegularCards");
  const [hands, setHands] = useState<Record<
    string,
    { count: number; cards?: Card[] }
  > | null>(null);

  // Hardcoded players and current player
  const players = [
    "player1",
    "player2",
    "player3",
    "player4",
    "player5",
    "player6",
  ];
  const [playerId, setPlayerId] = useState("player1"); // Hardcoded current player

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
            />
          ))}
        </div>

        <div className="middle-row">
          <OpponentHand
            cardCount={hands[sidePlayers[0]]?.count || 0}
            position="left"
          />
          <h1 className="title">declaration</h1>
          <OpponentHand
            cardCount={hands[sidePlayers[1]]?.count || 0}
            position="right"
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
            />
          </div>
      </div>
    </div>
  );
}

export default App;
