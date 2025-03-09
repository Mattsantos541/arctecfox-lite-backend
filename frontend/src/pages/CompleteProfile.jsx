
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { completeProfile } from "../api";

function CompleteProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    company_name: "",
    phone_number: "",
    address: "",
    industry: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!user) {
        throw new Error("You must be logged in to complete your profile");
      }

      // Required fields validation
      if (!formData.company_name || !formData.phone_number) {
        throw new Error("Company name and phone number are required");
      }

      await completeProfile(user.id, formData);
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
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Complete Your Profile
        </h2>
        <p className="text-center text-gray-600">
          We need a few more details before you can start using the platform.
        </p>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name *</label>
            <input
              type="text"
              name="company_name"
              required
              className="mt-1 block w-full p-3 border rounded-md"
              placeholder="Your Company Name"
              value={formData.company_name}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
            <input
              type="tel"
              name="phone_number"
              required
              className="mt-1 block w-full p-3 border rounded-md"
              placeholder="(123) 456-7890"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              className="mt-1 block w-full p-3 border rounded-md"
              placeholder="123 Main St, City, State, ZIP"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Industry</label>
            <select
              name="industry"
              className="mt-1 block w-full p-3 border rounded-md"
              value={formData.industry}
              onChange={handleChange}
            >
              <option value="">Select an industry</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="construction">Construction</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="retail">Retail</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Saving..." : "Complete Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfile;
