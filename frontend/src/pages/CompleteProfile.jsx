
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { completeProfile, getCurrentUser } from "../api";

function CompleteProfile() {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (!user) {
        navigate("/login");
      }
    };
    checkUser();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await completeProfile(fullName, companyName, industry, companySize);
      navigate("/company-overview");
    } catch (err) {
      setError(err.message);
      console.error("❌ Profile completion error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg space-y-8 rounded-xl bg-white p-10 shadow-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Complete Your Profile
        </h2>
        <p className="text-center text-gray-600">
          Please provide additional information to complete your setup.
        </p>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              required
              className="mt-1 block w-full p-3 border rounded-md"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              id="companyName"
              type="text"
              required
              className="mt-1 block w-full p-3 border rounded-md"
              placeholder="ACME Corporation"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <select
              id="industry"
              required
              className="mt-1 block w-full p-3 border rounded-md"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            >
              <option value="">Select Industry</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="retail">Retail</option>
              <option value="construction">Construction</option>
              <option value="technology">Technology</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
              Company Size
            </label>
            <select
              id="companySize"
              required
              className="mt-1 block w-full p-3 border rounded-md"
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
            >
              <option value="">Select Company Size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501+">501+ employees</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-blue-600 text-white rounded-md"
          >
            {loading ? "Processing..." : "Complete Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfile;
