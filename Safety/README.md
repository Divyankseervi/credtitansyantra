# Safety Intelligence API

Backend API for safety analysis of locations based on infrastructure and crime data.

## Features

- **Location Analysis**: Reverse geocoding to get location details
- **Infrastructure Detection**: Finds nearby places like:
  - Police stations
  - Hospitals & clinics
  - Fire stations
  - Schools & universities
  - Banks & ATMs
  - Pharmacies
  - Restaurants & cafes
  - Fuel stations
  - Markets & supermarkets
- **Crime News Analysis**: Fetches recent crime news from GDELT API
- **Safety Scoring**: Calculates safety score based on multiple factors

## Setup

1. **Install dependencies** (if not already installed):
   ```bash
   pip install -r requirements.txt
   ```

2. **Activate virtual environment** (if using venv):
   ```bash
   # Windows
   .\venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

## Running the Server

### Option 1: Using Uvicorn directly
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Option 2: Using Python
```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Option 3: Using FastAPI CLI (if installed)
```bash
fastapi dev main.py
```

The server will start at `http://localhost:8000`

## API Endpoints

### GET `/`
Health check endpoint
```json
{
  "message": "Safety Intelligence API is running"
}
```

### GET `/safety?lat={latitude}&lon={longitude}`
Get safety analysis for a location

**Parameters:**
- `lat` (float, required): Latitude
- `lon` (float, required): Longitude

**Response:**
```json
{
  "location": {
    "display_name": "Location name",
    "city": "City",
    "state": "State",
    "country": "Country"
  },
  "lat": 19.0760,
  "lon": 72.8777,
  "policeStations": 5,
  "hospitals": 3,
  "crimeNewsCount": 2,
  "safetyScore": 85,
  "riskLevel": "Safe",
  "places": {
    "police_stations": [...],
    "hospitals": [...],
    "fire_stations": [...],
    "schools": [...],
    "banks": [...],
    "atms": [...],
    "pharmacies": [...],
    "restaurants": [...],
    "fuel_stations": [...],
    "marketplaces": [...]
  },
  "summary": {
    "police_stations": 5,
    "hospitals": 3,
    "fire_stations": 2,
    ...
  }
}
```

## Testing

Run the test script to verify everything is working:
```bash
python test_safety_api.py
```

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Dependencies

- `fastapi`: Web framework
- `uvicorn`: ASGI server
- `requests`: HTTP library for API calls
- `python-multipart`: For form data support

## Notes

- The API uses Overpass API (OpenStreetMap) to find nearby places
- Crime news is fetched from GDELT API
- All place searches are within a 1.5km radius by default
- Places are deduplicated if they're within 50 meters of each other
