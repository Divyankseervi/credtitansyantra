import requests
import math

OVERPASS_URLS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.nchc.org.tw/api/interpreter"
]

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculates distance between two points in meters.
    Used to detect if two 'places' are actually the same building.
    """
    R = 6371000  # Earth radius in meters
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi / 2)**2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c

def get_place_tags(place_type: str):
    """
    Returns Overpass API tags for different place types.
    """
    tag_map = {
        "hospital": [
            '["amenity"="hospital"]',
            '["healthcare"="hospital"]',
            '["amenity"="clinic"]',
            '["healthcare"="clinic"]'
        ],
        "police": [
            '["amenity"="police"]',
            '["government"="public_safety"]'
        ],
        "fire_station": [
            '["amenity"="fire_station"]',
            '["emergency"="fire_station"]'
        ],
        "school": [
            '["amenity"="school"]',
            '["amenity"="university"]',
            '["amenity"="college"]',
            '["amenity"="kindergarten"]'
        ],
        "bank": [
            '["amenity"="bank"]',
            '["amenity"="atm"]'
        ],
        "atm": [
            '["amenity"="atm"]'
        ],
        "pharmacy": [
            '["amenity"="pharmacy"]',
            '["healthcare"="pharmacy"]'
        ],
        "restaurant": [
            '["amenity"="restaurant"]',
            '["amenity"="cafe"]',
            '["amenity"="fast_food"]'
        ],
        "fuel": [
            '["amenity"="fuel"]'
        ],
        "marketplace": [
            '["amenity"="marketplace"]',
            '["amenity"="supermarket"]'
        ]
    }
    return tag_map.get(place_type, [f'["amenity"="{place_type}"]'])

def get_nearby_places(lat: float, lon: float, place_type: str, radius: int = 1500):
    """
    Gets detailed information about nearby places within a radius.
    Returns a list of places with name, coordinates, and distance.
    Deduplicates results that are within 50 meters of each other.
    """
    tags = get_place_tags(place_type)
    
    # Build the query parts dynamically
    query_parts = ""
    for tag in tags:
        query_parts += f"""
        node{tag}(around:{radius},{lat},{lon});
        way{tag}(around:{radius},{lat},{lon});
        relation{tag}(around:{radius},{lat},{lon});
        """

    full_query = f"""
    [out:json][timeout:25];
    (
      {query_parts}
    );
    out center meta;
    """

    for url in OVERPASS_URLS:
        try:
            response = requests.post(url, data={"data": full_query}, timeout=30)
            if response.status_code != 200:
                continue

            data = response.json()
            elements = data.get("elements", [])

            # Process and deduplicate places
            unique_places = []
            
            for element in elements:
                # Get coordinates - handle both node (direct lat/lon) and way/relation (center dict)
                el_lat = element.get("lat")
                el_lon = element.get("lon")
                
                # If not direct coordinates, try center dict
                if el_lat is None or el_lon is None:
                    center = element.get("center")
                    if isinstance(center, dict):
                        el_lat = center.get("lat")
                        el_lon = center.get("lon")
                
                if el_lat is None or el_lon is None:
                    continue

                # Get name from tags
                tags_data = element.get("tags", {})
                name = tags_data.get("name") or tags_data.get("operator") or "Unnamed"
                
                # Calculate distance from center
                distance = haversine_distance(lat, lon, el_lat, el_lon)

                # Check if this point is too close to an existing unique place
                is_duplicate = False
                for existing_place in unique_places:
                    if haversine_distance(el_lat, el_lon, existing_place["lat"], existing_place["lon"]) < 50:
                        is_duplicate = True
                        break
                
                if not is_duplicate:
                    unique_places.append({
                        "name": name,
                        "lat": el_lat,
                        "lon": el_lon,
                        "distance": round(distance, 0),  # Distance in meters
                        "type": place_type,
                        "address": tags_data.get("addr:full") or tags_data.get("addr:street", "")
                    })

            # Sort by distance
            unique_places.sort(key=lambda x: x["distance"])
            return unique_places

        except Exception as e:
            print(f"Overpass Error for {place_type}: {e}")
            continue

    return []

def count_nearby_places(lat: float, lon: float, place_type: str, radius: int = 1500):
    """
    Counts unique places within a radius.
    Deduplicates results that are within 50 meters of each other.
    (Kept for backward compatibility)
    """
    places = get_nearby_places(lat, lon, place_type, radius)
    return len(places)