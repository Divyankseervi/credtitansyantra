from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from services.geocode_service import reverse_geocode
from services.places_service import get_nearby_places, count_nearby_places
from services.news_service import get_crime_news_count
from services.scoring_service import calculate_safety_score

app = FastAPI(title="Safety Intelligence API")

# CORS (important when frontend calls backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Safety Intelligence API is running"}

@app.get("/safety")
def safety(lat: float = Query(...), lon: float = Query(...)):

    # 1. Reverse geocode to get location name
    location = reverse_geocode(lat, lon)

    city = location.get("city") or ""
    district = location.get("district") or ""
    state = location.get("state") or ""

    # Use better query for news search
    location_query = f"{city} {state} India".strip()

    if not city:
        location_query = f"{district} {state} India".strip()

    # 2. Get detailed lists of nearby places (Overpass API)
    police_stations = get_nearby_places(lat, lon, "police", radius=1500)
    hospitals = get_nearby_places(lat, lon, "hospital", radius=1500)
    fire_stations = get_nearby_places(lat, lon, "fire_station", radius=1500)
    schools = get_nearby_places(lat, lon, "school", radius=1500)
    banks = get_nearby_places(lat, lon, "bank", radius=1500)
    atms = get_nearby_places(lat, lon, "atm", radius=1500)
    pharmacies = get_nearby_places(lat, lon, "pharmacy", radius=1500)
    restaurants = get_nearby_places(lat, lon, "restaurant", radius=1500)
    fuel_stations = get_nearby_places(lat, lon, "fuel", radius=1500)
    marketplaces = get_nearby_places(lat, lon, "marketplace", radius=1500)

    # Get counts for scoring
    police_count = len(police_stations)
    hospital_count = len(hospitals)

    # 3. Crime news count (GDELT API)
    crime_news_count = get_crime_news_count(location_query)

    # 4. Calculate safety score
    score, risk = calculate_safety_score(police_count, hospital_count, crime_news_count)

    # 5. Compile all places found
    all_places = {
        "police_stations": police_stations,
        "hospitals": hospitals,
        "fire_stations": fire_stations,
        "schools": schools,
        "banks": banks,
        "atms": atms,
        "pharmacies": pharmacies,
        "restaurants": restaurants,
        "fuel_stations": fuel_stations,
        "marketplaces": marketplaces
    }

    return {
        "location": location,
        "lat": lat,
        "lon": lon,
        "policeStations": police_count,
        "hospitals": hospital_count,
        "crimeNewsCount": crime_news_count,
        "safetyScore": score,
        "riskLevel": risk,
        "places": all_places,
        "summary": {
            "police_stations": len(police_stations),
            "hospitals": len(hospitals),
            "fire_stations": len(fire_stations),
            "schools": len(schools),
            "banks": len(banks),
            "atms": len(atms),
            "pharmacies": len(pharmacies),
            "restaurants": len(restaurants),
            "fuel_stations": len(fuel_stations),
            "marketplaces": len(marketplaces)
        }
    }
