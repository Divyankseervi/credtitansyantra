import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { analyzeRoi } from '../api/roiService';

const DEFAULT_FORM = {
  lat: '',
  lon: '',
  ndvi: '',
  change: 'improving',
  landType: 'residential',
};

const CHANGE_OPTIONS = [
  { value: 'improving', label: 'Improving' },
  { value: 'stable', label: 'Stable' },
  { value: 'declining', label: 'Declining' },
];

const LAND_TYPE_OPTIONS = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'agricultural', label: 'Agricultural' },
];

export default function RoiAnalysis() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const parsedValues = useMemo(() => {
    const lat = Number(form.lat);
    const lon = Number(form.lon);
    const ndvi = Number(form.ndvi);
    return {
      lat,
      lon,
      ndvi,
      change: form.change,
      landType: form.landType,
      latValid: Number.isFinite(lat),
      lonValid: Number.isFinite(lon),
      ndviValid: Number.isFinite(ndvi),
    };
  }, [form]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setResult(null);

    if (!parsedValues.latValid || !parsedValues.lonValid || !parsedValues.ndviValid) {
      setError('Please enter valid numeric values for latitude, longitude, and NDVI.');
      return;
    }

    if (parsedValues.ndvi < 0 || parsedValues.ndvi > 1) {
      setError('NDVI must be between 0 and 1.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await analyzeRoi({
        lat: parsedValues.lat,
        lon: parsedValues.lon,
        ndvi: parsedValues.ndvi,
        change: parsedValues.change,
        landType: parsedValues.landType,
      });
      setResult(data);
    } catch (err) {
      setError(err?.message || 'ROI analysis failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const advice = result?.aiAdvice;
  const adviceIsObject = advice && typeof advice === 'object';

  return (
    <div className="min-h-screen bg-surface-50 font-sans">
      <header className="bg-white border-b border-surface-200 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-surface-900">ROI Analysis</h1>
            <p className="text-sm text-surface-500">Growth score and investment outlook</p>
          </div>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border border-surface-200 shadow-card p-6">
          <h2 className="text-lg font-semibold text-surface-900 mb-4">Input Parameters</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="text-sm font-medium text-surface-700">
                Latitude
                <input
                  type="number"
                  name="lat"
                  step="any"
                  value={form.lat}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-surface-200 px-3 py-2"
                  placeholder="e.g. 22.5726"
                  required
                />
              </label>
              <label className="text-sm font-medium text-surface-700">
                Longitude
                <input
                  type="number"
                  name="lon"
                  step="any"
                  value={form.lon}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-surface-200 px-3 py-2"
                  placeholder="e.g. 88.3639"
                  required
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="text-sm font-medium text-surface-700">
                NDVI (0 to 1)
                <input
                  type="number"
                  name="ndvi"
                  step="0.01"
                  value={form.ndvi}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-surface-200 px-3 py-2"
                  placeholder="e.g. 0.62"
                  required
                />
              </label>
              <label className="text-sm font-medium text-surface-700">
                Change
                <select
                  name="change"
                  value={form.change}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-surface-200 px-3 py-2"
                >
                  {CHANGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="text-sm font-medium text-surface-700">
              Land Type
              <select
                name="landType"
                value={form.landType}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-surface-200 px-3 py-2"
              >
                {LAND_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 text-white font-semibold py-2.5 hover:bg-blue-700 disabled:opacity-70"
            >
              {isLoading ? 'Analyzing ROI...' : 'Analyze ROI'}
            </button>
          </form>
        </section>

        <section className="bg-white rounded-xl border border-surface-200 shadow-card p-6">
          <h2 className="text-lg font-semibold text-surface-900 mb-4">ROI Results</h2>
          {!result && (
            <div className="text-sm text-surface-600 bg-surface-50 border border-surface-200 rounded-lg p-4">
              Enter values and run the analysis to see growth score, ROI estimates, and AI advice.
            </div>
          )}
          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-surface-200 p-4">
                  <p className="text-xs uppercase text-surface-500">Growth Score</p>
                  <p className="text-2xl font-semibold text-surface-900">{result.growthScore}</p>
                </div>
                <div className="rounded-lg border border-surface-200 p-4">
                  <p className="text-xs uppercase text-surface-500">Future Value</p>
                  <p className="text-2xl font-semibold text-surface-900">{result.futureValue}</p>
                </div>
                <div className="rounded-lg border border-surface-200 p-4">
                  <p className="text-xs uppercase text-surface-500">ROI 5yr</p>
                  <p className="text-2xl font-semibold text-surface-900">{result.roi5yr}%</p>
                </div>
                <div className="rounded-lg border border-surface-200 p-4">
                  <p className="text-xs uppercase text-surface-500">ROI 10yr</p>
                  <p className="text-2xl font-semibold text-surface-900">{result.roi10yr}%</p>
                </div>
              </div>

              <div className="rounded-lg border border-surface-200 p-4">
                <p className="text-xs uppercase text-surface-500 mb-2">AI Advice</p>
                {adviceIsObject ? (
                  <div className="space-y-2 text-sm text-surface-700">
                    <p><strong>Summary:</strong> {advice.summary}</p>
                    <p><strong>Risk Level:</strong> {advice.riskLevel}</p>
                    <p><strong>Growth Outlook:</strong> {advice.growthOutlook}</p>
                    <p><strong>Recommendation:</strong> {advice.recommendation}</p>
                  </div>
                ) : (
                  <p className="text-sm text-surface-700">{String(advice || '')}</p>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
