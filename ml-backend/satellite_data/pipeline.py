from satellite_data.fetch_images import get_image
from satellite_data.ndvi import get_ndvi
from satellite_data.preprocessing import create_region


def get_land_data(lat, lon):
    """
    Main pipeline function that returns:
    - Old satellite image
    - New satellite image
    - NDVI vegetation map
    """

    # Create region from coordinates
    region = create_region(lat, lon)

    # Fetch images
    old_image_url = get_image(region, "2020-01-01", "2020-12-31")
    new_image_url = get_image(region, "2024-01-01", "2024-12-31")

    # Generate NDVI map
    ndvi_url = get_ndvi(region, "2024-01-01", "2024-12-31")

    return {
        "old_image": old_image_url,
        "new_image": new_image_url,
        "ndvi": ndvi_url,
    }


# Test run
if __name__ == "__main__":
    data = get_land_data(12.9692, 79.1333)

    print("\nOLD IMAGE:", data["old_image"])
    print("\nNEW IMAGE:", data["new_image"])
    print("\nNDVI MAP:", data["ndvi"])
