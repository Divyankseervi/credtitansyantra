import ee

# Initialize Earth Engine
ee.Initialize(project="land-487310")


def create_region(lat, lon, buffer_m=1000):
    """
    Converts latitude & longitude into Earth Engine region.
    """
    point = ee.Geometry.Point([lon, lat])
    region = point.buffer(buffer_m)
    return region


def format_image(image, region):
    """
    Standardizes image visualization settings.
    """
    return image.getThumbURL({
        "region": region,
        "dimensions": 512,
        "min": 0,
        "max": 3000,
    })
