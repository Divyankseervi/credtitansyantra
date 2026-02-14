from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import your custom AI and Context services
from services.surroundings_service import analyze_surrounding_land
from services.vision_service import analyze_satellite_image

# 1. CREATE THE APP
app = FastAPI(title="AI Land Analyzer API")

# 2. SETUP CORS (Allows your frontend to talk to this backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. DEFINE DATA MODELS
# This tells FastAPI to expect a JSON body with an 'image_url' string
class ImageRequest(BaseModel):
    image_url: str

# 4. ADD ROUTES
@app.get("/")
def home():
    return {"message": "AI Land Analyzer is running successfully!"}

# --- ENDPOINT 1: OpenStreetMap Context Engine ---
@app.get("/analyze-surroundings")
def get_surroundings(lat: float = Query(...), lon: float = Query(...)):
    """
    Standalone endpoint for your AI Real Estate Context Engine.
    Uses OpenStreetMap to strictly analyze the 300m radius.
    """
    # Fixed 300m radius for highly accurate micro-property scanning
    fixed_radius = 300 
    surroundings_data = analyze_surrounding_land(lat, lon, fixed_radius)
    
    return {
        "coordinates": {"lat": lat, "lon": lon},
        "surroundings": surroundings_data
    }

# --- ENDPOINT 2: Gemini Vision Satellite Analyzer ---
@app.post("/analyze-satellite")
def get_satellite_analysis(request: ImageRequest):
    """
    Takes a Google Earth Engine image URL and uses Gemini Vision AI 
    to visually classify the land.
    """
    vision_data = analyze_satellite_image(request.image_url)
    
    return {
        "status": "success",
        "earth_engine_url_used": request.image_url,
        "ai_vision_analysis": vision_data
    }