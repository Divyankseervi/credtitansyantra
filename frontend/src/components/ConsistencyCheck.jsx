import { useState } from "react";
import { Link } from "react-router-dom";
import ConsistencyCheckForm from "./ConsistencyCheckForm";
import ConsistencyResults from "./ConsistencyResults";
import { performConsistencyCheck } from "../api/consistencyCheck";

export default function ConsistencyCheck() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckConsistency = async (checkData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await performConsistencyCheck(checkData);
      setResult(result);
    } catch (err) {
      setError(err?.message || "An error occurred while checking consistency");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              ← Back
            </Link>
            <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Record Consistency Check
              </h1>
              <p className="text-sm text-gray-500">
                Verify land document authenticity
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Info Cards */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-card border border-blue-100">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📋</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Declared Use</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Land use stated in your documents
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-card border border-purple-100">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🏛️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Government Record</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Official land classification
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-card border border-indigo-100">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🛰️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Satellite Detection</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Ground reality via NDVI analysis
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-card border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Enter Land Details
                </h2>
                <p className="text-sm text-gray-600">
                  Provide survey information and satellite metrics to verify consistency
                  between declared use, government records, and ground reality.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    <strong>Error:</strong> {error}
                  </p>
                </div>
              )}

              <ConsistencyCheckForm
                onSubmit={handleCheckConsistency}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-card border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Consistency Analysis Results
          </h2>

          {result || isLoading ? (
            <ConsistencyResults result={result} isLoading={isLoading} />
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <p className="text-gray-600 font-medium">
                No results yet
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Fill in the form on the left and click "Check Consistency" to analyze
                your land records
              </p>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <span>ℹ️</span> What is this tool?
            </h3>
            <p className="text-sm text-blue-800">
              Record Consistency Check compares three sources of land use information:
              your declared use, government classification, and satellite-based
              detection. This helps identify potential inconsistencies between documents,
              public records, and ground reality—NOT fraud detection, but transparency.
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <span>✅</span> How to interpret results
            </h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>
                <strong>✔ Consistent:</strong> All sources align perfectly
              </li>
              <li>
                <strong>⚠ Possible Mismatch:</strong> Some sources conflict
              </li>
              <li>
                <strong>🚨 Strong Inconsistency:</strong> Requires investigation
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
