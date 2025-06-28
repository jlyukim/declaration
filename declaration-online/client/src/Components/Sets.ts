const sets = new Map<string, string[]>();

const ranks = {
  low: ["2", "3", "4", "5", "6", "7"],
  high: ["9", "10", "jack", "queen", "king", "ace"],
  eight: ["8"],
};

const suits = ["Clubs", "Spades", "Hearts", "Diamonds"];

suits.forEach((suit) => {
  const lowKey = `Low${suit}`;
  const highKey = `High${suit}`;

  sets.set(
    lowKey,
    ranks.low.map((rank) => `${rank}_of_${suit.toLowerCase()}`)
  );

  sets.set(
    highKey,
    ranks.high.map((rank) => `${rank}_of_${suit.toLowerCase()}`)
  );
});

// Add eights and jokers
const eights = suits.map((suit) => `8_of_${suit.toLowerCase()}`);
eights.push("black_joker", "red_joker");
sets.set("EightsAndJokers", eights);

export default sets;