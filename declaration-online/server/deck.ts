// server/deck.ts

export type Suit = "Hearts" | "Diamonds" | "Clubs" | "Spades";
export type Rank = "ace" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "jack" | "queen" | "king";
export type JokerColor = "Red" | "Black";

export type Card =
  | { suit: Suit; rank: Rank }    // Standard card
  | { type: "Joker"; color: JokerColor };  // Joker card (no "suit")

export class Deck {
  public cards: Card[] = [];

  constructor() {
    this.reset();
  }

  private generateStandardCards(): Card[] {
    const suits: Suit[] = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const ranks: Rank[] = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];

    return suits.flatMap((suit) =>
      ranks.map((rank) => ({ suit, rank } as Card))
    );
  }

  private generateJokers(): Card[] {
    const jokers: Card[] = [];
    for (let i = 0; i < 2; i++) {
      jokers.push(
        { type: "Joker", color: i % 2 === 0 ? "Red" : "Black" }
      );
    }
    return jokers;
  }

  private shuffle(cards: Card[]): Card[] {
    // Fisher-Yates shuffle (pure function - returns new array)
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  reset(): void {
    this.cards = this.shuffle([
      ...this.generateStandardCards(),
      ...this.generateJokers()
    ]);
  }

  draw(): Card | null {
    const card = this.cards.pop();
    return card ? { ...card } : null; // Return a copy to prevent external mutation
  }

  remaining(): number {
    return this.cards.length;
  }

  peekTop(): Card | null {
    const card = this.cards[this.cards.length - 1];
    return card ? { ...card } : null; // Return a copy
  }

  isEmpty(): boolean {
    return this.cards.length === 0;
  }
  
}

  
  