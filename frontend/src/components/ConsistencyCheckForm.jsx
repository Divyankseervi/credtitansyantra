import { useState } from "react";

export default function ConsistencyCheckForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    surveyNumber: "",
    declaredUse: "Agricultural",
    state: "",
    avgNDVI: 0.5,
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const states = [
    "Tamil Nadu",
    "Karnataka",
    "Telangana",
    "Andhra Pradesh",
    "Telugu",
  ];

  const landUseOptions = ["Agricultural", "Residential", "Commercial", "Industrial"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNDVIChange = (e) => {
    const value = parseFloat(e.target.value);
    setFormData((prev) => ({
      ...prev,
      avgNDVI: isNaN(value) ? 0 : Math.min(1, Math.max(-1, value)),
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilePreview(event.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.surveyNumber.trim() || !formData.state) {
      alert("Please fill in all required fields");
      return;
    }

    onSubmit({
      ...formData,
      avgNDVI: parseFloat(formData.avgNDVI),
      polygonCoordinates: [],
      uploadedFile: uploadedFile,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Survey Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Survey Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="surveyNumber"
          value={formData.surveyNumber}
          onChange={handleInputChange}
          placeholder="e.g., 45/2"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter the unique survey number from land records
        </p>
      </div>

      {/* State Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          State <span className="text-red-500">*</span>
        </label>
        <select
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          disabled={isLoading}
        >
          <option value="">Select a state</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* Declared Land Use */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Declared Land Use <span className="text-red-500">*</span>
        </label>
        <select
          name="declaredUse"
          value={formData.declaredUse}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          disabled={isLoading}
        >
          {landUseOptions.map((use) => (
            <option key={use} value={use}>
              {use}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          As stated in your land documents
        </p>
      </div>

      {/* NDVI Value */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          NDVI Value (Normalized Difference Vegetation Index)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            name="avgNDVI"
            min="-1"
            max="1"
            step="0.05"
            value={formData.avgNDVI}
            onChange={handleNDVIChange}
            className="flex-1"
            disabled={isLoading}
          />
          <input
            type="number"
            min="-1"
            max="1"
            step="0.05"
            value={formData.avgNDVI.toFixed(2)}
            onChange={handleNDVIChange}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            disabled={isLoading}
          />
        </div>
        <div className="text-xs text-gray-500 mt-2 space-y-1">
          <p>
            <strong>NDVI Interpretation:</strong>
          </p>
          <p>
            <span className="inline-block w-4 h-4 bg-green-600 rounded mr-2"></span>
            {">"} 0.5 = Agricultural
          </p>
          <p>
            <span className="inline-block w-4 h-4 bg-yellow-500 rounded mr-2"></span>
            0.2 - 0.5 = Residential/Mixed
          </p>
          <p>
            <span className="inline-block w-4 h-4 bg-red-600 rounded mr-2"></span>
            {"<"} 0.2 = Industrial/Built-up
          </p>
        </div>
      </div>

      {/* Document Upload */}
      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          📄 Upload Land Documents
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Upload land deed, survey documents, or property proof for fraud detection
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-emerald-500 transition">
          <input
            type="file"
            id="document"
            onChange={handleFileUpload}
            disabled={isLoading}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
          <label
            htmlFor="document"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <span className="text-2xl">📎</span>
            <span className="text-sm font-medium text-gray-700">
              Click to upload or drag and drop
            </span>
            <span className="text-xs text-gray-500">
              PDF, JPG, PNG, DOC (Max 5MB)
            </span>
          </label>
        </div>

        {/* File Preview */}
        {uploadedFile && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✔</span>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>

            {filePreview && (
              <div className="mt-3">
                <img
                  src={filePreview}
                  alt="Document preview"
                  className="max-h-32 rounded border border-gray-300"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {isLoading ? "Checking Consistency..." : "Check Consistency"}
      </button>
    </form>
  );
}
