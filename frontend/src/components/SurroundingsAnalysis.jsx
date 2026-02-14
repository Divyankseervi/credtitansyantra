import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MapSelector from "./MapSelector";
import { fetchNearbyPOIs, categorizePOIs, getPOISummary } from "../api/overpassService";
import { recommendLandUse, getRiskAssessment, getOptimizationTips } from "../api/surroundingRecommnedation";
import { getGeminiExplanation } from "../api/geminiService";

export default function SurroundingsAnalysis() {
  // Initialize API from config (fixed keys)
  useEffect(() => {
    // API keys are loaded from config.js
    // No need to ask user for API keys
  }, []);

  // Map state
  const [selectedLand, setSelectedLand] = useState(null);
  const [isSatellite, setIsSatellite] = useState(false);
  const [showNDVI, setShowNDVI] = useState(false);

  // Analysis state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [poiCounts, setPoiCounts] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [tips, setTips] = useState([]);
  const [geminiExplanation, setGeminiExplanation] = useState(null);
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [radius, setRadius] = useState(2000); // Default 2km
  const [geminiApiKey, setGeminiApiKey] = useState(''); // Fix: Add missing state

  // Calculate center from polygon
  const getCenterFromPolygon = (polygon) => {
    if (!polygon) return null;
    
    if (polygon.coordinates?.center) {
      return {
        lat: polygon.coordinates.center.lat,
        lng: polygon.coordinates.center.lng,
      };
    }

    if (polygon.bounds) {
      return {
        lat: (polygon.bounds.north + polygon.bounds.south) / 2,
        lng: (polygon.bounds.east + polygon.bounds.west) / 2,
      };
    }

    return null;
  };

  const handleAnalyze = async () => {
    if (!selectedLand) {
      setError("Please select an area on the map first");
      return;
    }

    const center = getCenterFromPolygon(selectedLand);
    if (!center) {
      setError("Could not determine center coordinates");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeminiExplanation(null);
    setShowAdvanced(false);

    try {
      // Step 2: Fetch nearby POIs
      const osmData = await fetchNearbyPOIs(center.lat, center.lng, radius);

      // Step 3: Categorize POIs
      const counts = categorizePOIs(osmData);
      setPoiCounts(counts);

      // Step 4: Get recommendation
      const rec = recommendLandUse(counts);
      setRecommendation(rec);

      // Get risk assessment
      const risk = getRiskAssessment(counts);
      setRiskAssessment(risk);

      // Get optimization tips
      const optimizationTips = getOptimizationTips(counts, rec.recommendedUse);
      setTips(optimizationTips);
    } catch (err) {
      console.error("Error analyzing surroundings:", err);
      setError(err?.message || "Failed to analyze surroundings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadGeminiExplanation = async () => {
    if (!geminiApiKey) {
      const savedKey = localStorage.getItem("gemini_api_key");
      if (!savedKey) {
        alert(
          "Gemini API key not configured. Please add it in Settings to enable AI explanations."
        );
        return;
      }
      setGeminiApiKey(savedKey);
    }

    if (!poiCounts || !recommendation) {
      return;
    }

    setGeminiLoading(true);
    try {
      const explanation = await getGeminiExplanation(
        poiCounts,
        recommendation.recommendedUse,
        geminiApiKey || localStorage.getItem("gemini_api_key")
      );
      setGeminiExplanation(explanation);
    } catch (error) {
      console.error("Error loading Gemini explanations:", error);
      alert("Failed to load AI explanation. Please check your API key.");
    } finally {
      setGeminiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              ← Back
            </Link>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Surroundings-Based Land Use Recommendation
              </h1>
              <p className="text-sm text-gray-500">
                Analyze nearby infrastructure & recommend optimal land use
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Layout: Map + Analysis Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Map */}
          <div className="lg:col-span-2 min-h-[400px] lg:min-h-[600px]">
            <div className="bg-white rounded-lg shadow-card border border-gray-200 overflow-hidden h-full">
              <MapSelector
                selectedLand={selectedLand}
                onLandSelect={setSelectedLand}
                isSatellite={isSatellite}
                onSatelliteToggle={() => setIsSatellite((s) => !s)}
                showNDVI={showNDVI}
                onNDVIToggle={() => setShowNDVI((s) => !s)}
                isAnalyzing={isLoading}
              />
            </div>
          </div>

          {/* Right Column: Analysis Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Input Card */}
            <div className="bg-white rounded-lg shadow-card border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                🌍 Surroundings Analysis
              </h2>

              {/* Radius Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Analysis Radius (meters)
                </label>
                <input
                  type="number"
                  min="500"
                  max="5000"
                  step="100"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value) || 2000)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Default: 2000m (2km)
                </p>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={!selectedLand || isLoading}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition ${
                  !selectedLand || isLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Analyzing...
                  </span>
                ) : (
                  "🔍 Analyze Surroundings"
                )}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">⚠️ {error}</p>
                </div>
              )}

              {selectedLand && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <strong>📍 Selected Area:</strong>
                    <br />
                    {getCenterFromPolygon(selectedLand) && (
                      <>
                        Center: {getCenterFromPolygon(selectedLand).lat.toFixed(4)},{" "}
                        {getCenterFromPolygon(selectedLand).lng.toFixed(4)}
                        <br />
                      </>
                    )}
                    Radius: {radius}m
                  </p>
                </div>
              )}
            </div>

            {/* Results Card */}
            {poiCounts && recommendation && (
              <div className="bg-white rounded-lg shadow-card border border-gray-200 p-6 space-y-4">
                {/* POI Summary */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Nearby Infrastructure</h3>
                  <div className="space-y-2">
                    {getPOISummary(poiCounts).map((summary, idx) => (
                      <div key={idx} className="flex items-center text-gray-700 text-sm">
                        <span className="text-lg mr-2">{summary.split(" ")[0]}</span>
                        <span>{summary.substring(summary.indexOf(" ") + 1)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-semibold text-gray-800 mb-2">Recommended Use</h3>
                  <p className="text-2xl font-bold text-green-700 mb-2">
                    {recommendation.recommendedUse}
                  </p>
                  <p className="text-gray-700 text-sm mb-3">{recommendation.reasoning}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="space-y-1">
                      {recommendation.poiFactors.map((factor, idx) => (
                        <p key={idx} className="text-xs text-gray-600">
                          • {factor}
                        </p>
                      ))}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {recommendation.confidence}%
                      </div>
                      <p className="text-xs text-gray-600">Confidence</p>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                {riskAssessment && (
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border-l-4 border-orange-500">
                    <h3 className="font-semibold text-gray-800 mb-2">Risk Assessment</h3>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-lg font-bold">{riskAssessment.riskLevel}</span>
                      <span className="text-sm text-gray-600">{riskAssessment.riskType}</span>
                    </div>
                    <p className="text-sm text-gray-700">{riskAssessment.mitigation}</p>
                  </div>
                )}

                {/* Optimization Tips */}
                {tips.length > 0 && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3">Development Tips</h3>
                    <ul className="space-y-2">
                      {tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-700">
                          <span className="inline-block mr-2 text-lg">
                            {tip.split(" ")[0]}
                          </span>
                          <span>{tip.substring(tip.indexOf(" ") + 1)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* AI Explanation */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => {
                      if (!showAdvanced && !geminiExplanation) {
                        loadGeminiExplanation();
                      }
                      setShowAdvanced(!showAdvanced);
                    }}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-sm"
                    disabled={geminiLoading}
                  >
                    <span>🤖</span>
                    <span>{showAdvanced ? "Hide" : "Show"} AI Insights</span>
                    {geminiLoading && (
                      <span className="text-xs text-gray-500 ml-2">(Loading...)</span>
                    )}
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {geminiExplanation ? (
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">AI Explanation</h5>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {geminiExplanation}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center text-sm text-gray-500">
                          <p>Gemini API key not configured</p>
                          <p className="text-xs mt-1">
                            Add Gemini API key in config.js to enable AI insights
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Info Card */}
            <div className="bg-green-50 rounded-lg border border-green-200 p-4">
              <p className="text-xs text-green-800">
                <strong>💡 How It Works:</strong>
                <br />
                1. Draw a polygon on the map to select land area
                <br />
                2. Set analysis radius (default: 2km)
                <br />
                3. Click "Analyze Surroundings"
                <br />
                4. Get recommendation based on nearby POIs
                <br />
                <br />
                <strong>🎯 Recommendations:</strong>
                <br />
                • Agricultural: Minimal urban infrastructure
                <br />
                • Residential: Education + housing nearby
                <br />
                • Commercial: Shops + good road access
                <br />
                • Industrial: Factories + logistics
                <br />
                <br />
                <strong>⚙️ Note:</strong> Using fixed API keys from configuration
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
