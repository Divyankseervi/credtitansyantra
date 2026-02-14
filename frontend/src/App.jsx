import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import MapSelector from "./components/MapSelector";
import InsightsPanel from "./components/InsightsPanel";
import AnalyzeButton from "./components/AnalyzeButton";
import VerifyLandUnified from "./components/VerifyLandUnified";
import SurroundingsAnalysis from "./components/SurroundingsAnalysis";
import SafetyScore from "./components/SafetyScore";
import { analyzeLand } from "./api";
import "./landing.css";

/* ===========================
   Landing Page Component
=========================== */
function Landing() {
  return (
    <div className="landing-page" id="top">
      <header className="landing-header">
        <nav>
          <div className="logo">
            <div className="logo-icon">LI</div>
            <div className="logo-text">
              <h1>Land Intelligence</h1>
              <p>AI-Powered Analysis</p>
            </div>
          </div>
          <div className="nav-links">
            <a href="#top">Home</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <Link to="/verify-land" className="btn-secondary">Verify Land & Check</Link>
            <Link to="/surroundings" className="btn-secondary">Surroundings Analysis</Link>
            <Link to="/safety-quick" className="btn-secondary">Quick Safety Check</Link>
            <Link to="/dashboard" className="btn-primary">Start Analyzing</Link>
          </div>
        </nav>
      </header>

      <main className="landing-main">
        <section className="page-header">
          <h1>Land Intelligence System</h1>
          <p>AI-Powered Land Analysis Dashboard</p>
          <div className="hero-actions">
            <Link to="/dashboard" className="btn-primary">Start Analyzing</Link>
            <a href="#features" className="btn-secondary">Explore Features</a>
          </div>
        </section>

        <section className="section-block" id="features">
          <div className="page-header">
            <h1>Powerful Features</h1>
            <p>Everything you need for comprehensive land analysis</p>
          </div>

          <div className="feature-detail">
            <div className="feature-detail-header">
              <div className="feature-icon-large">CHECK</div>
              <h2>Land Verification Suite</h2>
            </div>
            <p>
              Complete verification tool with three integrated features. Check record consistency across
              government records, documents, and satellite data. Verify ground truth by analyzing
              NDVI, weather patterns, and environmental factors. Analyze surrounding infrastructure and POIs
              to get smart land use recommendations. Use polygon drawing on interactive maps
              and connect real APIs for live data and AI insights.
            </p>
            <div className="feature-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Record Consistency Check</strong>
                  <span>Compare 3 sources + blockchain hashing</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Land Truth Verification</strong>
                  <span>Multi-factor analysis & compatibility scoring</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Surroundings Recommendation</strong>
                  <span>Analyze nearby POIs for smart land use</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Interactive Mapping</strong>
                  <span>Draw polygons and select exact areas</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Real Weather API</strong>
                  <span>OpenWeather integration for live data</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>AI Insights</strong>
                  <span>Gemini-powered explanations (optional)</span>
                </div>
              </div>
            </div>
            <Link to="/verify-land" className="btn-secondary" style={{display: 'inline-block', marginTop: '1rem'}}>
              Open Verification Suite
            </Link>
          </div>

          <div className="feature-detail">
            <div className="feature-detail-header">
              <div className="feature-icon-large">🌍</div>
              <h2>Surroundings-Based Land Use Recommendation</h2>
            </div>
            <p>
              Analyze nearby Points of Interest (POIs) from OpenStreetMap to recommend the most suitable land use.
              Determine whether land is best suited for Agricultural, Residential, Commercial, or Industrial use
              based on surrounding infrastructure like schools, hospitals, roads, and commercial establishments.
            </p>
            <div className="feature-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>POI Analysis</strong>
                  <span>OpenStreetMap Overpass API integration</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Smart Recommendations</strong>
                  <span>Rule-based engine for land use suggestions</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Risk Assessment</strong>
                  <span>Evaluate development risks based on surroundings</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>AI Explanations</strong>
                  <span>Optional Gemini-powered insights</span>
                </div>
              </div>
            </div>
            <Link to="/surroundings" className="btn-secondary" style={{display: 'inline-block', marginTop: '1rem'}}>
              Open Surroundings Analysis
            </Link>
          </div>

          <div className="feature-detail">
            <div className="feature-detail-header">
              <div className="feature-icon-large">MAP</div>
              <h2>Interactive Maps</h2>
            </div>
            <p>
              Draw precise polygons on satellite or street view maps to select land parcels.
              Our intuitive drawing tools make it easy to mark boundaries and analyze specific
              areas with pixel-perfect accuracy.
            </p>
            <div className="feature-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Satellite & Street View</strong>
                  <span>Switch between map types instantly</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Precise Drawing</strong>
                  <span>Polygon tools with area calculation</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Edit & Delete</strong>
                  <span>Modify selections easily</span>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-detail">
            <div className="feature-detail-header">
              <div className="feature-icon-large">NDVI</div>
              <h2>NDVI Analysis</h2>
            </div>
            <p>
              Get real-time Normalized Difference Vegetation Index scores to assess vegetation
              health. Perfect for agricultural monitoring, forest management, and environmental
              assessment.
            </p>
            <div className="feature-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Real-time Scores</strong>
                  <span>Instant vegetation health metrics</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Visual Overlay</strong>
                  <span>NDVI visualization on maps</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Agricultural Insights</strong>
                  <span>Optimize crop planning</span>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-detail">
            <div className="feature-detail-header">
              <div className="feature-icon-large">RISK</div>
              <h2>Risk Assessment</h2>
            </div>
            <p>
              Comprehensive flood and drought risk analysis with color-coded indicators. Make
              informed decisions about land use with detailed risk metrics and historical data.
            </p>
            <div className="feature-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Flood Risk</strong>
                  <span>Water level and flood zone analysis</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Drought Risk</strong>
                  <span>Water scarcity and drought indicators</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Color-coded Alerts</strong>
                  <span>Quick visual risk assessment</span>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-detail">
            <div className="feature-detail-header">
              <div className="feature-icon-large">SOIL</div>
              <h2>Soil Health</h2>
            </div>
            <p>
              Detailed soil health metrics and recommendations for optimal land use. Understand
              soil composition, fertility, and suitability for different agricultural purposes.
            </p>
            <div className="feature-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Health Scores</strong>
                  <span>Comprehensive soil quality metrics</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Composition Analysis</strong>
                  <span>Nutrient and mineral data</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Recommendations</strong>
                  <span>Optimal crop suggestions</span>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-detail">
            <div className="feature-detail-header">
              <div className="feature-icon-large">CHANGE</div>
              <h2>Change Detection</h2>
            </div>
            <p>
              Track land use changes over time with historical comparison data. Monitor
              deforestation, urbanization, agricultural expansion, and environmental changes.
            </p>
            <div className="feature-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Historical Data</strong>
                  <span>Compare changes over time</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Trend Analysis</strong>
                  <span>Identify patterns and changes</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Alerts</strong>
                  <span>Get notified of significant changes</span>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-detail">
            <div className="feature-detail-header">
              <div className="feature-icon-large">SCORE</div>
              <h2>Trust Score</h2>
            </div>
            <p>
              AI-generated trust score based on multiple data sources and analysis quality.
              Understand the reliability and confidence level of each analysis.
            </p>
            <div className="feature-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Multi-source Data</strong>
                  <span>Combined satellite and sensor data</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Quality Metrics</strong>
                  <span>Data accuracy indicators</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">+</span>
                <div className="benefit-text">
                  <strong>Confidence Levels</strong>
                  <span>Reliability scoring system</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-block" id="about">
          <div className="page-header">
            <h1>About Land Intelligence</h1>
            <p>Revolutionizing land analysis with AI-powered insights</p>
          </div>

          <div className="content-section">
            <h2>Our Mission</h2>
            <p>
              Land Intelligence System is designed to democratize access to advanced land analysis
              tools. Whether you are a farmer planning your next crop, a developer evaluating a
              site, or an environmental researcher studying land use changes, our platform provides
              instant, AI-powered insights to help you make informed decisions.
            </p>
            <p>
              We combine satellite imagery, machine learning, and comprehensive data sources to
              deliver accurate, actionable intelligence about any piece of land on Earth.
            </p>
          </div>

          <div className="content-section">
            <h2>How It Works</h2>
            <p>
              Simply select a land parcel on our interactive map by drawing a polygon. Our AI system
              then analyzes multiple data sources including satellite imagery, weather patterns,
              soil databases, and historical records to provide comprehensive insights.
            </p>
            <p>
              Within seconds, you receive detailed information about vegetation health (NDVI), flood
              and drought risks, soil quality, land use changes, and an overall trust score
              indicating the reliability of the analysis.
            </p>
          </div>

          <div className="content-section">
            <h2>Technology Stack</h2>
            <p>Built with modern web technologies for performance and reliability:</p>
            <div className="tech-stack">
              <div className="tech-item">
                <strong>React</strong>
                <span>Frontend Framework</span>
              </div>
              <div className="tech-item">
                <strong>Leaflet</strong>
                <span>Interactive Maps</span>
              </div>
              <div className="tech-item">
                <strong>AI/ML</strong>
                <span>Analysis Engine</span>
              </div>
              <div className="tech-item">
                <strong>Satellite Data</strong>
                <span>Imagery Sources</span>
              </div>
            </div>
          </div>

          <div className="content-section">
            <h2>Use Cases</h2>
            <p><strong>Agriculture:</strong> Optimize crop planning, monitor field health, and assess soil quality.</p>
            <p><strong>Real Estate:</strong> Evaluate properties, assess environmental risks, and understand land value.</p>
            <p><strong>Environmental Research:</strong> Track deforestation, monitor ecosystem changes, and study land use patterns.</p>
            <p><strong>Urban Planning:</strong> Analyze development sites, assess infrastructure needs, and plan sustainable growth.</p>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-links">
            <a href="#top">Home</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div className="footer-copyright">
            <p>&copy; 2026 Land Intelligence System. Built for Hackathon.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ===========================
   Dashboard Component
=========================== */
function Dashboard() {
  const [selectedLand, setSelectedLand] = useState(null);
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isSatellite, setIsSatellite] = useState(false);
  const [showNDVI, setShowNDVI] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedLand?.coordinates) return;

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const data = await analyzeLand(selectedLand.coordinates);
      setInsights(data);
      setIsSuccess(true);
    } catch (err) {
      setError(
        err?.message ||
          err?.response?.data?.message ||
          "Analysis failed"
      );
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
              <h1 className="text-xl font-bold text-surface-900">
                Land Intelligence
              </h1>
              <p className="text-sm text-surface-500">
                AI-Powered Land Analysis
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto p-4 lg:p-6">
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Link
            to="/verify-land"
            className="bg-white rounded-xl border border-gray-200 shadow-card p-6 hover:shadow-card-hover transition-all hover:border-blue-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <span className="text-2xl">✓</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Land Verification Suite</h3>
                <p className="text-sm text-gray-600">
                  Record consistency & ground truth analysis
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          <Link
            to="/surroundings"
            className="bg-white rounded-xl border border-gray-200 shadow-card p-6 hover:shadow-card-hover transition-all hover:border-green-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🌍</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Surroundings Analysis</h3>
                <p className="text-sm text-gray-600">
                  POI-based land use recommendations
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          <Link
            to="/safety-quick"
            className="bg-white rounded-xl border border-gray-200 shadow-card p-6 hover:shadow-card-hover transition-all hover:border-red-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🛡️</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Quick Safety Check</h3>
                <p className="text-sm text-gray-600">
                  Enter coordinates for safety analysis
                </p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        </div>

        {/* Second Row - Land Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📊</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Land Analysis</h3>
                <p className="text-sm text-gray-600">
                  Select area on map to analyze
                </p>
              </div>
            </div>
          </div>
        </div>

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
              <h2 className="text-lg font-semibold text-surface-900 mb-4">
                Insights
              </h2>

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

/* ===========================
   Safety Quick Check Component
=========================== */
function SafetyQuickCheck() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!latitude || !longitude) {
      setError('Please enter both latitude and longitude');
      return;
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      setError('Please enter valid numbers');
      return;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setError('Latitude must be -90 to 90, Longitude must be -180 to 180');
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return <SafetyScore initialCoordinates={{ latitude: parseFloat(latitude), longitude: parseFloat(longitude) }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            ← Back
          </Link>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Quick Safety Check</h1>
            <p className="text-sm text-gray-500">Enter coordinates to analyze location safety</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="e.g., 28.6139"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Range: -90 to 90</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="e.g., 77.2090"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Range: -180 to 180</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Analyze Safety Score
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Example Coordinates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="font-medium text-gray-900">New Delhi, India</p>
                <p className="text-gray-600">28.6139, 77.2090</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="font-medium text-gray-900">San Francisco, USA</p>
                <p className="text-gray-600">37.7749, -122.4194</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ===========================
   App Router
=========================== */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/verify-land" element={<VerifyLandUnified />} />
      <Route path="/surroundings" element={<SurroundingsAnalysis />} />
      <Route path="/safety" element={<SafetyScore />} />
      <Route path="/safety-quick" element={<SafetyQuickCheck />} />
      {/* Legacy routes - redirect to unified */}
      <Route path="/consistency-check" element={<VerifyLandUnified />} />
      <Route path="/land-verification" element={<VerifyLandUnified />} />
    </Routes>
  );
}
