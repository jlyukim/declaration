import { useRef, useEffect, useState, useMemo } from "react"
import { initSets, getSetFromCard, getSetCardFromCard} from "./Components/Cards/Sets"
import { Card } from "./Types/Card";
import { formatTextStringToSymbol, formatTextObjectToString } from "./Types/Utils";

import OpponentHand from "./Components/Cards/MultiCard/OpponentHand";
import CardHand from "./Components/Cards/MultiCard/CardHand";
import CardGrid from './Components/Cards/MultiCard/CardGrid'
import Settings from "./Components/UI/Settings";
import Declare from "./Components/UI/Declare";


import "./Components/UI/TableLayout.css";
import "./Components/UI/Overlay.css";
import "./Components/Cards/Card.css";
import "./App.css";
import { cards } from "./Components/Cards/Card";
import DeclarationPile from "./Components/UI/DeclarationPile";

function App() {
  const socketRef = useRef<WebSocket | null>(null);
  const [deckType, changeDeck] = useState("RegularCards");
  const [currentSet, changeSet] = useState("HighDiamonds");
  const [hands, setHands] = useState<Record<
    string,
    { count: number; cards?: Card[] }
  > | null>(null);

  const [lastAsk, setLastAsk] = useState<{ from: string; to: string; card: string, result: boolean } | null>(null);
  
  // Local state to maintain card order for the current player
  const [localHandOrder, setLocalHandOrder] = useState<Card[]>([]);
  const [playerTurn, setPlayerTurn] = useState<string>("player1"); // Default player turn, can be set dynamically

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
    if (playerTurn !== playerId) {
      alert("It's not your turn!");
      return;
    }

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

    if (playerTurn !== playerId) {
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
    } else {
      alert("WebSocket is not connected.");
    }

    // Reset UI state
    setSelectedOverlayCard(null);
    setSelectedSet(null);
    // setSelectedTargetId(null); // Optionally keep the target selected
    setSelectedCardValue(null);
  };

  // ------------------- DECLARE LOGIC -------------------
  const [decCountRed, setDecCountRed] = useState<number>(0); 
  const [decSetsRed, setDecSetsRed] = useState<string[]>([]); 
  const [decCountBlue, setDecCountBlue] = useState<number>(0); 
  const [decSetsBlue, setDecSetsBlue] = useState<string[]>([]); // Initialize with a default set for testing

  useEffect(() => {
    console.log("Red declarations:", decCountRed, decSetsRed);
    console.log("Blue declarations:", decCountBlue, decSetsBlue);
  }, [decCountRed, decSetsRed, decCountBlue, decSetsBlue]);

  const handleDeclareCheck = (cardsLeftPlayerCheck: string[], cardsRightPlayerCheck: string[], set: string[]) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "declareCheck",
          targetIds: [topPlayers[2], topPlayers[0]], // Teammates ordered left then right
          cardsLeftPlayerCheck: cardsLeftPlayerCheck,
          cardsRightPlayerCheck: cardsRightPlayerCheck,
          set: set, // Assuming both checks are for the same set
        })
      );
      console.log("Declare check sent:", {
        cardsLeftPlayerCheck,
        cardsRightPlayerCheck,
      });
    } else {
      alert("WebSocket is not connected.");
    }
  }


  useEffect(() => {
    if (!socketRef.current) return;
    const socket = socketRef.current;
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "ask_result":
          // Handle the result (show a message, update UI, etc.)
          console.log("Ask result:", data);
          
          setLastAsk({ 
            from: data.playerId,
            to: data.targetPlayerId,
            card: data.card,
            result: data.received
          });
          break;

        case "declareCheck_result":
          // Handle the declare check result
          console.log("Declare check result:", data);
          console.log("Checking player team: ", playerTeams[data.check.message.slice(0, data.check.message.indexOf(","))])
          if (data.check.correctCheck) {
            alert(`✅ Declaration successful! ${data.check.message}`);
            if (playerTeams[data.check.message.slice(0, data.check.message.indexOf(","))] === "blue") {
              // Keep the +1 because even if this line is moved below setDecSetsBlue, decSetsBlue will not be updated yet
              setDecCountBlue(prev => prev + 1);
              setDecSetsBlue(prev => prev.concat(data.check.setCard));
            } else {
              setDecCountRed(prev => prev + 1);
              setDecSetsRed(prev => prev.concat(data.check.setCard));
            }
          } else {
            alert(`❌ Declaration failed! ${data.check.message}`);
            if (playerTeams[data.check.message.slice(0, data.check.message.indexOf(","))] === "blue") {
              // Keep the +1 because even if this line is moved below setDecSetsBlue, decSetsBlue will not be updated yet
              setDecCountRed(prev => prev + 1);
              setDecSetsRed(prev => prev.concat(data.check.setCard));
              // console.log("Blue declaration failed, updated count:", decCountRed + 1);
            } else {
              setDecCountBlue(prev => prev + 1);
              setDecSetsBlue(prev => prev.concat(data.check.setCard));
              // console.log("Red declaration failed, updated count:", decCountRed + 1);
            }
          }
          // Update states off of finished declaration
          break;          
        default:
          // Optionally, show a notification or update state here
          break;
      }
    };
  }, [/* dependencies if needed */]);

  //Fetch ask card from backend

  // Fetch all hands from backend
  useEffect(() => {
    function fetchHands() {
      fetch(`http://localhost:3001/api/hands/${playerId}`)
        .then((res) => res.json())
        .then((data) => {
          setHands(data);
          
          // Sync local hand order with backend data
          if (data && playerId && data[playerId]?.cards) {
            const backendCards = data[playerId].cards;
            
            // Only update local order if:
            // 1. Local order is empty (first load)
            // 2. Backend hand size changed (cards added/removed)
            if (localHandOrder.length === 0 || localHandOrder.length !== backendCards.length) {
              setLocalHandOrder(backendCards);
            }
            // If sizes match, preserve local order (user's reordering)
          }
        })
        .catch(console.error);
    }

    function fetchDeclarations() {
      fetch(`http://localhost:3001/api/declarations`)
        .then((res) => res.json())
        .then((data) => {
          
          // Sync local hand order with backend data
          if (data) {

            console.log("Fetched declarations:", data);
            const decs = data.declarations;
            // data is two string[] for declarations made on each team

            // Only update local order if backend declaration size is different
            if (decCountRed !== decs.redDeclarations.length) {
              setDecCountRed(decs.redDeclarations.length);
              setDecSetsRed(decs.redDeclarations);
            }
            
            if (decCountBlue !== decs.blueDeclarations.length) {
              setDecCountBlue(decs.blueDeclarations.length);
              setDecSetsBlue(decs.blueDeclarations);
            }
          }
        })
        .catch(console.error);
    }

    function fetchPlayerTurn() {
      fetch(`http://localhost:3001/api/playerTurn`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Current player turn:", data.turn);
          // You can use this data to highlight the current player's hand or take other actions
          if (data.turn !== playerTurn) {
            setPlayerTurn(data.turn);
            console.log("Updated player turn state:", data.turn);
          }
        }).catch(console.error);
    }
    
    fetchHands();
    fetchDeclarations();
    fetchPlayerTurn();
    const interval = setInterval(fetchHands, 3000);
    return () => clearInterval(interval);
  }, [playerId, localHandOrder.length]); // Include localHandOrder.length to prevent infinite loops

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
              askState={lastAsk}
              playerTurn={playerTurn}
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
            askState={lastAsk}
            playerTurn={playerTurn}
          />
          <DeclarationPile
            decCount={decCountBlue}
            decSets={decSetsBlue}
            teamColor="blue"
          />
          <Declare
            deckType={deckType}
            selectedOverlayCard={selectedOverlayCard}
            setSelectedOverlayCard={setSelectedOverlayCard}
            playerHand={playerHand}
            handleDeclareCheck={handleDeclareCheck}
            prevDeclarations={decSetsBlue.concat(decSetsRed)}
          />
          <DeclarationPile
            decCount={decCountRed}
            decSets={decSetsRed}
            teamColor="red"
          />
          <OpponentHand
            playerId={sidePlayers[1]}
            cardCount={hands[sidePlayers[1]]?.count || 0}
            position="right"
            teamColor={playerTeams[sidePlayers[1]]}
            selectedTargetId={selectedTargetId}
            setSelectedTargetId={setSelectedTargetId}
            isOpponent={playerTeams[sidePlayers[1]] !== playerTeams[playerId]}
            askState={lastAsk}
            playerTurn={playerTurn}

          />
        </div>

        <div className="current-player-hand">
            <CardHand
            Cards={localHandOrder.map((card) => ({
              deckType,
              faceUp: true,
              value: "rank" in card && "suit" in card
                ? `${card.rank.toLowerCase()}_of_${card.suit.toLowerCase()}`
                : `${card.color.toLowerCase()}_joker`,
            }))}
            deckType={deckType}
            faceUp={true}
            onCardClick={handleCardClick}
            selectedCardValue={selectedCard}
            onReorder={(newCardProps) => {
              // Convert CardProps[] back to Card[] for localHandOrder
              const reorderedCards = newCardProps.map((cardProps) => {
                return localHandOrder.find((card) => {
                  if ("rank" in card && "suit" in card) {
                    return `${card.rank.toLowerCase()}_of_${card.suit.toLowerCase()}` === cardProps.value;
                  } else {
                    return `${card.color.toLowerCase()}_joker` === cardProps.value;
                  }
                })!;
              });

              // Update local hand order to persist the reordering
              setLocalHandOrder(reorderedCards);
              console.log('Cards reordered and persisted:', reorderedCards);
            } }/>
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
            cardCycle={false}
            colorIndices={[]} // No cycling in this grid
            updateColorIndex={() => {}}
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