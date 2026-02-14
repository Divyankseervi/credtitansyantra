import { useEffect, useState } from 'react';
import ScoreCard from './ScoreCard';
import RiskIndicator from './RiskIndicator';

function TrustScoreBox({ score }) {
  const getColor = () => {
    if (score >= 70) return 'text-emerald-600 border-emerald-300 bg-emerald-50';
    if (score >= 40) return 'text-amber-600 border-amber-300 bg-amber-50';
    return 'text-red-600 border-red-300 bg-red-50';
  };

  return (
    <div
      className={`rounded-xl border-2 p-6 text-center transition-all duration-500 ${getColor()}`}
    >
      <p className="text-sm font-medium uppercase tracking-wider opacity-80 mb-1">
        Land Trust Score
      </p>
      <p className="text-4xl font-bold tabular-nums">{score}%</p>
    </div>
  );
}

export default function InsightsPanel({ insights, isLoading, isSuccess }) {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess && insights) {
      setShowSuccess(true);
      const t = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(t);
    }
  }, [isSuccess, insights]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mb-4" />
        <p className="text-surface-600 font-medium">Analyzing Land Intelligence...</p>
        <p className="text-sm text-surface-400 mt-1">Processing satellite & sensor data</p>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-surface-100 flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-surface-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </div>
        <p className="text-surface-600 font-medium">Select land on the map</p>
        <p className="text-sm text-surface-400 mt-1">
          Draw a polygon to analyze and get AI-powered insights
        </p>
      </div>
    );
  }

  const {
    land_type,
    ndvi_score,
    flood_risk,
    drought_risk,
    soil_health,
    change_detection,
    trust_score,
    old_image_url,
    new_image_url,
    ndvi_url,
  } = insights;

  const changeLabel =
    typeof change_detection === 'string'
      ? change_detection
      : change_detection?.status || change_detection?.message || '—';

  const getRiskLevel = (risk) => {
    if (!risk) return 'low';
    const str = String(risk).toLowerCase();
    if (str.includes('high')) return 'high';
    if (str.includes('medium') || str.includes('moderate')) return 'medium';
    const numMatch = String(risk).match(/\d+/);
    const r = typeof risk === 'number' ? risk : (numMatch ? parseInt(numMatch[0], 10) : 0);
    if (r <= 33) return 'low';
    if (r <= 66) return 'medium';
    return 'high';
  };

  return (
    <div className="space-y-4 animate-slide-up">
      {showSuccess && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm font-medium">
          <span className="text-lg">✓</span> Analysis complete!
        </div>
      )}

      <TrustScoreBox score={trust_score ?? 0} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <div className="bg-white rounded-xl p-4 border border-surface-200 shadow-card">
            <p className="text-sm font-medium text-surface-600 mb-1">Land Type</p>
            <p className="text-lg font-semibold text-surface-900">{land_type || '—'}</p>
          </div>
        </div>

        <ScoreCard
          label="NDVI Score"
          value={typeof ndvi_score === 'number' ? (ndvi_score * 100).toFixed(1) : ndvi_score ?? 0}
          max={100}
          unit=""
          icon="🌿"
          variant="score"
        />
        <ScoreCard
          label="Soil Health"
          value={soil_health ?? 0}
          max={100}
          unit="%"
          icon="🪴"
          variant="score"
        />

        <div className="sm:col-span-2 space-y-2">
          <p className="text-sm font-medium text-surface-600">Risk Assessment</p>
          <div className="flex flex-wrap gap-2">
            <RiskIndicator
              level={getRiskLevel(flood_risk)}
              label={`Flood: ${flood_risk ?? 'N/A'}`}
            />
            <RiskIndicator
              level={getRiskLevel(drought_risk)}
              label={`Drought: ${drought_risk ?? 'N/A'}`}
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <div className="bg-white rounded-xl p-4 border border-surface-200 shadow-card">
            <p className="text-sm font-medium text-surface-600 mb-1">Change Detection</p>
            <p className="text-surface-900">{changeLabel}</p>
          </div>
        </div>

        {(old_image_url || new_image_url || ndvi_url) && (
          <div className="sm:col-span-2">
            <div className="bg-white rounded-xl p-4 border border-surface-200 shadow-card">
              <p className="text-sm font-medium text-surface-600 mb-3">Satellite Imagery</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {old_image_url && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-surface-500 uppercase">Old Image</p>
                    <a
                      href={old_image_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      <img
                        src={old_image_url}
                        alt="Old satellite"
                        loading="lazy"
                        className="w-full h-32 object-cover rounded-lg border border-surface-200"
                      />
                    </a>
                  </div>
                )}
                {new_image_url && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-surface-500 uppercase">New Image</p>
                    <a
                      href={new_image_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      <img
                        src={new_image_url}
                        alt="New satellite"
                        loading="lazy"
                        className="w-full h-32 object-cover rounded-lg border border-surface-200"
                      />
                    </a>
                  </div>
                )}
                {ndvi_url && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-surface-500 uppercase">NDVI</p>
                    <a
                      href={ndvi_url}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      <img
                        src={ndvi_url}
                        alt="NDVI map"
                        loading="lazy"
                        className="w-full h-32 object-cover rounded-lg border border-surface-200"
                      />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
