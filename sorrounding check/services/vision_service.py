import requests
import json
from io import BytesIO
from PIL import Image
import google.generativeai as genai

# 1. Put your free Gemini API Key here
GEMINI_API_KEY = "AIzaSyB3d850yvZDQ8-Ep7VBAD0t6_idmaeIqM4"

genai.configure(api_key=GEMINI_API_KEY)

def analyze_satellite_image(image_url: str):
    try:
        # 1. Download the Earth Engine image
        response = requests.get(image_url, timeout=15)
        
        if response.status_code != 200:
            return {"error": f"Failed to download image. Status code: {response.status_code}"}
            
        img = Image.open(BytesIO(response.content))

        # 2. Initialize Gemini Model (Using standard 1.5-flash as it's highly available)
        model = genai.GenerativeModel('gemini-2.5-flash')

        # 3. The STRICT AI Prompt
        prompt = """
        You are an expert satellite imagery analyst. Look at this satellite map image.
        Estimate the percentage of land cover.
        
        CRITICAL INSTRUCTION: You MUST use numbers from 0 to 100 for percentages. 
        Do NOT use decimals between 0.0 and 1.0. For example, use 85.0, not 0.85.
        
        Return ONLY a raw JSON object with no markdown formatting. Format strictly like this:
        {
            "dominant_zone": "Name of highest percentage zone",
            "confidence_score_out_of_100": 95,
            "visual_percentages": {
                "Agriculture": 0.0,
                "Residential": 0.0,
                "Industrial_Commercial": 0.0,
                "Nature": 0.0
            },
            "visual_evidence": "1 short sentence explaining what physical features you saw."
        }
        """

        # 4. Process the image using AI
        ai_response = model.generate_content([prompt, img])
        
        # 5. Parse the JSON safely
        raw_text = ai_response.text.strip().replace("```json", "").replace("```", "")
        result_json = json.loads(raw_text)
        
        # ==========================================
        # THE MATH FIX: Intercept and format to 100%
        # ==========================================
        # Fix the confidence score if it returned 0.95 instead of 95
        conf = result_json.get("confidence_score_out_of_100", 100)
        if conf <= 1.0:
            result_json["confidence_score_out_of_100"] = int(conf * 100)

        # Fix the visual percentages if they add up to 1.0 instead of 100.0
        if "visual_percentages" in result_json:
            pcts = result_json["visual_percentages"]
            total_sum = sum(pcts.values())
            
            # If the AI used the 0.0 to 1.0 scale
            if 0 < total_sum <= 1.1:
                for key in pcts:
                    pcts[key] = round(pcts[key] * 100, 1)
            else:
                # Just round them cleanly to 1 decimal place if they are already out of 100
                for key in pcts:
                    pcts[key] = round(pcts[key], 1)
        # ==========================================
        
        return result_json

    except Exception as e:
        print(f"Vision AI Error: {e}")
        return {"error": str(e)}