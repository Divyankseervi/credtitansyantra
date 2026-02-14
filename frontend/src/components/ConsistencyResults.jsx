export default function ConsistencyResults({ result, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
        <p className="text-gray-600 font-medium">Analyzing consistency...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No results yet. Fill the form and click Check Consistency.</p>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "MATCH":
        return "✔";
      case "PARTIAL_MISMATCH":
        return "⚠";
      case "STRONG_MISMATCH":
        return "🚨";
      default:
        return "•";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "MATCH":
        return "bg-green-50 border-green-200 text-green-700";
      case "PARTIAL_MISMATCH":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "STRONG_MISMATCH":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "MATCH":
        return "bg-green-100";
      case "PARTIAL_MISMATCH":
        return "bg-yellow-100";
      case "STRONG_MISMATCH":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Status Card */}
      <div
        className={`p-4 rounded-lg border-2 ${getStatusColor(
          result.consistencyStatus
        )}`}
      >
        <div className="flex items-start gap-3">
          <span className="text-3xl">{getStatusIcon(result.consistencyStatus)}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">
              {result.consistencyStatus === "MATCH"
                ? "Consistent Record"
                : result.consistencyStatus === "PARTIAL_MISMATCH"
                ? "Possible Inconsistency"
                : "Strong Inconsistency"}
            </h3>
            <p className="text-sm">{result.consistencyMessage}</p>
          </div>
        </div>
      </div>

      {/* Land Use Comparison */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700">Land Use Comparison</h4>

        {/* Declared Use */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-600 font-semibold uppercase">
            Declared Use (Document)
          </p>
          <p className="text-lg font-bold text-blue-700 mt-1">
            {result.declaredUse}
          </p>
        </div>

        {/* Government Record Use */}
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-xs text-purple-600 font-semibold uppercase">
            Government Record Use
          </p>
          <p className="text-lg font-bold text-purple-700 mt-1">
            {result.govUse}
          </p>
        </div>

        {/* Detected Use */}
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
          <p className="text-xs text-indigo-600 font-semibold uppercase">
            Detected Use (Satellite/NDVI)
          </p>
          <p className="text-lg font-bold text-indigo-700 mt-1">
            {result.detectedUse}
          </p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-2 pt-2 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Confidence Level</span>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              result.confidenceLevel === "High"
                ? "bg-green-100 text-green-700"
                : result.confidenceLevel === "Medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {result.confidenceLevel}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Risk Flag</span>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              result.riskFlag
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {result.riskFlag ? "🚨 Yes" : "✔ No"}
          </span>
        </div>

        <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
          <p>
            <strong>Check Time:</strong> {new Date(result.timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Blockchain Snapshot Info */}
      {result.snapshot && (
        <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg mt-4">
          <p className="text-xs font-semibold text-gray-700 mb-2 uppercase">
            Integrity Hash (Blockchain Snapshot)
          </p>
          <p className="text-xs text-gray-600 font-mono break-all">
            {result.snapshot.hash}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This hash ensures the integrity and authenticity of this consistency check
            record.
          </p>
        </div>
      )}

      {/* Recommendations */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mt-4">
        <p className="text-xs font-semibold text-blue-700 uppercase mb-2">
          Recommendations
        </p>
        <ul className="text-xs text-blue-600 space-y-1">
          {result.consistencyStatus === "MATCH" ? (
            <>
              <li>✔ Record is consistent across all sources</li>
              <li>✔ No action required for this parcel</li>
            </>
          ) : result.consistencyStatus === "PARTIAL_MISMATCH" ? (
            <>
              <li>⚠ Verify recent land use changes</li>
              <li>⚠ Review satellite imagery for accuracy</li>
              <li>⚠ Update records if recent conversion occurred</li>
            </>
          ) : (
            <>
              <li>🚨 Urgent verification required</li>
              <li>🚨 Cross-check with ground surveys</li>
              <li>🚨 Contact relevant authorities for clarification</li>
              <li>🚨 Do NOT use this land without further investigation</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
