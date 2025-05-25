import { Card, Deck, InstallableCard } from './types';

const INSTALLABLE_TYPES = [
  'asset',
  'ice',
  'upgrade',
  'program',
  'hardware',
  'resource'
];

export const getInstallableCards = (
  deck: Deck,
  allCards: Card[]
): InstallableCard[] => {
  const cardMap = new Map(allCards.map(card => [card.code, card]));
  const installableCards: InstallableCard[] = [];

  Object.entries(deck.cards).forEach(([cardCode, quantity]) => {
    const card = cardMap.get(cardCode);
    if (!card) return;

    if (INSTALLABLE_TYPES.includes(card.type_code)) {
      const installCost = card.cost ?? 0;
      installableCards.push({
        ...card,
        install_cost: installCost,
        quantity
      });
    }
  });

  return installableCards;
};

export const groupCardsByCost = (cards: InstallableCard[]): Map<number, InstallableCard[]> => {
  const grouped = new Map<number, InstallableCard[]>();
  
  cards.forEach(card => {
    const cost = card.install_cost;
    if (!grouped.has(cost)) {
      grouped.set(cost, []);
    }
    grouped.get(cost)!.push(card);
  });

  return grouped;
};