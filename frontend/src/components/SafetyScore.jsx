import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MapSelector from "./MapSelector";
import { fetchSafetyScore, getSafetyBadgeStyle } from "../api/safetyService";

export default function SafetyScore() {
  // Map state
  const [selectedLand, setSelectedLand] = useState(null);
  const [isSatellite, setIsSatellite] = useState(false);
  const [showNDVI, setShowNDVI] = useState(false);

  // Safety data state
  const [safetyData, setSafetyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!selectedLand) {
      setError("Please select an area on the map first");
      return;
    }

    // Get center coordinates
    let centerLat, centerLon;
    
    if (selectedLand.coordinates?.center) {
      centerLat = selectedLand.coordinates.center.lat;
      centerLon = selectedLand.coordinates.center.lng;
    } else if (selectedLand.bounds) {
      centerLat = (selectedLand.bounds.north + selectedLand.bounds.south) / 2;
      centerLon = (selectedLand.bounds.east + selectedLand.bounds.west) / 2;
    } else {
      setError("Could not determine center coordinates");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSafetyData(null);

    try {
      const data = await fetchSafetyScore(centerLat, centerLon);
      setSafetyData(data);
    } catch (err) {
      console.error("Error fetching safety score:", err);
      setError(err?.message || "Failed to fetch safety score. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              ← Back
            </Link>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Safety Score Analysis
              </h1>
              <p className="text-sm text-gray-500">
                Analyze location safety based on infrastructure & crime data
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
                🛡️ Safety Analysis
              </h2>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={!selectedLand || isLoading}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition ${
                  !selectedLand || isLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Analyzing...
                  </span>
                ) : (
                  "🔍 Analyze Safety"
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
                    {selectedLand.coordinates?.center && (
                      <>
                        {selectedLand.coordinates.center.lat.toFixed(4)},{" "}
                        {selectedLand.coordinates.center.lng.toFixed(4)}
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Results Card */}
            {safetyData && (
              <div className="bg-white rounded-lg shadow-card border border-gray-200 p-6 space-y-4">
                {/* Location Info */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Location</h3>
                  <p className="text-sm text-gray-700">
                    {safetyData.location?.display_name || "Unknown location"}
                  </p>
                  {safetyData.location?.city && (
                    <p className="text-xs text-gray-600 mt-1">
                      {safetyData.location.city}
                      {safetyData.location.state && `, ${safetyData.location.state}`}
                    </p>
                  )}
                </div>

                {/* Safety Score */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border-l-4 border-red-500">
                  <h3 className="font-semibold text-gray-800 mb-2">Safety Score</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-4xl font-bold text-gray-900">
                      {safetyData.safetyScore}
                      <span className="text-lg text-gray-500">/100</span>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold border ${getSafetyBadgeStyle(
                        safetyData.riskLevel
                      )}`}
                    >
                      {safetyData.riskLevel}
                    </div>
                  </div>
                </div>

                {/* Infrastructure Metrics */}
                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🚓</span>
                        <span className="text-sm font-medium text-gray-700">
                          Police Stations
                        </span>
                      </div>
                      <span className="text-lg font-bold text-green-700">
                        {safetyData.policeStations}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Within 1.5km radius
                    </p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🏥</span>
                        <span className="text-sm font-medium text-gray-700">
                          Hospitals
                        </span>
                      </div>
                      <span className="text-lg font-bold text-blue-700">
                        {safetyData.hospitals}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Within 1.5km radius
                    </p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📰</span>
                        <span className="text-sm font-medium text-gray-700">
                          Crime News
                        </span>
                      </div>
                      <span className="text-lg font-bold text-orange-700">
                        {safetyData.crimeNewsCount}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Last 3 months
                    </p>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                    Score Breakdown
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Score</span>
                      <span className="font-medium">85</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Crime Penalty</span>
                      <span className="font-medium text-red-600">
                        -{Math.min(safetyData.crimeNewsCount * 3, 60)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Police Bonus</span>
                      <span className="font-medium text-green-600">
                        +{Math.min(safetyData.policeStations * 4, 15)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hospital Bonus</span>
                      <span className="font-medium text-blue-600">
                        +{Math.min(safetyData.hospitals * 2, 10)}
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                      <span>Final Score</span>
                      <span>{safetyData.safetyScore}/100</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Info Card */}
            <div className="bg-red-50 rounded-lg border border-red-200 p-4">
              <p className="text-xs text-red-800">
                <strong>💡 How It Works:</strong>
                <br />
                1. Draw a polygon on the map to select location
                <br />
                2. Click "Analyze Safety"
                <br />
                3. Get safety score based on:
                <br />
                • Police stations nearby
                <br />
                • Hospitals nearby
                <br />
                • Recent crime news
                <br />
                <br />
                <strong>📊 Score Range:</strong>
                <br />
                • 80-100: Safe
                <br />
                • 60-79: Moderate
                <br />
                • 40-59: Caution
                <br />
                • 10-39: High Risk
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
