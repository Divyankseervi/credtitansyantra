import requests

OVERPASS_URLS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter"
]

def analyze_surrounding_land(lat: float, lon: float, radius: int = 300):
    query = f"""
    [out:json][timeout:25];
    (
      way["landuse"](around:{radius},{lat},{lon});
      relation["landuse"](around:{radius},{lat},{lon});
      way["natural"](around:{radius},{lat},{lon});
      relation["natural"](around:{radius},{lat},{lon});
      way["building"](around:{radius},{lat},{lon});
      way["highway"](around:{radius},{lat},{lon});
    );
    out tags;
    """
    
    for url in OVERPASS_URLS:
        try:
            response = requests.post(url, data={"data": query}, timeout=15)
            if response.status_code != 200:
                continue

            elements = response.json().get("elements", [])
            
            categories = {
                "Agriculture": ["farmland", "farmyard", "orchard", "vineyard", "meadow", "greenhouse"],
                "Residential": ["residential", "apartments", "house", "detached"],
                "Commercial & Retail": ["commercial", "retail", "supermarket", "mall"],
                "Industrial": ["industrial", "warehouse", "manufacturing", "brownfield", "construction"],
                "Nature & Parks": ["forest", "wood", "nature_reserve", "park", "water", "grass", "scrub"],
                "Institutional": ["institutional", "education", "school", "hospital", "religious", "university"]
            }
            
            scores = {key: 0.0 for key in categories.keys()}
            scores["Mixed / Other"] = 0.0
            
            total_points = 0.0
            road_count = 0
            
            for el in elements:
                tags = el.get("tags", {})
                
                if "highway" in tags:
                    if tags["highway"] not in ["track", "path", "footway"]:
                        road_count += 1
                    continue

                land_type = tags.get("landuse") or tags.get("natural")
                building_type = tags.get("building")
                
                feature_weight = 0.0
                primary_tag = ""

                if land_type:
                    feature_weight = 10.0  
                    primary_tag = land_type.lower()
                elif building_type:
                    feature_weight = 1.0   
                    primary_tag = building_type.lower() if building_type != "yes" else "residential"
                
                if not primary_tag or feature_weight == 0:
                    continue
                    
                total_points += feature_weight
                matched = False
                
                for category, keywords in categories.items():
                    if any(kw in primary_tag for kw in keywords):
                        scores[category] += feature_weight
                        matched = True
                        break
                
                if not matched:
                    scores["Mixed / Other"] += feature_weight

            is_rural = False
            missing_space = 0.0
            
            if total_points < 30 and road_count < 15:
                is_rural = True
                missing_space = 100.0 - total_points
                if missing_space > 0:
                    scores["Agriculture"] += (missing_space * 0.85)
                    scores["Nature & Parks"] += (missing_space * 0.15)
                    total_points += missing_space
                    
            elif total_points < 30 and road_count >= 15:
                missing_space = 100.0 - total_points
                if missing_space > 0:
                    scores["Residential"] += (missing_space * 0.80)
                    scores["Commercial & Retail"] += (missing_space * 0.20)
                    total_points += missing_space

            if total_points == 0:
                return {"error": "No data found in this area"}

            percentages = {}
            for category, score in scores.items():
                pct = (score / total_points) * 100
                percentages[category] = round(pct, 1)
                
            dominant_category = max(percentages, key=percentages.get)
            original_weight = total_points - missing_space
            
            return {
                "radius_meters": radius,
                "dominant_zone": dominant_category,
                "ai_context_summary": f"Context: {percentages[dominant_category]}% {dominant_category} environment.",
                "area_profile_percentages": percentages,
                "diagnostics": {
                    "is_rural_deduced": is_rural,
                    "paved_roads_found": road_count,
                    "mapped_structures_weight": round(original_weight, 1)
                }
            }

        except Exception as e:
            print(f"Surroundings Analyzer Error: {e}")
            continue

    return {"error": "Failed to fetch surroundings data"}
