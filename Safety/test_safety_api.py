"""
Test script for Safety API
Run this to test if the API is working correctly
"""
import sys
import json

# Test coordinates (Mumbai, India)
TEST_LAT = 19.0760
TEST_LON = 72.8777

def test_imports():
    """Test if all imports work"""
    print("Testing imports...")
    try:
        from services.geocode_service import reverse_geocode
        from services.places_service import get_nearby_places, count_nearby_places
        from services.news_service import get_crime_news_count
        from services.scoring_service import calculate_safety_score
        print("✓ All imports successful")
        return True
    except Exception as e:
        print(f"✗ Import error: {e}")
        return False

def test_geocode():
    """Test geocoding service"""
    print("\nTesting geocoding...")
    try:
        from services.geocode_service import reverse_geocode
        location = reverse_geocode(TEST_LAT, TEST_LON)
        print(f"✓ Geocoding successful: {location.get('city', 'Unknown')}")
        return True
    except Exception as e:
        print(f"✗ Geocoding error: {e}")
        return False

def test_places():
    """Test places service"""
    print("\nTesting places service...")
    try:
        from services.places_service import get_nearby_places
        # Test with a small radius for faster testing
        places = get_nearby_places(TEST_LAT, TEST_LON, "police", radius=1000)
        print(f"✓ Places service working: Found {len(places)} police stations")
        if places:
            print(f"  Example: {places[0].get('name', 'Unknown')} ({places[0].get('distance', 0)}m away)")
        return True
    except Exception as e:
        print(f"✗ Places service error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_full_flow():
    """Test the full safety check flow"""
    print("\nTesting full safety check flow...")
    try:
        from services.geocode_service import reverse_geocode
        from services.places_service import get_nearby_places
        from services.news_service import get_crime_news_count
        from services.scoring_service import calculate_safety_score
        
        # 1. Geocode
        location = reverse_geocode(TEST_LAT, TEST_LON)
        city = location.get("city") or ""
        state = location.get("state") or ""
        location_query = f"{city} {state} India".strip()
        
        # 2. Get places
        police_stations = get_nearby_places(TEST_LAT, TEST_LON, "police", radius=1500)
        hospitals = get_nearby_places(TEST_LAT, TEST_LON, "hospital", radius=1500)
        
        # 3. Get crime news
        crime_news_count = get_crime_news_count(location_query)
        
        # 4. Calculate score
        score, risk = calculate_safety_score(len(police_stations), len(hospitals), crime_news_count)
        
        print(f"✓ Full flow successful!")
        print(f"  Location: {location.get('display_name', 'Unknown')[:50]}")
        print(f"  Police Stations: {len(police_stations)}")
        print(f"  Hospitals: {len(hospitals)}")
        print(f"  Crime News: {crime_news_count}")
        print(f"  Safety Score: {score}/100 ({risk})")
        
        return True
    except Exception as e:
        print(f"✗ Full flow error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("Safety API Test Suite")
    print("=" * 50)
    
    results = []
    results.append(("Imports", test_imports()))
    results.append(("Geocoding", test_geocode()))
    results.append(("Places Service", test_places()))
    results.append(("Full Flow", test_full_flow()))
    
    print("\n" + "=" * 50)
    print("Test Results Summary")
    print("=" * 50)
    for test_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{test_name}: {status}")
    
    all_passed = all(result for _, result in results)
    if all_passed:
        print("\n🎉 All tests passed! The Safety API should work correctly.")
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")
    
    sys.exit(0 if all_passed else 1)
