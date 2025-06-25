// server/gameManager.ts

import { Deck, Card } from "./deck";

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

    playCard(id: PlayerID, card: Card): boolean {
        const hand = this.hands[id];
        const index = hand.findIndex((c) => JSON.stringify(c) === JSON.stringify(card));
        if (index !== -1) {
            hand.splice(index, 1);
            return true;
        }
        return false;
    }
}