import { useState } from "react";
import { Link } from "react-router-dom";
import LandVerificationForm from "./LandVerificationForm";
import LandVerificationResults from "./LandVerificationResults";
import { performLandVerification } from "../api/landVerificationDetection";

export default function LandVerification() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputMode, setInputMode] = useState("manual");

  const handleVerifyLand = async (verificationData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await performLandVerification(verificationData);
      setResult(result);
    } catch (err) {
      setError(err?.message || "Analysis failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              ← Back
            </Link>
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Land Verification & Truth Check
              </h1>
              <p className="text-sm text-gray-500">
                Verify what land is vs what you're told
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-card border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">📍</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Location</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Coordinates or polygon area
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-card border border-purple-100">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🗣️</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Declared</h3>
                <p className="text-xs text-gray-500 mt-1">
                  What you're told it is
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-card border border-green-100">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🌍</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Reality</h3>
                <p className="text-xs text-gray-500 mt-1">
                  What it actually is
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Input Mode Tabs */}
        <div className="bg-white rounded-lg shadow-card border border-gray-200 p-6 mb-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setInputMode("manual")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                inputMode === "manual"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📍 Manual Coordinates
            </button>
            <button
              onClick={() => setInputMode("polygon")}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                inputMode === "polygon"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🗺️ Draw Polygon
            </button>
          </div>

          {inputMode === "manual" ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-700 text-sm">Enter Land Details</h3>
              <LandVerificationForm
                onSubmit={handleVerifyLand}
                isLoading={isLoading}
                mapMode={false}
              />
            </div>
          ) : (
            <div className="space-y-4 text-center py-20 text-gray-500">
              <p className="text-lg">🗺️ Map Drawing Feature</p>
              <p className="text-sm">
                Map integration will use the existing MapSelector component
              </p>
              <p className="text-xs">
                For now, use "Manual Coordinates" mode or use the main Dashboard with maps
              </p>
              <button
                onClick={() => setInputMode("manual")}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
              >
                Switch to Manual Coordinates
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-card border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Analysis Results
          </h2>

          {result || isLoading ? (
            <LandVerificationResults result={result} isLoading={isLoading} />
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <p className="text-gray-600 font-medium text-lg">
                Ready to verify land
              </p>
              <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
                Enter your land details above and our AI will analyze NDVI, weather,
                vegetation, soil fertility, and building density to determine what the
                land actually is vs what you're told it is.
              </p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <span>📊</span> How It Works
            </h3>
            <ul className="text-sm text-green-800 space-y-2">
              <li className="flex gap-2">
                <span>1.</span>
                <span>Enter location coordinates or draw a polygon</span>
              </li>
              <li className="flex gap-2">
                <span>2.</span>
                <span>State what land type you're told it is</span>
              </li>
              <li className="flex gap-2">
                <span>3.</span>
                <span>Provide NDVI and weather data (or use defaults)</span>
              </li>
              <li className="flex gap-2">
                <span>4.</span>
                <span>AI analyzes and shows actual land characteristics</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span>🔬</span> What We Analyze
            </h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>🌱 <strong>Vegetation density</strong> (NDVI based)</li>
              <li>💧 <strong>Moisture levels</strong> (Humidity + Rainfall)</li>
              <li>🏢 <strong>Building density</strong> (Urban vs rural)</li>
              <li>🌍 <strong>Soil fertility</strong> (Agricultural potential)</li>
              <li>🌡️ <strong>Climate classification</strong> (Tropical to Arid)</li>
              <li>📅 <strong>Seasonal effects</strong> (Growth cycles)</li>
            </ul>
          </div>
        </div>

        {/* API Integration Note */}
        <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-900">
            <strong>💡 Optional API Integration:</strong> To get real-time satellite NDVI,
            weather data, and other metrics automatically, connect APIs for:
            <br />
            • Sentinel-2 or Landsat (satellite imagery & NDVI)
            • OpenWeatherMap or WeatherAPI (real-time weather)
            • Google Earth Engine API (advanced vegetation analysis)
            <br />
            Provide your API keys and we can integrate them for live data fetching.
          </p>
        </div>
      </main>
    </div>
  );
}
