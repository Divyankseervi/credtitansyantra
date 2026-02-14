import { useState } from "react";
import { setOpenWeatherAPI, validateAPIKey } from "../api/weatherService";

export default function APISettingsModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState(localStorage.getItem('openweather_api_key') || '');
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('geminiApiKey') || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = () => {
    if (!apiKey.trim() && !geminiKey.trim()) {
      setMessage('Please enter at least one API key');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      if (apiKey.trim()) {
        if (apiKey.length < 20) {
          setMessage('OpenWeather API key seems too short. Please verify.');
          setIsSaving(false);
          return;
        }
        setOpenWeatherAPI(apiKey);
        localStorage.setItem('openweather_api_key', apiKey);
      }

      if (geminiKey.trim()) {
        localStorage.setItem('geminiApiKey', geminiKey);
      }

      setMessage('✓ API keys saved successfully!');
      setIsSaving(false);
      
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 500);
  };

  const handleGetOpenWeatherKey = () => {
    window.open('https://openweathermap.org/api', '_blank');
  };

  const handleGetGeminiKey = () => {
    window.open('https://aistudio.google.com/app/apikey', '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          🔑 API Configuration
        </h2>

        <div className="space-y-4">
          {/* OpenWeather API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OpenWeather API Key (Optional)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your OpenWeather API key"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Get your free API key at{' '}
              <button
                onClick={handleGetOpenWeatherKey}
                className="text-blue-600 hover:underline"
              >
                openweathermap.org/api
              </button>
            </p>
            <p className="text-xs text-gray-600 mt-2">
              ✓ Real-time weather data for land verification
            </p>
          </div>

          {/* Gemini API Key */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Get your API key at{' '}
              <button
                onClick={handleGetGeminiKey}
                className="text-blue-600 hover:underline"
              >
                aistudio.google.com
              </button>
            </p>
            <p className="text-xs text-gray-600 mt-2">
              🤖 AI-powered explanations for land recommendations
            </p>
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.includes('✓')
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>💡 Features:</strong>
              <br />✓ OpenWeather: Live weather data for analysis
              <br />✓ Gemini: AI explanations for recommendations
              <br />✓ All keys stored locally (not shared)
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isSaving ? 'Saving...' : 'Save Keys'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
