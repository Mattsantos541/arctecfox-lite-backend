import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const PMPlanner = () => {
  const [assetData, setAssetData] = useState({
    name: "",
    model: "",
    serial: "",
    category: "",
    hours: 0,
    cycles: 0,
    environment: "",
    email: "",
    company: ""
  });

  const [planText, setPlanText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setAssetData({
      ...assetData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setPlanText("");

    try {
      const response = await fetch("/api/generate_pm_plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assetData),
      });

      const result = await response.json();

      if (result.status === "success") {
        setPlanText(result.data.maintenance_plan_text);
      } else {
        setError("Failed to generate PM plan: " + result.message);
      }
    } catch (err) {
      setError("Error connecting to API: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadTxtFile = () => {
    const blob = new Blob([planText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${assetData.name.replace(/\s+/g, "_")}_PM_Plan.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI-Powered PM Planner</h1>

      <div className="grid gap-4">
        <input type="text" name="name" placeholder="Asset Name" className="input" value={assetData.name} onChange={handleChange} />
        <input type="text" name="model" placeholder="Model" className="input" value={assetData.model} onChange={handleChange} />
        <input type="text" name="serial" placeholder="Serial Number" className="input" value={assetData.serial} onChange={handleChange} />
        <input type="text" name="category" placeholder="Asset Category" className="input" value={assetData.category} onChange={handleChange} />
        <input type="number" name="hours" placeholder="Usage Hours" className="input" value={assetData.hours} onChange={handleChange} />
        <input type="number" name="cycles" placeholder="Usage Cycles" className="input" value={assetData.cycles} onChange={handleChange} />
        <input type="text" name="environment" placeholder="Environmental Conditions" className="input" value={assetData.environment} onChange={handleChange} />
        <input type="email" name="email" placeholder="Your Email (Optional)" className="input" value={assetData.email} onChange={handleChange} />
        <input type="text" name="company" placeholder="Company (Optional)" className="input" value={assetData.company} onChange={handleChange} />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate PM Plan"}
        </button>
      </div>

      {loading && (
        <div className="flex items-center mt-4 text-blue-600">
          <svg className="animate-spin h-5 w-5 mr-2 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Generating PM Plan...
        </div>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {planText && (
        <div className="mt-6 p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Generated PM Plan</h2>
          <ReactMarkdown className="prose whitespace-pre-wrap">{planText}</ReactMarkdown>

          <button
            onClick={downloadTxtFile}
            className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Download as TXT
          </button>
        </div>
      )}
    </div>
  );
};

export default PMPlanner;
