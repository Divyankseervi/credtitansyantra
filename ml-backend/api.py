from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from classification.land_classifier import classify_land
from change_detection.change_detector import detect_change
from suitability.scoring import calculate_suitability
from satellite_data.pipeline import get_land_data

app = FastAPI()

ALLOWED_ORIGINS = {
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:3002",
    "http://127.0.0.1:3002",
    "http://localhost:3003",
    "http://127.0.0.1:3003",
}

TEMP_ALLOW_ALL = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if TEMP_ALLOW_ALL else sorted(ALLOWED_ORIGINS),
    allow_credentials=False if TEMP_ALLOW_ALL else True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_cors_headers(request, call_next):
    if request.method == "OPTIONS":
        response = Response(status_code=204)
    else:
        response = await call_next(request)

    origin = request.headers.get("origin")
    if TEMP_ALLOW_ALL:
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "content-type, authorization"
    elif origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Vary"] = "Origin"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "content-type, authorization"

    return response

class PolygonRequest(BaseModel):
    coordinates: list   # list of lat/lng pairs


def _centroid(coords):
    if not coords:
        return None
    lat_sum = 0.0
    lon_sum = 0.0
    count = 0
    for pair in coords:
        if not isinstance(pair, (list, tuple)) or len(pair) < 2:
            continue
        lat, lon = pair[0], pair[1]
        if isinstance(lat, (int, float)) and isinstance(lon, (int, float)):
            lat_sum += lat
            lon_sum += lon
            count += 1
    if count == 0:
        return None
    return (lat_sum / count, lon_sum / count)


@app.post("/analyze")
def analyze_land(request: PolygonRequest):

    # For now we are not cropping yet
    # Just running on test.jpg

    land = classify_land("test.jpg")
    change = detect_change("old.jpg", "new.jpg")
    suitability = calculate_suitability("test.jpg")

    imagery = {
        "old_image_url": None,
        "new_image_url": None,
        "ndvi_url": None,
    }
    centroid = _centroid(request.coordinates)
    if centroid:
        try:
            land_data = get_land_data(centroid[0], centroid[1])
            imagery = {
                "old_image_url": land_data.get("old_image"),
                "new_image_url": land_data.get("new_image"),
                "ndvi_url": land_data.get("ndvi"),
            }
        except Exception:
            pass

    return {
        "land_classification": land,
        "change_detection": change,
        "suitability": suitability,
        "polygon_received": request.coordinates,
        **imagery,
    }
