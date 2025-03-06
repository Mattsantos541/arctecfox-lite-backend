import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { completeProfile, getCurrentUser } from "../api";

function CompleteProfile() {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("1-10");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (!user) {
        navigate("/login"); // Redirect if not authenticated
      }
    };
    checkUser();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await completeProfile(fullName, companyName, industry, companySize);
      alert("✅ Profile completed successfully!");
      navigate("/company-overview"); // Redirect to dashboard
    } catch (err) {
      setError(err.message);
      console.error("❌ Error completing profile:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">Complete Your Profile</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            required
            className="block w-full p-3 border rounded-md"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="text"
            required
            className="block w-full p-3 border rounded-md"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <input
            type="text"
            required
            className="block w-full p-3 border rounded-md"
            placeholder="Industry (e.g., Construction, Manufacturing)"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
          <select
            className="block w-full p-3 border rounded-md"
            value={companySize}
            onChange={(e) => setCompanySize(e.target.value)}
          >
            <option value="1-10">1-10 Employees</option>
            <option value="11-50">11-50 Employees</option>
            <option value="51-200">51-200 Employees</option>
            <option value="201+">201+ Employees</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-blue-600 text-white rounded-md"
          >
            {loading ? "Processing..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfile;
