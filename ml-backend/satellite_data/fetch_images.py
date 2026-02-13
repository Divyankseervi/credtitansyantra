import ee

ee.Initialize(project="land-487310")

def get_image(region, start_date, end_date):
    collection = (
        ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
        .filterBounds(region)
        .filterDate(start_date, end_date)
        .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
        .sort("CLOUDY_PIXEL_PERCENTAGE")
    )

    image = collection.first().select(["B4", "B3", "B2"])

    url = image.getThumbURL({
        "region": region,
        "dimensions": 512,
        "min": 0,
        "max": 3000,
    })

    return url
