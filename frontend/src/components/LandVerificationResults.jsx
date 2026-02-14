export default function LandVerificationResults({ result, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 font-medium">Analyzing reality vs declaration...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No results yet. Fill the form and click Detect Actual Land Use.</p>
      </div>
    );
  }

  const getRiskColor = (level) => {
    switch (level) {
      case "Low":
        return "bg-green-50 border-green-200 text-green-700";
      case "Medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "High":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case "Low":
        return "✔";
      case "Medium":
        return "⚠";
      case "High":
        return "🚨";
      default:
        return "•";
    }
  };

  const { characteristics } = result;

  return (
    <div className="space-y-4">
      {/* Main Comparison Card */}
      <div className={`p-4 rounded-lg border-2 ${getRiskColor(result.riskLevel)}`}>
        <div className="flex items-start gap-3">
          <span className="text-3xl">{getRiskIcon(result.riskLevel)}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              {result.comparison.match ? "Match! ✔" : "Mismatch ⚠"}
            </h3>
            <p className="text-sm mb-2">{result.comparison.message}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Risk Level:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  result.riskLevel === "High"
                    ? "bg-red-100 text-red-700"
                    : result.riskLevel === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {result.riskLevel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Land Use Comparison */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <p className="text-xs text-blue-600 font-semibold uppercase mb-2">You Said It Is</p>
          <p className="text-2xl font-bold text-blue-700">{result.declaredUse}</p>
        </div>

        <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
          <p className="text-xs text-purple-600 font-semibold uppercase mb-2">Reality Says It Is</p>
          <p className="text-2xl font-bold text-purple-700">{result.detectedUse}</p>
        </div>
      </div>

      {/* Detailed Characteristics */}
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-700 mb-3 text-sm">📊 Land Characteristics Analysis</h4>

        <div className="grid grid-cols-2 gap-3">
          {/* Vegetation */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-xs text-emerald-600 font-semibold uppercase">Vegetation</p>
            <p className="text-sm font-bold text-emerald-700 mt-1">
              {characteristics.vegetation.level}
            </p>
            <p className="text-xs text-emerald-600 mt-1">
              {characteristics.vegetation.type}
            </p>
          </div>

          {/* Moisture */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-600 font-semibold uppercase">Moisture Level</p>
            <p className="text-sm font-bold text-blue-700 mt-1">
              {characteristics.moisture}
            </p>
          </div>

          {/* Climate */}
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-xs text-orange-600 font-semibold uppercase">Climate Zone</p>
            <p className="text-sm font-bold text-orange-700 mt-1">
              {characteristics.climate}
            </p>
          </div>

          {/* Building Density */}
          <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
            <p className="text-xs text-gray-600 font-semibold uppercase">Building Density</p>
            <p className="text-sm font-bold text-gray-700 mt-1">
              {characteristics.buildingDensity.level}
            </p>
            <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
              <div
                className="bg-gray-700 h-2 rounded-full"
                style={{
                  width: `${Math.min(100, characteristics.buildingDensity.density)}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Soil Fertility */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-600 font-semibold uppercase">Soil Fertility</p>
            <p className="text-sm font-bold text-amber-700 mt-1">
              {Math.round(characteristics.soilFertility)}%
            </p>
            <div className="w-full bg-gray-300 rounded-full h-2 mt-2">
              <div
                className="bg-amber-600 h-2 rounded-full"
                style={{ width: `${Math.min(100, characteristics.soilFertility)}%` }}
              ></div>
            </div>
          </div>

          {/* Seasonality */}
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-xs text-indigo-600 font-semibold uppercase">Seasonality</p>
            <p className="text-sm font-bold text-indigo-700 mt-1">
              {characteristics.seasonality.season}
            </p>
            <p className="text-xs text-indigo-600 mt-1">
              {characteristics.seasonality.effect}
            </p>
          </div>
        </div>
      </div>

      {/* Compatibility Score */}
      <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-700">Compatibility Score</p>
          <span className="text-2xl font-bold text-gray-900">
            {(result.comparison.compatibilityScore * 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all ${
              result.comparison.compatibilityScore > 0.7
                ? "bg-green-500"
                : result.comparison.compatibilityScore > 0.4
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{
              width: `${result.comparison.compatibilityScore * 100}%`,
            }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {result.comparison.compatibilityScore > 0.7
            ? "✔ Declaration is likely accurate"
            : result.comparison.compatibilityScore > 0.4
            ? "⚠ Could be transitional or changing usage"
            : "🚨 Declaration does not match detected land use"}
        </p>
      </div>

      {/* Recommendations */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
          💡 Recommended Actions
        </p>
        <ul className="text-sm text-blue-800 space-y-1">
          {result.comparison.match ? (
            <>
              <li>✔ Declaration matches detected reality</li>
              <li>✔ No further action required</li>
            </>
          ) : result.riskLevel === "Medium" ? (
            <>
              <li>⚠ Review recent land use changes</li>
              <li>⚠ Verify satellite imagery dates</li>
              <li>⚠ Check if land is transitioning to new use</li>
              <li>⚠ Consider seasonal variations</li>
            </>
          ) : (
            <>
              <li>🚨 Schedule ground verification</li>
              <li>🚨 Cross-check with satellite imagery</li>
              <li>🚨 Verify with local authorities</li>
              <li>🚨 Obtain updated survey documents</li>
              <li>🚨 Do not proceed without clarification</li>
            </>
          )}
        </ul>
      </div>

      {/* Location Info */}
      {result.coordinates && (
        <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600">
          <p>
            <strong>Location:</strong> {result.coordinates.latitude.toFixed(4)}°,{" "}
            {result.coordinates.longitude.toFixed(4)}°
          </p>
          <p>
            <strong>Analyzed:</strong> {new Date(result.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
