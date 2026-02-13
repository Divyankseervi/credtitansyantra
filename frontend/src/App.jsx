import { useState } from 'react';
import MapSelector from './components/MapSelector';
import InsightsPanel from './components/InsightsPanel';
import AnalyzeButton from './components/AnalyzeButton';
import { analyzeLand } from './api';

export default function App() {
  const [selectedLand, setSelectedLand] = useState(null);
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isSatellite, setIsSatellite] = useState(false);
  const [showNDVI, setShowNDVI] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedLand?.centroid) return;
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const data = await analyzeLand(selectedLand.centroid.lat, selectedLand.centroid.lon);
      setInsights(data);
      setIsSuccess(true);
    } catch (err) {
      setError(err?.message || err?.response?.data?.message || 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 font-sans">
      <header className="bg-white border-b border-surface-200 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
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
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-surface-900">Land Intelligence</h1>
              <p className="text-sm text-surface-500">AI-Powered Land Analysis</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2 min-h-[400px] lg:min-h-[calc(100vh-180px)]">
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

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-surface-200 shadow-card p-6 h-full flex flex-col min-h-[360px] lg:min-h-0">
              <h2 className="text-lg font-semibold text-surface-900 mb-4">Insights</h2>

              <div className="mb-4">
                <AnalyzeButton
                  onClick={handleAnalyze}
                  disabled={!selectedLand}
                  isLoading={isLoading}
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded-lg">
                  {error}
                </p>
              )}

              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <InsightsPanel
                  insights={insights}
                  isLoading={isLoading}
                  isSuccess={isSuccess}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
