import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MapSelector from "./MapSelector";
import ConsistencyCheckForm from "./ConsistencyCheckForm";
import ConsistencyResults from "./ConsistencyResults";
import LandVerificationForm from "./LandVerificationForm";
import LandVerificationResults from "./LandVerificationResults";
import { performConsistencyCheck } from "../api/consistencyCheck";
import { performLandVerification } from "../api/landVerificationDetection";
import { fetchWeatherData, analyzeWeatherForLand } from "../api/weatherService";
import { config } from "../config";

export default function VerifyLandUnified() {
  // Initialize API from config (fixed keys)
  useEffect(() => {
    // API keys are now loaded from config.js
    // No need to ask user for API keys
  }, []);
  // Feature mode
  const [mode, setMode] = useState("consistency"); // "consistency" or "verification"

  // Map state
  const [selectedLand, setSelectedLand] = useState(null);
  const [isSatellite, setIsSatellite] = useState(false);
  const [showNDVI, setShowNDVI] = useState(false);
  const [useCoordinates, setUseCoordinates] = useState(false);
  const [manualCoordinates, setManualCoordinates] = useState({ latitude: '', longitude: '' });

  // Results state
  const [consistencyResult, setConsistencyResult] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckConsistency = async (checkData) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await performConsistencyCheck(checkData);
      setConsistencyResult(data);
    } catch (err) {
      setError(err?.message || "Analysis failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyLand = async (verificationData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch real weather data if coordinates available
      let weatherData = verificationData.weatherData;
      if (verificationData.coordinates?.latitude) {
        try {
          const realWeather = await fetchWeatherData(
            verificationData.coordinates.latitude,
            verificationData.coordinates.longitude
          );
          weatherData = {
            temperature: realWeather.temperature || weatherData.temperature,
            humidity: realWeather.humidity || weatherData.humidity,
            rainfall: realWeather.rainfall || weatherData.rainfall,
            soilType: weatherData.soilType,
          };
        } catch (weatherErr) {
          console.warn('Failed to fetch real weather, using form data:', weatherErr);
          // Continue with form data
        }
      }

      const data = await performLandVerification({
        ...verificationData,
        weatherData,
      });
      setVerificationResult(data);
    } catch (err) {
      setError(err?.message || "Verification failed");
      console.error('Land verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              ← Back
            </Link>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Land Verification Suite</h1>
              <p className="text-sm text-gray-500">Record Consistency Check & Ground Truth Analysis</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Feature Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex-wrap">
          <button
            onClick={() => {
              setMode("consistency");
              setConsistencyResult(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              mode === "consistency"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            📋 Record Consistency Check
          </button>
          <button
            onClick={() => {
              setMode("verification");
              setVerificationResult(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              mode === "verification"
                ? "bg-purple-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🌍 Verify Land Ground Truth
          </button>
          <button
            onClick={() => setUseCoordinates(!useCoordinates)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              useCoordinates
                ? "bg-indigo-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            📍 {useCoordinates ? 'Use Map' : 'Use Coordinates'}
          </button>
        </div>

        {/* Coordinate Input Panel */}
        {useCoordinates && (
          <div className="mb-6 p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
            <h3 className="text-sm font-semibold text-indigo-900 mb-3">Enter Coordinates</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-indigo-700 mb-1 block">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={manualCoordinates.latitude}
                  onChange={(e) => setManualCoordinates(prev => ({ ...prev, latitude: e.target.value }))}
                  placeholder="e.g., 13.0827"
                  className="w-full px-3 py-2 border border-indigo-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-indigo-700 mb-1 block">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={manualCoordinates.longitude}
                  onChange={(e) => setManualCoordinates(prev => ({ ...prev, longitude: e.target.value }))}
                  placeholder="e.g., 80.2707"
                  className="w-full px-3 py-2 border border-indigo-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <button
              onClick={() => {
                if (manualCoordinates.latitude && manualCoordinates.longitude) {
                  setSelectedLand({
                    coordinates: [[parseFloat(manualCoordinates.latitude), parseFloat(manualCoordinates.longitude)]],
                    centroid: { lat: parseFloat(manualCoordinates.latitude), lon: parseFloat(manualCoordinates.longitude) }
                  });
                  setError(null);
                } else {
                  setError('Please enter both latitude and longitude');
                }
              }}
              className="mt-3 w-full px-4 py-2 bg-indigo-500 text-white rounded font-medium hover:bg-indigo-600 transition"
            >
              Apply Coordinates
            </button>
            {selectedLand && manualCoordinates.latitude && manualCoordinates.longitude && (
              <p className="text-xs text-indigo-700 mt-2">✓ Location set: {parseFloat(manualCoordinates.latitude).toFixed(4)}°, {parseFloat(manualCoordinates.longitude).toFixed(4)}°</p>
            )}
          </div>
        )}

        {/* Layout: Map + Form + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ gridAutoRows: "600px" }}>
          {/* Left: Map */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-card border border-gray-200 overflow-hidden">
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

          {/* Right Column: Form + Results */}
          <div className="lg:col-span-1 space-y-4 overflow-y-auto">
            {/* Form Card */}
            <div className="bg-white rounded-lg shadow-card border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {mode === "consistency"
                  ? "📋 Document Check"
                  : "🌍 Land Analysis"}
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">⚠️ {error}</p>
                </div>
              )}

              {mode === "consistency" && (
                <>
                  <ConsistencyCheckForm
                    onSubmit={handleCheckConsistency}
                    isLoading={isLoading}
                  />
                  {consistencyResult && !isLoading && (
                    <div className="mt-4 pt-4 border-t">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Results:</h3>
                      <ConsistencyResults result={consistencyResult} isLoading={false} />
                    </div>
                  )}
                </>
              )}

              {mode === "verification" && (
                <>
                  <LandVerificationForm
                    onSubmit={handleVerifyLand}
                    isLoading={isLoading}
                    mapMode={true}
                    selectedLand={selectedLand}
                  />
                  {verificationResult && !isLoading && (
                    <div className="mt-4 pt-4 border-t">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Analysis:</h3>
                      <LandVerificationResults result={verificationResult} isLoading={false} />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <p className="text-xs text-blue-800">
                <strong>💡 Tip:</strong><br />
                1. Draw a polygon on the map or enter coordinates<br />
                2. Fill form details<br />
                3. Click verify or analyze<br /><br />
                <strong>🌐 Features:</strong><br />
                • Record Consistency: Verify against government records<br />
                • Land Verification: Multi-factor ground truth analysis<br /><br />
                <strong>⚙️ Note:</strong> Using fixed API keys from configuration
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
