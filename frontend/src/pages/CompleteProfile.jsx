
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { completeProfile, getCurrentUser } from "../api";
import { useAuth } from "../hooks/useAuth";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    full_name: "",
    company_name: "",
    industry: "",
    company_size: "",
    email: user?.email || "",
    role: "user"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error("You must be logged in to complete your profile");
      }

      await completeProfile(currentUser.id, formData);
      navigate("/company-overview");
    } catch (error) {
      console.error("❌ Profile completion error:", error.message);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Complete Your Profile</h1>
        
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="" disabled>Select Industry</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="construction">Construction</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="retail">Retail</option>
              <option value="technology">Technology</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="company_size" className="block text-sm font-medium text-gray-700">
              Company Size
            </label>
            <select
              id="company_size"
              name="company_size"
              value={formData.company_size}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="" disabled>Select Company Size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501+">501+ employees</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-md bg-blue-600 py-2 text-white transition duration-300 ${
              isSubmitting ? "cursor-not-allowed opacity-70" : "hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Complete Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
