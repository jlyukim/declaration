import type { Card } from './Card'
import { Suit, Rank } from "../../../server/deck";
// Components/Utils.ts *mainly contains ask utils

//formatting the ask | update to format either ? for ask or "check" and "x" for response
export function formatTextStringToSymbol(value: string): string {
  const [rank, suit] = value.split("_of_");
  const suitSymbols: Record<string, string> = {
    spades: "♠",
    hearts: "♥",
    clubs: "♣",
    diamonds: "♦",
  };
  return `${rank.toUpperCase()}${suitSymbols[suit] + '?' || ''}`;
}

export function formatTextObjectToString(card: Card): string {
  if ('type' in card) {
    return `${card.color}_joker`.toLowerCase(); // e.g. "red_joker"
  }

  // Regular card
  return `${card.rank}_of_${card.suit}`.toLowerCase(); // e.g. "8_of_spades"
}

export function parseCardName(cardName: string): Card | null {
  if (cardName === "black_joker") return { type: "Joker", color: "Black" };
  if (cardName === "red_joker") return { type: "Joker", color: "Red" };

  const [rankStr, , suit] = cardName.split("_of_");

  const rank = isNaN(Number(rankStr)) ? rankStr : Number(rankStr);

  if (typeof suit !== "string") return null;

  return {
    suit: suit as Suit,
    rank: rank as Rank
  };
}



//check if player's hand contains the asked card

