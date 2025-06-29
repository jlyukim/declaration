import { useState } from "react";
// import './SetDisplay.css';


const sets = initSets();
export default sets;

export function initSets() {
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

  return sets;
}

export function getSetFromCard(cardValue: string, sets: Map<string, string[]>) {

    if (cardValue.includes("joker")) {
        return sets.get("EightsAndJokers") || null;
    }
  
    const [rank, suit] = cardValue.split('_of_');
    const suitCap = suit.charAt(0).toUpperCase() + suit.slice(1);

    if (["2", "3", "4", "5", "6", "7"].includes(rank)) {
    return sets.get(`Low${suitCap}`) || null;
    }
    if (["9", "10", "jack", "queen", "king", "ace"].includes(rank)) {
    return sets.get(`High${suitCap}`) || null;
    }
    if (rank === "8") {
    return sets.get("EightsAndJokers") || null;
    }

    return null;
}
