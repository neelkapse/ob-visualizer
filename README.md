# Ob: Superheavy Logistics Deck Visualizer

A web application for Netrunner players using the "Ob: Superheavy Logistics" identity. This tool analyzes NetrunnerDB decklists and displays installable cards organized by their install cost, making it easier to plan Ob's ability usage.

## Features

- **Supports both public and private decklists** - Works with NetrunnerDB decklist and deck URLs
- **Card images** - Displays official NetrunnerDB card artwork
- Fetches deck data using the NetrunnerDB API
- Filters for installable cards only (agenda, asset, ice, upgrade, program, hardware, resource)
- Organizes cards by install cost in descending order
- Shows card quantities, types, and images
- Responsive grid layout with hover effects
- Graceful fallback for missing card images

## Usage

1. Get a NetrunnerDB URL:
   - Public decklist: `https://netrunnerdb.com/en/decklist/0ed98238-6650-49a5-a6a3-e54dabe176a9/the-red-prince-1st-at-summer-showdown-`
   - Private deck: `https://netrunnerdb.com/en/deck/view/1234567`
2. Paste it into the input field
3. Click "Analyze Deck"
4. View your installable cards organized by cost with images

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm

### Setup

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Build

```bash
npm run build
```

## API Usage

This application uses the NetrunnerDB API v2.0:
- Deck endpoint: `GET /api/2.0/public/decklist/{id}`
- Cards endpoint: `GET /api/2.0/public/cards`

## Technical Details

- Built with React 18 and TypeScript
- Uses Vite for fast development and building
- Fetches data from NetrunnerDB's public API
- No backend required - runs entirely in the browser