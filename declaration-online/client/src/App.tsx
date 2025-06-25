import { useEffect, useState } from 'react'
import { cards } from './Components/Card'
import CardHand from './Components/CardHand'
import { Card } from './Types/Card';
import Settings from './Components/Settings';

import './Components/Card.css'
import './App.css'

function App() {
  const [deckType, changeDeck] = useState("RegularCards");
  const [hand, setHand] = useState<Card[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  //this needs to be updated once player assignment is dynamic and tied to backend
  const players = ["player1", "player2", "player3", "player4", "player5", "player6"];
  const [playerId, setPlayerId] = useState("player1"); // hardcoded for now


  // Load player hand and open WebSocket
  useEffect(() => {
    fetch(`http://localhost:3001/api/hand/${playerId}`)
      .then(res => res.json())
      .then(data => setHand(data.hand));

    const socket = new WebSocket("ws://localhost:3001");
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "card_played") {
        console.log(`${msg.playerId} played`, msg.card);
      }
    };
    setWs(socket);
    return () => socket.close();
  }, []);

  const toggleDeck = () => {
    changeDeck(deck => deck === "RegularCards" ? "HighContrastPlayingCards" : "RegularCards");
  };

  return (
    <div className="App">

      <Settings deckType={deckType} toggleDeck={toggleDeck} />

      <div>
        <CardHand
          Cards={hand.map((card) => ({
            deckType,
            faceUp: true,
            value:
              'rank' in card && 'suit' in card
                ? `${card.rank.toLowerCase()}_of_${card.suit.toLowerCase()}`
                : `${card.color.toLowerCase()}_joker`, // e.g. red_joker
          }))}
          deckType={deckType}
          faceUp={true}
        />
      </div>
    </div>
  );
}

export default App
