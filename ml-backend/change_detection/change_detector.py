import cv2
import numpy as np

def detect_change(old_image_path, new_image_path):
    img1 = cv2.imread(old_image_path)
    img2 = cv2.imread(new_image_path)

    diff = cv2.absdiff(img1, img2)
    gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)

    _, thresh = cv2.threshold(gray, 30, 255, cv2.THRESH_BINARY)

    changed_pixels = np.sum(thresh > 0)
    total_pixels = thresh.size
    percent_change = (changed_pixels / total_pixels) * 100

    # Create red overlay for changes
    overlay = img2.copy()
    overlay[thresh > 0] = [0, 0, 255]  # Red color

    cv2.imwrite("change_output.jpg", overlay)

    alert = "No Significant Change"
    if percent_change > 5:
        alert = "Encroachment Alert!"

    return {
        "percent_change": float(round(percent_change, 2)),  
        "status": alert
    }
