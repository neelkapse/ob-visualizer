export interface Card {
  code: string;
  title: string;
  type_code: string;
  cost?: number;
  faction_code: string;
  faction_cost?: number;
  side_code: string;
  uniqueness?: boolean;
  text?: string;
  install_cost?: number;
  image_url?: string;
}

export interface DeckCard {
  card: Card;
  quantity: number;
}

export interface Deck {
  id: string;
  name: string;
  cards: { [cardCode: string]: number };
  identity_code: string;
  date_creation: string;
  date_update: string;
}

export interface DeckResponse {
  success: boolean;
  data: Deck[];
}

export interface CardsResponse {
  success: boolean;
  data: Card[];
}

export interface InstallableCard extends Card {
  install_cost: number;
  quantity: number;
}