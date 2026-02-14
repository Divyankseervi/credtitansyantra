import { useState } from 'react';
import { Link } from 'react-router-dom';
import MapSelector from './MapSelector';
import { analyzeSurroundings, getCategoryColor } from '../api/surroundingsService';

export default function SurroundingsAnalysis() {
  const [selectedLand, setSelectedLand] = useState(null);
  const [isSatellite, setIsSatellite] = useState(false);
  const [showNDVI, setShowNDVI] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const getCenterFromPolygon = (polygon) => {
    if (!polygon) return null;
    
    if (polygon.centroid) {
      return { lat: polygon.centroid.lat, lng: polygon.centroid.lon };
    }

    if (polygon.coordinates?.length > 0) {
      const coords = polygon.coordinates;
      const latSum = coords.reduce((sum, c) => sum + c[0], 0);
      const lngSum = coords.reduce((sum, c) => sum + c[1], 0);
      return {
        lat: latSum / coords.length,
        lng: lngSum / coords.length,
      };
    }

    return null;
  };

  const handleAnalyze = async () => {
    if (!selectedLand) {
      setError('Please select an area on the map first');
      return;
    }

    const center = getCenterFromPolygon(selectedLand);
    if (!center) {
      setError('Could not determine center coordinates');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeSurroundings(center.lat, center.lng);
      setResult(data);
    } catch (err) {
      setError(err?.message || 'Failed to analyze surroundings');
    } finally {
      setIsLoading(false);
    }
  };

  const surroundingsData = result?.surroundings;
  const percentages = surroundingsData?.area_profile_percentages || {};
  const diagnostics = surroundingsData?.diagnostics || {};

  return (
    <div className="min-h-screen bg-surface-50 font-sans">
      <header className="bg-white border-b border-surface-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
              ← Back
            </Link>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <span className="text-white text-xl">🌍</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Surroundings Analysis</h1>
              <p className="text-sm text-gray-500">AI-powered land use classification</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 min-h-[500px]">
            <div className="bg-white rounded-xl border border-surface-200 shadow-card overflow-hidden h-full">
              <MapSelector
                selectedLand={selectedLand}
                onLandSelect={setSelectedLand}
                isSatellite={isSatellite}
                onSatelliteToggle={() => setIsSatellite(s => !s)}
                showNDVI={showNDVI}
                onNDVIToggle={() => setShowNDVI(s => !s)}
                isAnalyzing={isLoading}
              />
            </div>
          </div>

          {/* Analysis Panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-surface-200 shadow-card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                🔍 Analyze Surroundings
              </h2>

              {selectedLand && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                  <p className="text-blue-800">
                    <strong>📍 Selected Area</strong><br/>
                    {getCenterFromPolygon(selectedLand) && (
                      <>
                        Lat: {getCenterFromPolygon(selectedLand).lat.toFixed(4)}<br/>
                        Lng: {getCenterFromPolygon(selectedLand).lng.toFixed(4)}<br/>
                      </>
                    )}
                    Radius: 300m
                  </p>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={!selectedLand || isLoading}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  !selectedLand || isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Analyzing...
                  </span>
                ) : (
                  '🔍 Analyze Area'
                )}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">⚠️ {error}</p>
                </div>
              )}
            </div>

            {result && surroundingsData && (
              <div className="bg-white rounded-xl border border-surface-200 shadow-card p-6 space-y-4">
                {/* Dominant Zone */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Dominant Land Use</h3>
                  <p className="text-2xl font-bold text-green-700 mb-2">
                    {surroundingsData.dominant_zone}
                  </p>
                  <p className="text-sm text-gray-600">{surroundingsData.ai_context_summary}</p>
                </div>

                {/* Breakdown */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Area Profile</h3>
                  <div className="space-y-2">
                    {Object.entries(percentages)
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, percent]) => (
                        <div key={category} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getCategoryColor(category) }}
                          />
                          <span className="text-sm text-gray-700 flex-1">{category}</span>
                          <span className="text-sm font-semibold text-gray-900">{percent}%</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Diagnostics */}
                {diagnostics && Object.keys(diagnostics).length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
                    <p className="font-semibold text-gray-800 mb-2">📊 Diagnostics</p>
                    <p className="text-gray-700">
                      Rural Area: {diagnostics.is_rural_deduced ? 'Yes' : 'No'}
                    </p>
                    <p className="text-gray-700">
                      Paved Roads: {diagnostics.paved_roads_found}
                    </p>
                    <p className="text-gray-700">
                      Mapped Structures: {diagnostics.mapped_structures_weight}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Info */}
            <div className="bg-green-50 rounded-lg border border-green-200 p-4 text-sm text-green-800">
              <p className="font-semibold mb-2">💡 How It Works</p>
              <p>
                1. Select area on map<br/>
                2. Click "Analyze Area"<br/>
                3. AI analyzes 300m radius<br/>
                4. Get land use breakdown
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
