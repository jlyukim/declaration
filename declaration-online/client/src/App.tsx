import { useRef, useEffect, useState, useMemo } from "react"
import { initSets, getSetFromCard} from "./Components/Cards/Sets"
import { Card } from "./Types/Card";
import { formatTextStringToSymbol, formatTextObjectToString } from "./Types/Utils";

import OpponentHand from "./Components/Cards/MultiCard/OpponentHand";
import CardHand from "./Components/Cards/MultiCard/CardHand";
import CardGrid from './Components/Cards/MultiCard/CardGrid'
import Settings from "./Components/UI/Settings";


import "./Components/UI/TableLayout.css";
import "./Components/UI/Overlay.css";
import "./Components/Cards/Card.css";
import "./App.css";
import { cards } from "./Components/Cards/Card";

function App() {
  const socketRef = useRef<WebSocket | null>(null);
  const [deckType, changeDeck] = useState("RegularCards");
  const [currentSet, changeSet] = useState("HighDiamonds");
  const [hands, setHands] = useState<Record<
    string,
    { count: number; cards?: Card[] }
  > | null>(null);

  const [lastAsk, setLastAsk] = useState<{ from: string; card: string } | null>(null);
  const [localHand, setLocalHand] = useState<Card[]>([]); // Local hand order for drag-and-drop

  // ------------------- WEBSOCKET CONNECTION -------------------
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ Frontend connected to WebSocket server");
    };

    // Clean up on unmount
    return () => {
      socket.close();
    };
  }, []);

  // ------------------- PLAYER ID -------------------

  // Hardcoded players and team color
  const players = [
    "player1",
    "player2",
    "player3",
    "player4",
    "player5",
    "player6",
  ];
  const [playerId, setPlayerId] = useState<string>(""); // Dynamically set playerId
  // const [playerId, setPlayerId] = useState("player1"); // Hardcoded player1 for testing purposes
  

  //Set player Id
  useEffect(() => {
    const stored = localStorage.getItem("playerId");
    if (stored) {
      setPlayerId(stored);
    } else {
      const input = prompt("Enter your Player ID (e.g., player1, player2, etc):");
      if (input) {
        localStorage.setItem("playerId", input);
        setPlayerId(input);
      }
    }
  }, []);

  const rotatedPlayers = [...players.slice(players.indexOf(playerId)), ...players.slice(0, players.indexOf(playerId))]; //redistributes players around the table based on current playerId

  const playerTeams: Record<string, "red" | "blue"> = {
  "player1": "blue",
  "player2": "red",
  "player3": "blue",
  "player4": "red",
  "player5": "blue",
  "player6": "red",
  };

  const topPlayers = [rotatedPlayers[4], rotatedPlayers[3], rotatedPlayers[2]]; // players 3, 4, 5 assuming currentPlayer = player1; backwards because of the way its laid out
  const sidePlayers = [rotatedPlayers[1], rotatedPlayers[5]]; // players 2, 6 assuming currentPlayer = player1

  // ------------------- CARD SELECT -------------------
  
  const sets = useMemo(() => initSets(), []);
  const [selectedCard, setSelectedCardValue] = useState<string | null>(null); //this is the card in the player's hand (opens up appropriate set)
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [selectedOverlayCard, setSelectedOverlayCard] = useState<string | null>(null); //this is the card getting asked
  const handleCardClick = (cardValue: string) => {
    setSelectedCardValue(cardValue);
    const cardSet = getSetFromCard(cardValue, sets);

    for (const [key, cardsInSet] of sets.entries()) {
      if (cardsInSet.includes(cardValue)) {
        setSelectedSet(key); // 👈 this triggers CardGrid to render
        break;
      }
    }
    console.log("Set for card:", cardValue, cardSet);
    
  };

  // ------------------- ASK + RESPONSE LOGIC -------------------
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null); // keep track of who is being asked
  const playerHand = hands?.[playerId]?.cards ?? []; // Keep track of player hand; this needs to get updated whenever player hand changes
  

  const handleAsk = () => {
    if (!selectedOverlayCard || !selectedTargetId || !playerId) {
      alert("Select a player and a card first.");
      return;
    }

    // If asking for a card you already own, handle "give" logic (if needed)
    const ownsAskedCard = playerHand.some(
      (card) => formatTextObjectToString(card) === selectedOverlayCard
    );
    if (ownsAskedCard) {
      // TODO: Implement "give" logic via WebSocket or REST if needed
      alert("You cannot ask for a card you already have. (Implement give logic if needed)");
      setSelectedOverlayCard(null);
      setSelectedTargetId(null);
      setSelectedCardValue(null);
      setSelectedSet(null);
      return;
    }

    // Send ask request via WebSocket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "ask",
          playerId: playerId,
          targetPlayerId: selectedTargetId,
          card: selectedOverlayCard,
        })
      );
      setLastAsk({ from: playerId, card: selectedOverlayCard! });
    } else {
      alert("WebSocket is not connected.");
    }

    // Reset UI state
    setSelectedOverlayCard(null);
    setSelectedSet(null);
    // setSelectedTargetId(null); // Optionally keep the target selected
    setSelectedCardValue(null);
  };

  useEffect(() => {
    if (!socketRef.current) return;
    const socket = socketRef.current;
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "ask_result") {
        // Handle the result (show a message, update UI, etc.)
        console.log("Ask result:", data);
        // Optionally, show a notification or update state here
      }
    };
  }, [/* dependencies if needed */]);

  //Fetch ask card from backend


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

  // Sync localHand with backend hand only if hand size changes
  useEffect(() => {
    if (hands && playerId && hands[playerId]?.cards) {
      const backendHand = hands[playerId]!.cards!;
      if (localHand.length !== backendHand.length) {
        setLocalHand(backendHand);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hands, playerId]);

  const toggleDeck = () => {
    changeDeck((deck) =>
      deck === "RegularCards" ? "HighContrastPlayingCards" : "RegularCards"
    );
  };

  if (!hands || !playerId) return <div>Loading...</div>;

  return (
    <div className="App">
      <Settings deckType={deckType} toggleDeck={toggleDeck} />
      <div className="table-layout">
        
        <div className="top-players">
          {topPlayers.map((pid) => (
            <OpponentHand
              key={pid}
              playerId={pid}
              cardCount={hands[pid]?.count || 0}
              position="top"
              teamColor={playerTeams[pid]}
              selectedTargetId={selectedTargetId}
              setSelectedTargetId={setSelectedTargetId}
              isOpponent={playerTeams[pid] !== playerTeams[playerId]}
            />
          ))}
        </div>

        <div className="middle-row">
          <OpponentHand
            playerId={sidePlayers[0]}
            cardCount={hands[sidePlayers[0]]?.count || 0}
            position="left"
            teamColor={playerTeams[sidePlayers[0]]}
            selectedTargetId={selectedTargetId}
            setSelectedTargetId={setSelectedTargetId}
            isOpponent={playerTeams[sidePlayers[0]] !== playerTeams[playerId]}
          />
          <h1 className="title">declaration</h1>
          <OpponentHand
            playerId={sidePlayers[1]}
            cardCount={hands[sidePlayers[1]]?.count || 0}
            position="right"
            teamColor={playerTeams[sidePlayers[1]]}
            selectedTargetId={selectedTargetId}
            setSelectedTargetId={setSelectedTargetId}
            isOpponent={playerTeams[sidePlayers[1]] !== playerTeams[playerId]}
          />
        </div>

        <div className="current-player-hand">
            <CardHand
              Cards={
                localHand.map((card) => ({
                  deckType,
                  faceUp: true,
                  value:
                    "rank" in card && "suit" in card
                      ? `${card.rank.toLowerCase()}_of_${card.suit.toLowerCase()}`
                      : `${card.color.toLowerCase()}_joker`,
                }))
              }
              deckType={deckType}
              faceUp={true}
              onCardClick={handleCardClick}
              selectedCardValue={selectedCard}
              onReorder={(newCards) => {
                // Map CardProps[] back to Card[] for localHand
                const reordered = newCards.map((c) => {
                  return localHand.find((card) => {
                    if ("rank" in card && "suit" in card) {
                      return `${card.rank.toLowerCase()}_of_${card.suit.toLowerCase()}` === c.value;
                    } else {
                      return `${card.color.toLowerCase()}_joker` === c.value;
                    }
                  })!;
                });
                setLocalHand(reordered);
              }}
            />
            <div className={`player-username ${playerTeams[playerId]}`}>{playerId}</div>
            {lastAsk?.from === playerId && (
              <div className="speech-bubble ask">
                {formatTextStringToSymbol(lastAsk.card)}
              </div>
            )}
          </div>
      </div>

      {selectedSet && (
        <div className="overlay">
          <CardGrid 
            Set={selectedSet} 
            deckType={deckType}
            selectedOverlayCard={selectedOverlayCard}
            setSelectedOverlayCard={setSelectedOverlayCard}
        />

        {selectedOverlayCard ? (
          <button 
            className="ask-button"
            onClick={handleAsk}
          >
            Ask
          </button>
        ) : (
          <button 
            className="close-button"
            onClick={() => {
              setSelectedSet(null);
              setSelectedCardValue(null);
            }}
          >
            Close
          </button>
        )}
      </div>
    )}
  </div>
)};


export default App;
