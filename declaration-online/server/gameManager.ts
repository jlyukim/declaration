// server/gameManager.ts

import { Deck, Card, Suit, Rank } from "./deck";

type PlayerID = string;

function parseCardName(cardName: string): Card | null {
  if (cardName === "black_joker") return { type: "Joker", color: "Black" };
  if (cardName === "red_joker") return { type: "Joker", color: "Red" };

  const [rankStr, suit] = cardName.split("_of_");

  const rank = rankStr; // Keep as string to match deck format

  if (typeof suit !== "string") return null;

  return {
    suit: suit as Suit,
    rank: rank as Rank
  };
}

export class GameManager {
    deck = new Deck();
    hands: Record<PlayerID, Card[]> = {};
    players: PlayerID[] = [];

    constructor(playerIds: PlayerID[]) {
        this.players = playerIds;
        this.dealCards();
    }

    private dealCards() {
        for (const id of this.players) this.hands[id] = [];

        for (let i = 0; i < 9; i++) {
            for (const id of this.players) {
                const card = this.deck.draw();
                if (card) this.hands[id].push(card);
            }
        }
    }

    getHand(id: PlayerID): Card[] {
        return this.hands[id] ?? [];
    }

    
    // ------------------- ASK + RESPONSE LOGIC -------------------
    handleAsk(playerId: PlayerID, targetId: PlayerID, cardName: string): {
        success: boolean;
        received: boolean;
        message: string;
    } {
        const card = parseCardName(cardName);
        
        if (!card) {
            return {
                success: false,
                received: false,
                message: "error. no card selected",
            };
        }

        const targetHand = this.hands[targetId];
        const targetIndex = targetHand.findIndex(
            (c) => JSON.stringify(c) === JSON.stringify(card)
        );

        // Target player has card - successful ask
        if (targetIndex !== -1) {
            // Remove from target
            targetHand.splice(targetIndex, 1);

            // Add to player
            this.hands[playerId].push(card);

            return {
                success: true,
                received: true,
                message: `${playerId} got ${cardName} from ${targetId}`
            };
        }

        // Target player didn't have card
        return {
            success: true,
            received: false,
            message: `${targetId} does not have ${cardName}`
        };
    }

    // ------------------- DECLARE CHECK HELPER -------------------
    checkforCardInHand(targetId: PlayerID, cardName: string): number {
        const card = parseCardName(cardName);

        if (!card) {
            throw new Error("Invalid card name");
        }

        const targetHand = this.hands[targetId]; // Assuming left player is at index 0
        return targetHand.findIndex(
            (c) => JSON.stringify(c) === JSON.stringify(card)
        );
    }
    // ------------------- DECLARE CHECK LOGIC -------------------
    // This function handles the declaration logic when a player declares a card they believe another player has
    // Note: Possible improvements could include checking all declared cards in the target player's hand
    handleDeclareCheck(targetIds: string[], cardsLeftPlayerCheck: string[], cardsRightPlayerCheck: string[]): {
        success: boolean;
        correctCheck: boolean;
        message: string;
    } {
        for (const cardName of cardsLeftPlayerCheck) {
        if (this.checkforCardInHand(targetIds[0], cardName) === -1) {
            return {
                success: true,
                correctCheck: false,
                message: `${targetIds[0]} does not have ${cardName}`
            };
        }
        }

        for (const cardName of cardsRightPlayerCheck) {
        if (this.checkforCardInHand(targetIds[1], cardName) === -1) {
            return {
                success: true,
                correctCheck: false,
                message: `${targetIds[1]} does not have ${cardName}`
            };
        }
        }

        // Target players all have card
        return {
            success: true,
            correctCheck: true,
            message: `${targetIds} have all declared cards`
        };
    }
}
