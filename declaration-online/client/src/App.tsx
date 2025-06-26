import { useEffect, useState } from 'react'
import { cards } from './Components/Card'
import CardHand from './Components/CardHand'
import CardGrid from './Components/CardGrid'
import { Card } from './Types/Card';
import Settings from './Components/Settings';

import './Components/Card.css'
import './App.css'

export var sets = new Map<string, string[]>();

function App() {
  const [deckType, changeDeck] = useState("RegularCards");
  const [hand, setHand] = useState<Card[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  //this needs to be updated once player assignment is dynamic and tied to backend
  const players = ["player1", "player2", "player3", "player4", "player5", "player6"];
  const [playerId, setPlayerId] = useState("player1"); // hardcoded for now

  sets = initSets();

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
      <div>
        <CardGrid
          Set={"HighDiamonds"}
          deckType={deckType}
        />
      </div>
      <Settings deckType={deckType} toggleDeck={toggleDeck} />
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

function initSets() {
  const sets = new Map<string, string[]>();

  const ranks = {
    low: ["2", "3", "4", "5", "6", "7"],
    high: ["9", "10", "jack", "queen", "king", "ace"],
    eight: ["8"],
  };

  const suits = ["Clubs", "Spades", "Hearts", "Diamonds"];

  suits.forEach((suit) => {
    const lowKey = `Low${suit}`;
    const highKey = `High${suit}`;

    sets.set(
      lowKey,
      ranks.low.map((rank) => `${rank}_of_${suit.toLowerCase()}`)
    );

    sets.set(
      highKey,
      ranks.high.map((rank) => `${rank}_of_${suit.toLowerCase()}`)
    );
  });

  // Add eights and jokers
  const eights = suits.map((suit) => `8_of_${suit.toLowerCase()}`);
  eights.push("black_joker", "red_joker");
  sets.set("EightsAndJokers", eights);

  return sets;
}

export default App
