import type { Card } from './Card'
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