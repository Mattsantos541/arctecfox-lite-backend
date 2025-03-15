import React, { useState, useEffect } from "react";
import axios from "axios";

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

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token is missing. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api/user-session", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.data.user) {
          setError("User session is missing. Please log in again.");
          setLoading(false);
          return;
        }

        setUser(response.data.user);
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
    const token = localStorage.getItem("token");

    if (!token) {
      setError("User session is missing. Please log in again.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/complete-profile",
        { user_id: user.id, email: user.email, ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profile updated successfully!");
      window.location.href = "/dashboard";
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
