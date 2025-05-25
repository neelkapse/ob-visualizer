import { Deck, Card, DeckResponse, CardsResponse } from "./types";

const NETRUNNERDB_API_BASE = "https://netrunnerdb.com/api/2.0";

export const extractDeckIdFromUrl = (url: string): string | null => {
  // Match both /decklist/ and /deck/view/ URLs
  const decklistMatch = url.match(/\/decklist\/([a-f0-9-]+)/);
  if (decklistMatch) return decklistMatch[1];

  const deckMatch = url.match(/\/deck\/view\/([a-f0-9-]+)/);
  if (deckMatch) return deckMatch[1];

  return null;
};

export const fetchDeck = async (deckId: string): Promise<Deck> => {
  // Try public decklist first
  let response = await fetch(
    `${NETRUNNERDB_API_BASE}/public/decklist/${deckId}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch deck: ${response.statusText}`);
  }

  let data: DeckResponse = await response.json();
  
  // If the response is successful but has no data, try the deck endpoint (for private decklists)
  if (!data.success || !data.data || data.data.length === 0) {
    response = await fetch(`${NETRUNNERDB_API_BASE}/public/deck/${deckId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch deck: ${response.statusText}`);
    }
    
    data = await response.json();
  }

  if (!data.success || !data.data[0]) {
    throw new Error("Deck not found");
  }
  return data.data[0];
};

export const fetchCards = async (): Promise<Card[]> => {
  const response = await fetch(`${NETRUNNERDB_API_BASE}/public/cards`);
  if (!response.ok) {
    throw new Error(`Failed to fetch cards: ${response.statusText}`);
  }
  const data: CardsResponse = await response.json();
  if (!data.success) {
    throw new Error("Failed to fetch cards");
  }

  // Add image URLs to cards
  return data.data.map((card) => ({
    ...card,
    image_url: `https://card-images.netrunnerdb.com/v2/large/${card.code}.jpg`,
  }));
};
