import express, { Request, Response } from "express";
import { WebSocketServer, WebSocket } from "ws";
import cors from "cors";
import { GameManager } from "./gameManager";
import { Card } from "./deck";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize players and game manager
export const players = ["player1", "player2", "player3", "player4", "player5", "player6"];
const game = new GameManager(players);

// REST endpoint: get hand for a single player
app.get("/api/hand/:playerId", (req, res) => {
  const id = req.params.playerId;
  res.json({ hand: game.getHand(id) });
});

// REST endpoint: get all hands (FOR DEBUG/TESTING ONLY)
app.get("/api/hands", (req, res) => {
  const allHands = game.players.reduce((acc, playerId) => {
    acc[playerId] = game.getHand(playerId);
    return acc;
  }, {} as Record<string, typeof game.getHand extends (...args: any) => infer R ? R : never>);

  res.json(allHands);
});

// REST endpoint: get hand counts and cards for current player
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




// ------------------- WEBSOCKET SERVER -------------------

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });
const clients = new Set<WebSocket>();

wss.on("connection", (socket) => {
  console.log("🔌 New WebSocket connection");
  clients.add(socket);

  socket.on("message", (data) => {
    const msg = JSON.parse(data.toString()) as WSMessage;
    console.log("Reseived message:", msg);

    // ------------------- LISTENED MSG LOGIC -------------------
    switch (msg.type) {
      case "ask":
        const result = game.handleAsk(msg.playerId, msg.targetPlayerId, msg.card);
        if (result) {
          broadcast({
            type: "ask_result",
            playerId: msg.playerId,
            targetPlayerId: msg.targetPlayerId,
            card: msg.card,
            ...result,
          });
        }
        break;

      case "declareCheck":
        const check = game.handleDeclareCheck(msg.targetIds, msg.cardsLeftPlayerCheck, msg.cardsRightPlayerCheck, msg.set);
        // console.log("Received declareCheck for players:", msg, "Result:", check.correctCheck);
        broadcast({
          type: "declareCheck_result",
          check: check,
        });
        // console.log("Sending declareCheck_result");
        break;
    }
  });

  socket.on("close", () => {
    clients.delete(socket);
  });
});

type WSMessage =
  | { type: "ask"; playerId: string; targetPlayerId: string; card: string }
  | { type: "declareCheck"; targetIds: string[], cardsLeftPlayerCheck: string[]; cardsRightPlayerCheck: string[], set: string[] }
  | { type: "message"; text: string };

// Broadcast to all connected clients
function broadcast(data: any) {
  const json = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(json);
    }
  });
}
