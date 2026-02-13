import cv2
import numpy as np

def calculate_ndvi_like(image_path):
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Split channels
    r = img[:, :, 0].astype(float)
    g = img[:, :, 1].astype(float)
    b = img[:, :, 2].astype(float)

    # NDVI-like index (since no NIR band)
    vegetation_index = np.mean(g / (r + b + 1e-5))

    return vegetation_index


def calculate_suitability(image_path, rainfall=0.7, soil_quality=0.6):

    ndvi_like = calculate_ndvi_like(image_path)

    score = (
        ndvi_like * 0.5 +
        rainfall * 0.3 +
        soil_quality * 0.2
    )

    return {
    "ndvi_like": float(round(ndvi_like, 2)),
    "suitability_score": float(round(score * 100, 2))
}

