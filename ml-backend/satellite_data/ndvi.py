import ee

# Initialize Earth Engine
ee.Initialize(project="land-487310")

# Define region (same coordinates)
point = ee.Geometry.Point([79.1333, 12.9692])
region = point.buffer(1000)


def get_ndvi(region, start_date, end_date):
    collection = (
        ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
        .filterBounds(region)
        .filterDate(start_date, end_date)
        .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
        .sort("CLOUDY_PIXEL_PERCENTAGE")
    )

    image = collection.first()

    # Calculate NDVI
    ndvi = image.normalizedDifference(["B8", "B4"])

    # Generate NDVI visualization URL
    url = ndvi.getThumbURL({
        "region": region,
        "dimensions": 512,
        "min": -1,
        "max": 1,
        "palette": ["red", "yellow", "green"]
    })

    return url


# Test run
if __name__ == "__main__":
    ndvi_url = get_ndvi("2024-01-01", "2024-12-31")
    print("\nNDVI MAP URL:")
    print(ndvi_url)
