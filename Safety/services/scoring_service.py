def calculate_safety_score(police_count: int, hospital_count: int, crime_news_count: int):
    # 1. Base Score
    # Start at 85. A normal place is generally safe until proven otherwise.
    score = 85.0

    # 2. Crime Penalty
    # We penalize 3 points per crime, capped at -60
    score -= min(crime_news_count * 3.0, 60)

    # 3. Infrastructure Bonuses
    score += min(police_count * 4.0, 15)
    score += min(hospital_count * 2.0, 10)

    # 4. Contextual & Village Logic
    if crime_news_count == 0 and police_count == 0 and hospital_count == 0:
        # THE VILLAGE SCENARIO: No crime, but no emergency services.
        # It is peaceful, so we only deduct 5 points for being "remote".
        score -= 5
    else:
        # THE CITY/TOWN SCENARIO: 
        if police_count == 0:
            if crime_news_count > 3:
                # Very bad: Crime is happening, but no police are around to help
                score -= 15
            else:
                # Annoying, but not a crisis
                score -= 5
                
        if hospital_count == 0:
            score -= 5

    # 5. Clamp between 10 and 100
    score = max(10, min(score, 100))

    # 6. Risk Labeling
    if score >= 80:
        risk = "Safe"
    elif score >= 60:
        risk = "Moderate"
    elif score >= 40:
        risk = "Caution"
    else:
        risk = "High Risk"

    return int(score), risk