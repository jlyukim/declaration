export function formatCardText(value: string): string {
  const [rank, suit] = value.split("_of_");
  const suitSymbols: Record<string, string> = {
    spades: "♠",
    hearts: "♥",
    clubs: "♣",
    diamonds: "♦",
  };
  return `${rank.toUpperCase()}${suitSymbols[suit] + '?' || ''}`;
}
