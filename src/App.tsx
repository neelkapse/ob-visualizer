import React, { useState } from 'react';
import { Deck, InstallableCard } from './types';
import { extractDeckIdFromUrl, fetchDeck, fetchCards } from './api';
import { getInstallableCards, groupCardsByCost } from './utils';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cardsByCost, setCardsByCost] = useState<Map<number, InstallableCard[]> | null>(null);

  const analyzeDeck = async () => {
    if (!url.trim()) {
      setError('Please enter a NetrunnerDB decklist URL');
      return;
    }

    const deckId = extractDeckIdFromUrl(url);
    if (!deckId) {
      setError('Invalid NetrunnerDB decklist URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [deckData, allCards] = await Promise.all([
        fetchDeck(deckId),
        fetchCards()
      ]);

      const installableCards = getInstallableCards(deckData, allCards);
      const grouped = groupCardsByCost(installableCards);

      setDeck(deckData);
      setCardsByCost(grouped);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze deck');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analyzeDeck();
  };

  const renderCostRow = (cost: number, cards: InstallableCard[]) => (
    <div key={cost} className="cost-row">
      <div className="cost-number">{cost}</div>
      <div className="cost-content">
        <div className="cost-header">
          ({cards.reduce((sum, card) => sum + card.quantity, 0)} cards)
        </div>
        <div className="cards-grid">
          {cards.map((card) => (
            <div key={card.code} className="card-item">
              {card.image_url ? (
                <img 
                  src={card.image_url} 
                  alt={card.title}
                  className="card-image"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                    if (placeholder) {
                      placeholder.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div 
                className="card-image-placeholder" 
                style={{ display: card.image_url ? 'none' : 'flex' }}
              >
                No Image Available
              </div>
              <div className="card-info">
                <div className="card-title">{card.title}</div>
                <div className="card-details">
                  <div className="card-type">{card.type_code}</div>
                  <div className="card-quantity">{card.quantity}x</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <div className="top-section">
        <div className="left-panel">
          <div className="header">
            <h1>Ob Deck Visualizer</h1>
          </div>
          
          <div className="input-section">
            <form onSubmit={handleSubmit}>
              <div className="input-row">
                <input
                  type="text"
                  className="url-input"
                  placeholder="Enter NetrunnerDB decklist or deck URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button
                  type="submit"
                  className="analyze-button"
                  disabled={loading}
                >
                  {loading ? 'Analyzing...' : 'Analyze'}
                </button>
              </div>
            </form>
          </div>

          {error && <div className="error">{error}</div>}

          {loading && <div className="loading">Loading deck data...</div>}
        </div>

        {deck && (
          <div className="deck-info">
            <h2>{deck.name}</h2>
            <p>Deck ID: {deck.id}</p>
          </div>
        )}
      </div>

      {cardsByCost && (
        <div className="deck-visualization">
          {Array.from(cardsByCost)
            .sort(([a], [b]) => b - a)
            .map(([cost, cards]) => renderCostRow(cost, cards))}
        </div>
      )}
    </div>
  );
}

export default App;