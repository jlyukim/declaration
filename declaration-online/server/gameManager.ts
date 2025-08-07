// server/gameManager.ts

import { Deck, Card, Suit, Rank } from "./deck";
// import { sets, getSetFromCard, getSetCardFromCard } from "./CopiedClientFiles/sets";
// import { players } from "./index";

const players = ["player1", "player2", "player3", "player4", "player5", "player6"];

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
    removeSetFromAllHands(set: string[]): void {
        for (const player of players) {
            for (const cardName of set) {
                const cardIndex = this.checkforCardInHand(player, cardName);
                if (cardIndex !== -1) {
                    this.hands[player].splice(cardIndex, 1);
                    set.splice(set.indexOf(cardName), 1);
                }
                if (set.length === 0) {
                    return;
                }
            }
        }
    }

    // Note: Possible improvements could include checking all declared cards in the target player's hand
    /**
     * This function handles the declaration logic when a player declares a card they believe another player has
     * @param targetIds An array of player IDs to check against
     * @param cardsLeftPlayerCheck An array of card names that the left player is declaring
     * @param cardsRightPlayerCheck An array of card names that the right player is declaring
     * @param set The set of cards that the players are declaring
     * @returns An object containing the success status, whether the check was correct, a message, and the set card
     */
    handleDeclareCheck(targetIds: string[], cardsLeftPlayerCheck: string[], cardsRightPlayerCheck: string[], set: string[]): {
        success: boolean;
        correctCheck: boolean;
        message: string;
        setCard: string;
    } {
        // console.log("Set card for declaration check:", setCard);
        // const setCard = cardsLeftPlayerCheck.length > 0 ? getSetCardFromCard(cardsLeftPlayerCheck[0]) : getSetCardFromCard(cardsRightPlayerCheck[0]);
        // const set = getSetFromCard(setCard, sets);
        const setCard = set[5];

        if (!set) {
            return {
                success: false,
                correctCheck: false,
                message: "Invalid set",
                setCard: setCard
            };
        }

        var targetIndex;
        for (const cardName of cardsLeftPlayerCheck) {
            targetIndex = this.checkforCardInHand(targetIds[0], cardName)
            if (targetIndex === -1) {
                this.removeSetFromAllHands(set);
                return {
                    success: true,
                    correctCheck: false,
                    message: `${targetIds[0]}, does not have ${cardName}`, // Comma for finding playerId
                    setCard: setCard
                };
            }
            this.hands[targetIds[0]].splice(targetIndex, 1);
            set.splice(set.indexOf(cardName), 1);
        }

        for (const cardName of cardsRightPlayerCheck) {
            targetIndex = this.checkforCardInHand(targetIds[1], cardName)
            if (targetIndex === -1) {
                this.removeSetFromAllHands(set);
                return {
                    success: true,
                    correctCheck: false,
                    message: `${targetIds[1]}, does not have ${cardName}`, // Comma for finding playerId
                    setCard: setCard
                };
            }
            this.hands[targetIds[1]].splice(targetIndex, 1);
            set.splice(set.indexOf(cardName), 1);
        }

        // Target players all have card
        const targetOneIndex = players.findIndex(
            (c) => JSON.stringify(c) === JSON.stringify(targetIds[0])
        );

        const targetTwoIndex = players.findIndex(
            (c) => JSON.stringify(c) === JSON.stringify(targetIds[1])
        );
        console.log("Target player indices:", targetOneIndex, targetTwoIndex);

        const maxIndex = Math.max(targetOneIndex, targetTwoIndex);
        const minIndex = Math.min(targetOneIndex, targetTwoIndex);
        const diff = maxIndex - 2 * minIndex;
        const targetThreeIndex = (6 - diff) % 6;
        console.log("Indexes", maxIndex, minIndex, targetThreeIndex);
        
        set.forEach((cardName) => {
            if (this.checkforCardInHand(players[targetThreeIndex], cardName) === -1) {
                throw new Error(`Card ${cardName} not found in ${players[targetThreeIndex]}'s hand`);
            }
            console.log(`Found ${cardName} at ${this.checkforCardInHand(players[targetThreeIndex], cardName)} in ${players[targetThreeIndex]}'s hand`);
            this.hands[players[targetThreeIndex]].splice(this.checkforCardInHand(players[targetThreeIndex], cardName), 1);
        });

        return {
            success: true,
            correctCheck: true,
            message: `${targetIds} have all declared cards`,
            setCard: setCard
        };
    }
}
