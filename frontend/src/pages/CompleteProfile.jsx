import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { completeUserProfile, getCurrentUser } from "../api"; // Ensure correct import
import { useAuth } from "../hooks/useAuth"; // Ensure that this is correct

function CompleteProfile() {
  const [formData, setFormData] = useState({
    full_name: "",
    role: "",
    company_name: "",
    industry: "",
    company_size: "",
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          setError("Please log in again.");
          setLoading(false);
          return;
        }
        setUser(currentUser);
        setLoading(false);
      } catch (err) {
        console.error("❌ Get user error:", err);
        setError("Authentication error. Please log in again.");
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Include user ID if needed
    const updatedData = { ...formData, user_id: user.id };

    try {
      await completeUserProfile(updatedData); // Ensure you pass the correct data
      alert("Profile updated successfully!");
      navigate("/company-overview");
    } catch (err) {
      console.error("❌ Profile completion error:", err);
      setError("Failed to complete profile. Please try again.");
    }
  };

  if (loading) return <p className="text-center text-gray-700">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-900">Complete Your Profile</h2>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg">
        <input type="text" name="full_name" placeholder="Full Name" className="w-full border p-2 rounded" onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} required />
        <input type="text" name="role" placeholder="Role" className="w-full border p-2 rounded" onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
        <input type="text" name="company_name" placeholder="Company Name" className="w-full border p-2 rounded" onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} required />
        <input type="text" name="industry" placeholder="Industry" className="w-full border p-2 rounded" onChange={(e) => setFormData({ ...formData, industry: e.target.value })} required />
        <input type="text" name="company_size" placeholder="Company Size" className="w-full border p-2 rounded" onChange={(e) => setFormData({ ...formData, company_size: e.target.value })} required />

        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600">
          Complete Profile
        </button>
      </form>
    </div>
  );
}

export default CompleteProfile;