import requests
from difflib import SequenceMatcher

def similar(a, b):
    """Calculates similarity between two headlines (0.0 to 1.0)."""
    return SequenceMatcher(None, a, b).ratio()

def get_crime_news_count(location_name: str, country_code: str = "IN"):
    """
    Fetches accurate crime news counts by:
    1. Fetching up to 250 articles (API Max).
    2. Filtering by Country (e.g., India only).
    3. Removing duplicate articles about the same event.
    """
    if not location_name:
        return 0

    # 1. Clean the city name
    clean_city = location_name.split(',')[0].strip()

    # 2. Strict Query: 
    # (Crime Keyword) AND (City Name) AND (Source Country)
    query = f'(crime OR robbery OR murder OR assault OR "police arrest" OR rape OR theft) "{clean_city}" sourcecountry:{country_code}'

    url = "https://api.gdeltproject.org/api/v2/doc/doc"

    params = {
        "query": query,
        "mode": "ArtList",
        "format": "json",
        "maxrecords": 250,   # <--- FIXED: Increased from 50 to 250
        "timespan": "3m",    # Look at last 3 months for a better safety sample
        "sort": "datedesc"
    }

    try:
        headers = {"User-Agent": "SafetyIntelligenceAPI/2.0"}
        response = requests.get(url, params=params, headers=headers, timeout=15)
        
        if response.status_code != 200:
            return 0

        data = response.json()
        articles = data.get("articles", [])

        # 3. Deduplication Logic (The "Accuracy" Fix)
        unique_events = []
        seen_titles = []

        for article in articles:
            title = article.get("title", "").lower()
            
            # Skip if title is too similar (>60%) to one we already counted
            is_duplicate = False
            for seen in seen_titles:
                if similar(title, seen) > 0.6: 
                    is_duplicate = True
                    break
            
            if not is_duplicate:
                unique_events.append(article)
                seen_titles.append(title)

        # Debug print to verify it's working in your terminal
        print(f"DEBUG: {clean_city} -> Fetched {len(articles)} articles, found {len(unique_events)} unique events.")
        
        return len(unique_events)

    except Exception as e:
        print(f"NEWS ERROR: {e}")
        return 0