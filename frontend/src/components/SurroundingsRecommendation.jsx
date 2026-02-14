import React, { useState, useEffect } from "react";
import { fetchNearbyPOIs, categorizePOIs, getPOISummary } from "../api/overpassService";
import {
  recommendLandUse,
  getRiskAssessment,
  getOptimizationTips,
} from "../api/surroundingsRecommendation";
import {
  getGeminiExplanation,
  getGeminiRiskMitigation,
  getGeminiTimeline,
} from "../api/geminiService";

const SurroundingsRecommendation = ({ coordinates, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [poiCounts, setPoiCounts] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [tips, setTips] = useState([]);
  const [geminiExplanation, setGeminiExplanation] = useState(null);
  const [geminiMitigation, setGeminiMitigation] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [geminiLoading, setGeminiLoading] = useState(false);

  useEffect(() => {
    if (coordinates) {
      analyzeSurroundings();
    }
  }, [coordinates]);

  const analyzeSurroundings = async () => {
    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      alert("Invalid coordinates. Please select an area on the map.");
      return;
    }

    setLoading(true);
    try {
      // Fetch POIs from Overpass API
      const osmData = await fetchNearbyPOIs(coordinates.lat, coordinates.lng, 2000);

      // Categorize POIs
      const counts = categorizePOIs(osmData);
      setPoiCounts(counts);

      // Get recommendation
      const rec = recommendLandUse(counts);
      setRecommendation(rec);

      // Get risk assessment
      const risk = getRiskAssessment(counts);
      setRiskAssessment(risk);

      // Get optimization tips
      const optimizationTips = getOptimizationTips(counts, rec.recommendedUse);
      setTips(optimizationTips);
    } catch (error) {
      console.error("Error analyzing surroundings:", error);
      alert("Error analyzing surroundings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadGeminiExplanation = async () => {
    const apiKey = localStorage.getItem("geminiApiKey");
    if (!apiKey) {
      alert(
        "Gemini API key not configured. Please add it in Settings to enable AI explanations."
      );
      return;
    }

    setGeminiLoading(true);
    try {
      const explanation = await getGeminiExplanation(
        poiCounts,
        recommendation.recommendedUse,
        apiKey
      );
      setGeminiExplanation(explanation);

      const mitigation = await getGeminiRiskMitigation(
        poiCounts,
        riskAssessment.riskLevel,
        apiKey
      );
      setGeminiMitigation(mitigation);
    } catch (error) {
      console.error("Error loading Gemini explanations:", error);
    } finally {
      setGeminiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing nearby surroundings...</p>
          <p className="text-sm text-gray-400 mt-2">
            Fetching POI data from OpenStreetMap
          </p>
        </div>
      </div>
    );
  }

  if (!poiCounts || !recommendation) {
    return (
      <div className="p-6 bg-white rounded-lg shadow text-center">
        <p className="text-gray-600">
          Select an area on the map to analyze surroundings
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              🌍 Surroundings Analysis
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Location: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* POI Summary */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">Nearby Infrastructure</h4>
        <div className="space-y-2">
          {getPOISummary(poiCounts).map((summary, idx) => (
            <div key={idx} className="flex items-center text-gray-700">
              <span className="text-lg mr-2">{summary.split(" ")[0]}</span>
              <span>{summary.substring(summary.indexOf(" ") + 1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation Card */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-l-4 border-green-500">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Recommended Use</h4>
            <p className="text-2xl font-bold text-green-700 mb-2">
              {recommendation.recommendedUse}
            </p>
            <p className="text-gray-700 text-sm mb-3">
              {recommendation.reasoning}
            </p>
            <div className="space-y-1">
              {recommendation.poiFactors.map((factor, idx) => (
                <p key={idx} className="text-xs text-gray-600">
                  • {factor}
                </p>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {recommendation.confidence}%
            </div>
            <p className="text-xs text-gray-600">Confidence</p>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border-l-4 border-orange-500">
        <h4 className="font-semibold text-gray-800 mb-2">Risk Assessment</h4>
        <div className="flex items-start justify-between mb-2">
          <span className="text-lg font-bold">{riskAssessment.riskLevel}</span>
          <span className="text-sm text-gray-600">{riskAssessment.riskType}</span>
        </div>
        <p className="text-sm text-gray-700">
          {riskAssessment.mitigation}
        </p>
      </div>

      {/* Optimization Tips */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">Development Tips</h4>
        <ul className="space-y-2">
          {tips.map((tip, idx) => (
            <li key={idx} className="flex items-start text-sm text-gray-700">
              <span className="inline-block mr-2 text-lg">{tip.split(" ")[0]}</span>
              <span>{tip.substring(tip.indexOf(" ") + 1)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Advanced AI Section */}
      <div className="border-t pt-4">
        <button
          onClick={() => {
            if (!showAdvanced && !geminiExplanation) {
              loadGeminiExplanation();
            }
            setShowAdvanced(!showAdvanced);
          }}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
        >
          <span>🤖</span>
          <span>
            {showAdvanced ? "Hide" : "Show"} AI Insights
          </span>
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
                  Add Gemini API key in Settings to enable AI insights
                </p>
              </div>
            )}

            {geminiMitigation && (
              <div className="border-t pt-4">
                <h5 className="font-semibold text-gray-800 mb-2">
                  Risk Mitigation Strategies
                </h5>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {geminiMitigation}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t">
        <button
          onClick={analyzeSurroundings}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          Re-analyze
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default SurroundingsRecommendation;
