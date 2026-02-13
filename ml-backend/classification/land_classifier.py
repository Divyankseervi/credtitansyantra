import cv2
import numpy as np

def classify_land(image_path):
    img = cv2.imread(image_path)

    # Convert to RGB
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Calculate average color
    avg_color = np.mean(img, axis=(0, 1))
    r, g, b = avg_color

    # Simple rule-based classification
    if g > r and g > b:
        land_type = "Agriculture / Forest"
    elif b > r and b > g:
        land_type = "Water"
    elif r > 120 and g > 120 and b > 120:
        land_type = "Urban"
    else:
        land_type = "Barren Land"

    return {
        "average_rgb": avg_color.tolist(),
        "land_type": land_type
    }
