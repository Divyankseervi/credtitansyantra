import requests

def reverse_geocode(lat: float, lon: float):
    url = "https://nominatim.openstreetmap.org/reverse"

    params = {
        "format": "json",
        "lat": lat,
        "lon": lon,
        "zoom": 14,
        "addressdetails": 1
    }

    headers = {
        "User-Agent": "SafetyIntelligenceAPI/1.0"
    }

    response = requests.get(url, params=params, headers=headers, timeout=10)
    response.raise_for_status()

    data = response.json()
    address = data.get("address", {})

    return {
        "display_name": data.get("display_name"),
        "city": address.get("city") or address.get("town") or address.get("village"),
        "district": address.get("state_district"),
        "state": address.get("state"),
        "country": address.get("country"),
        "postcode": address.get("postcode")
    }
