// server/gameManager.ts

import { Deck, Card, Rank } from "./deck";
import { parseCardName } from "../client/src/Types/Utils"

type PlayerID = string;

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
}
