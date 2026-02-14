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
   Landing Page
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

          {/* ✅ MERGED NAVIGATION */}
          <div className="nav-links">
            <a href="#top">Home</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>

            <Link to="/verify-land" className="btn-secondary">
              Verify Land
            </Link>

            <Link to="/surroundings" className="btn-secondary">
              Surroundings
            </Link>

            <Link to="/dashboard" className="btn-primary">
              Start Analyzing
            </Link>
          </div>
        </nav>
      </header>

      <main className="landing-main">
        <section className="page-header">
          <h1>Land Intelligence System</h1>
          <p>AI-Powered Land Analysis Dashboard</p>

          <div className="hero-actions">
            <Link to="/dashboard" className="btn-primary">
              Start Analyzing
            </Link>
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
              <div className="feature-icon-large">MAP</div>
              <h2>Interactive Maps</h2>
            </div>
            <p>
              Draw precise polygons on satellite or street view maps to select land parcels.
              Our intuitive drawing tools make it easy to mark boundaries and analyze specific
              areas with pixel-perfect accuracy.
            </p>
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
          </div>

          <div className="feature-detail">
            <div className="feature-detail-header">
              <div className="feature-icon-large">VERIFY</div>
              <h2>Land Verification</h2>
            </div>
            <p>
              Verify land records against satellite data and government databases.
              Detect inconsistencies and ensure document authenticity.
            </p>
          </div>
        </section>

        <section className="section-block" id="about">
          <div className="page-header">
            <h1>About Land Intelligence</h1>
            <p>Revolutionizing land analysis with AI-powered insights</p>
          </div>

          <div className="feature-detail">
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

          <div className="feature-detail">
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
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Land Intelligence</h3>
            <p>AI-Powered Land Analysis Platform</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="#top">Home</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>
          </div>
          <div className="footer-section">
            <h4>Tools</h4>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/verify-land">Verify Land</Link>
            <Link to="/surroundings">Surroundings</Link>
          </div>
          <div className="footer-copyright">
            <p>&copy; 2026 Land Intelligence System. Built for Innovation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ===========================
   Dashboard
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
      setError(err?.message || "Analysis failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 font-sans">
      <main className="max-w-[1800px] mx-auto p-4 lg:p-6">
        
        {/* ⭐ FEATURE CARDS (FROM FRIEND) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Link to="/verify-land" className="card">Land Verification</Link>
          <Link to="/surroundings" className="card">Surroundings</Link>
          <Link to="/safety" className="card">Safety Score</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="lg:col-span-2">
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

          <div>
            <AnalyzeButton
              onClick={handleAnalyze}
              disabled={!selectedLand}
              isLoading={isLoading}
            />

            {error && <p className="text-red-500">{error}</p>}

            <InsightsPanel
              insights={insights}
              isLoading={isLoading}
              isSuccess={isSuccess}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

/* ===========================
   ROUTER (MOST IMPORTANT PART)
=========================== */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* ⭐ NEW FEATURE ROUTES */}
      <Route path="/verify-land" element={<VerifyLandUnified />} />
      <Route path="/surroundings" element={<SurroundingsAnalysis />} />
      <Route path="/safety" element={<SafetyScore />} />
    </Routes>
  );
}
