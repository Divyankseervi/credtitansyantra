# Land Intelligence System

AI-powered land analysis dashboard. Select land on an interactive map and receive insights including NDVI, flood/drought risk, soil health, and more.

## Tech Stack

- **React** + Vite
- **Tailwind CSS**
- **Leaflet** (maps + polygon drawing)
- **Axios** (for future API)

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── api/
│   ├── index.js    # Main API entry (switches mock/real)
│   ├── mock.js     # Mock responses (used when no backend)
│   └── client.js   # Axios client (used when backend ready)
├── components/
├── config.js       # USE_MOCK_API, API_BASE, etc.
└── constants.js
```

## Connecting the Backend

1. Edit `src/config.js`:
   - Set `USE_MOCK_API: false`
   - Optionally set `API_BASE` (or use `VITE_API_URL` in `.env`)

2. Ensure backend exposes `POST /analyze`:

```json
// Request body
{ "lat": 20.5937, "lon": 78.9629 }

// Response
{
  "land_type": "Agricultural - Crop Land",
  "ndvi_score": 0.72,
  "flood_risk": "Low (12%)",
  "drought_risk": "Medium (45%)",
  "soil_health": 78,
  "change_detection": "Stable vegetation cover...",
  "trust_score": 87
}
```

## Features

- 🗺️ Satellite + street map toggle
- ✏️ Draw polygon to select land
- 🌿 NDVI overlay (satellite view)
- 📊 AI insights: land type, NDVI, risks, soil health
- 🎯 Trust score & risk indicators
- ⚡ Animated loading & success states
- 📱 Responsive layout
