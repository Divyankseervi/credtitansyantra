import { useState, useEffect } from "react";

export default function LandVerificationForm({ onSubmit, isLoading, mapMode = false, selectedLand = null }) {
  const [formData, setFormData] = useState({
    declaredUse: "Agricultural",
    ndvi: 0.5,
    temperature: 25,
    humidity: 60,
    rainfall: 0,
    soilType: "loamy",
  });

  const landUseOptions = ["Agricultural", "Residential", "Commercial", "Industrial", "Mixed Use", "Forest/Plantation", "Barren/Fallow"];
  const soilTypes = ["loamy", "clayey", "sandy", "alluvial", "laterite"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(value) ? value : parseFloat(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert array coordinates to lat/lon object
    let coordinates = { latitude: 13.0827, longitude: 80.2707 };
    if (selectedLand?.coordinates) {
      const coords = selectedLand.coordinates;
      if (Array.isArray(coords) && coords.length > 0) {
        coordinates = { latitude: coords[0][0], longitude: coords[0][1] };
      }
    }

    onSubmit({
      declaredUse: formData.declaredUse,
      coordinates,
      ndvi: formData.ndvi,
      weatherData: {
        temperature: formData.temperature,
        humidity: formData.humidity,
        rainfall: formData.rainfall,
        soilType: formData.soilType,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Map Indicator - if in map mode */}
      {mapMode && selectedLand && (
        <div className="p-3 bg-green-50 border-2 border-green-200 rounded-lg text-xs text-green-700 font-medium">
          ✓ Location Selected
          {Array.isArray(selectedLand.coordinates) && selectedLand.coordinates.length > 0 && (
            <div className="text-xs mt-1">
              {selectedLand.coordinates.length > 1 
                ? `Polygon: ${selectedLand.coordinates.length} points`
                : `Coordinates: ${selectedLand.coordinates[0][0].toFixed(4)}°, ${selectedLand.coordinates[0][1].toFixed(4)}°`}
            </div>
          )}
        </div>
      )}

      {/* Declared Land Use */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          What Is It Declared As? <span className="text-red-500">*</span>
        </label>
        <select
          name="declaredUse"
          value={formData.declaredUse}
          onChange={handleInputChange}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          {landUseOptions.map((use) => (
            <option key={use} value={use}>
              {use}
            </option>
          ))}
        </select>
      </div>

      {/* NDVI Value */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          NDVI Score <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            name="ndvi"
            min="-1"
            max="1"
            step="0.05"
            value={formData.ndvi}
            onChange={handleInputChange}
            className="flex-1"
            disabled={isLoading}
          />
          <input
            type="number"
            name="ndvi"
            min="-1"
            max="1"
            step="0.05"
            value={formData.ndvi.toFixed(2)}
            onChange={handleInputChange}
            className="w-14 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Higher = More vegetation | Lower = Less vegetation
        </p>
      </div>

      {/* Weather Section */}
      <div className="border-t pt-2">
        <p className="text-xs font-medium text-gray-700 mb-2">🌦️ Weather Data</p>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-700">Temp (°C)</label>
              <input
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleInputChange}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-xs text-gray-700">Humidity (%)</label>
              <input
                type="number"
                name="humidity"
                value={formData.humidity}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-700">Rain (mm)</label>
              <input
                type="number"
                name="rainfall"
                value={formData.rainfall}
                onChange={handleInputChange}
                min="0"
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-xs text-gray-700">Soil Type</label>
              <select
                name="soilType"
                value={formData.soilType}
                onChange={handleInputChange}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                disabled={isLoading}
              >
                {soilTypes.map((soil) => (
                  <option key={soil} value={soil}>
                    {soil.charAt(0).toUpperCase() + soil.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          💡 API retrieves real weather if configured
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || (mapMode && !selectedLand)}
        className="w-full py-2 px-3 bg-blue-500 text-white font-semibold text-sm rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {isLoading ? "Analyzing..." : "Analyze & Verify"}
      </button>
    </form>
  );
}
