// server/index.ts

import express from "express";
import { WebSocketServer } from "ws";
import cors from "cors";
import { GameManager } from "./gameManager";
import { Card } from "./deck";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// create 6 players
const players = ["player1", "player2", "player3", "player4", "player5", "player6"];
const game = new GameManager(players);


// REST endpoint to get a hand
app.get("/api/hand/:playerId", (req, res) => {
  const id = req.params.playerId;
  res.json({ hand: game.getHand(id) });
});

// endpoint to get all hands (ONLY USED FOR TESTING PURPOSES OTHERWISE CHEATING)
app.get("/api/hands", (req, res) => {
  const allHands = game.players.reduce((acc, playerId) => {
    acc[playerId] = game.getHand(playerId);
    return acc;
  }, {} as Record<string, typeof game.getHand extends (...args: any) => infer R ? R : never>);
  
  res.json(allHands);
});

// server/index.ts

// endpoint: send all hands with only current player's cards
app.get("/api/hands/:currentPlayerId", (req, res) => {
  const currentPlayerId = req.params.currentPlayerId;

  type Hand = {
    count: number;
    cards?: ReturnType<typeof game.getHand>;
  };

  const allHands = game.players.reduce((acc, playerId) => {
    const handCards = game.getHand(playerId);
    acc[playerId] = {
      count: handCards.length,
      cards: playerId === currentPlayerId ? handCards : undefined,
    };
    return acc;
  }, {} as Record<string, Hand>);

  res.json(allHands);
});



// Start HTTP + WebSocket servers
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

type WSMessage =
  | { type: "play_card"; playerId: string; card: Card }
  | { type: "message"; text: string };

wss.on("connection", (socket) => {
  console.log("🧠 New WebSocket connection");

  socket.on("message", (data) => {
    const msg = JSON.parse(data.toString()) as WSMessage;

    if (msg.type === "play_card") {
      const success = game.playCard(msg.playerId, msg.card);
      if (success) {
        // broadcast to all players
        const broadcast = JSON.stringify({
          type: "card_played",
          playerId: msg.playerId,
          card: msg.card,
        });

        wss.clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(broadcast);
          }
        });
      }
    }
  });
});