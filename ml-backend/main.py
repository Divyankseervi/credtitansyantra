from classification.land_classifier import classify_land
from change_detection.change_detector import detect_change
from suitability.scoring import calculate_suitability

print("----- LAND CLASSIFICATION -----")
result = classify_land("test.jpg")
print(result)

print("\n----- CHANGE DETECTION -----")
change = detect_change("old.jpg", "new.jpg")
print(change)

print("\n----- SUITABILITY SCORE -----")
score = calculate_suitability("test.jpg")
print(score)

