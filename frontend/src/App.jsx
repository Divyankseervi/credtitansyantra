import { analyzeROI } from "./services/api";
import { useState } from "react";



import './App.css';



export default function App() {
  const [form, setForm] = useState({
    lat: 22.5,
    lon: 88.3,
    ndvi: 0.6,
    change: 'improving',
    landType: 'residential',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'lat' || name === 'lon' || name === 'ndvi' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const data = await analyzeROI(form);
      console.log("API Response:", data);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>ROI Intelligence Engine</h1>
        <p>Land investment analysis with AI advice</p>
      </header>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Latitude
            <input
              type="number"
              name="lat"
              value={form.lat}
              onChange={handleChange}
              step="any"
              required
            />
          </label>
          <label>
            Longitude
            <input
              type="number"
              name="lon"
              value={form.lon}
              onChange={handleChange}
              step="any"
              required
            />
          </label>
          <label>
            NDVI (0–1)
            <input
              type="number"
              name="ndvi"
              value={form.ndvi}
              onChange={handleChange}
              min="0"
              max="1"
              step="0.01"
              required
            />
          </label>
          <label>
            Change
            <select name="change" value={form.change} onChange={handleChange}>
              <option value="improving">Improving</option>
              <option value="stable">Stable</option>
              <option value="declining">Declining</option>
            </select>
          </label>
          <label>
            Land Type
            <input
              type="text"
              name="landType"
              value={form.landType}
              onChange={handleChange}
              placeholder="e.g. residential, agricultural"
              required
            />
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {result && (
        <section className="results">
          <h2>Analysis Results</h2>
          <div className="metrics">
            <div className="metric">
              <span className="label">Growth Score</span>
              <span className="value">{result?.growthScore ?? '—'}/100</span>
            </div>
            <div className="metric">
              <span className="label">Future Value</span>
              <span className="value">
                {result?.futureValue ? result.futureValue.toLocaleString() : '—'}
              </span>
            </div>
            <div className="metric">
              <span className="label">5yr ROI</span>
              <span className="value">{result?.roi5yr ?? '—'}%</span>
            </div>
            <div className="metric">
              <span className="label">10yr ROI</span>
              <span className="value">{result?.roi10yr ?? '—'}%</span>
            </div>
          </div>
          <div className="ai-advice">
            <h3>Investment recommendation</h3>
            {result?.aiAdvice && typeof result.aiAdvice === 'object' ? (
              <>
                <p className="advice-summary"><strong>Summary:</strong> {result.aiAdvice.summary ?? '—'}</p>
                <p><strong>Risk level:</strong> {result.aiAdvice.riskLevel ?? '—'}</p>
                <p><strong>Growth outlook:</strong> {result.aiAdvice.growthOutlook ?? '—'}</p>
                <p><strong>Recommendation:</strong> {result.aiAdvice.recommendation ?? '—'}</p>
              </>
            ) : (
              <div className="advice-text">{result?.aiAdvice ?? 'No advice'}</div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
