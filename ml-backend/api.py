from fastapi import FastAPI
from pydantic import BaseModel
from classification.land_classifier import classify_land
from change_detection.change_detector import detect_change
from suitability.scoring import calculate_suitability

app = FastAPI()

class PolygonRequest(BaseModel):
    coordinates: list   # list of lat/lng pairs


@app.post("/analyze")
def analyze_land(request: PolygonRequest):

    # For now we are not cropping yet
    # Just running on test.jpg

    land = classify_land("test.jpg")
    change = detect_change("old.jpg", "new.jpg")
    suitability = calculate_suitability("test.jpg")

    return {
        "land_classification": land,
        "change_detection": change,
        "suitability": suitability,
        "polygon_received": request.coordinates
    }
