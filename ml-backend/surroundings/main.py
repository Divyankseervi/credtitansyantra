from fastapi import APIRouter, Query

router = APIRouter()

@router.get("/surroundings")
def analyze_surroundings(lat: float = Query(...), lon: float = Query(...)):
    """
    Analyzes surrounding land within 300m radius using OpenStreetMap data.
    Returns dominant zone and percentage breakdown.
    """
    from .service import analyze_surrounding_land
    
    fixed_radius = 300
    surroundings_data = analyze_surrounding_land(lat, lon, fixed_radius)
    
    return {
        "coordinates": {"lat": lat, "lon": lon},
        "surroundings": surroundings_data
    }
