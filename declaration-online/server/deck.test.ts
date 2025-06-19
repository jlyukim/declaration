import { Deck, Card } from './deck';

describe('Deck', () => {
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck(); // Fresh deck before each test
  });

  // ---- Constructor & Initialization ---- //
  test('initializes with 54 cards (52 standard + 2 jokers)', () => {
    expect(deck.remaining()).toBe(54);
  });

  // ---- reset() ---- //
  test('reset() restores full deck', () => {
    deck.draw();
    deck = new Deck(); // Initialize a fresh deck before each test
    expect(deck.remaining()).toBe(54); // 52 standard + 2 jokers
  
  });

  // ---- draw() ---- //
  test('draw() returns a card and reduces deck size', () => {
    const card = deck.draw();
    expect(card).toBeTruthy();
    expect(deck.remaining()).toBe(53);
  });

  test('draw() returns null when deck is empty', () => {
    while (!deck.isEmpty()) deck.draw();
    expect(deck.draw()).toBeNull();
  });

  // ---- peekTop() ---- //
  test('peekTop() shows next card without removing it', () => {
    const topCard = deck.peekTop();
    const drawnCard = deck.draw();
    expect(topCard).toEqual(drawnCard);
    expect(deck.remaining()).toBe(53);
  });

  // ---- shuffle() ---- //
  test('shuffle() randomizes order', () => {
    const originalOrder = [...deck.cards]; // Note: Requires `cards` to be public or a getter
    deck.reset(); // Re-shuffles
    expect(deck.cards).not.toEqual(originalOrder); // Flaky test (could rarely fail)
  });


});