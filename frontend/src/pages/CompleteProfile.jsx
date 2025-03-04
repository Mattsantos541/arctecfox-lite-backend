import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { completeProfile } from "../api"; 

function CompleteProfile() {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("1-10");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await completeProfile(fullName, companyName, industry, companySize);
      navigate("/company-overview");
    } catch (err) {
      setError(err.message);
      console.error("❌ Profile Completion Error:", err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">Complete Your Profile</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="text" required className="block w-full p-3 border rounded-md"
            placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input type="text" required className="block w-full p-3 border rounded-md"
            placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          <input type="text" required className="block w-full p-3 border rounded-md"
            placeholder="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
          <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-md">Complete Profile</button>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfile;
