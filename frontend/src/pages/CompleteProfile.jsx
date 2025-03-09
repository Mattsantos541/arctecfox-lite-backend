import React, { useState, useEffect } from "react";
import axios from "axios";

function CompleteProfile() {
  const [formData, setFormData] = useState({
    full_name: "",
    role: "",
    company_name: "",
    industry: "",
    company_size: "",
    address: "",
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user session
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/user-session"); // Fetch user session
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      setError("User session is missing. Please log in again.");
      return;
    }

    try {
      const response = await axios.post("/complete-profile", {
        user_id: user.id,
        email: user.email,
        ...formData
      });

      alert("Profile updated successfully!");
      window.location.href = "/dashboard"; // Redirect
    } catch (err) {
      console.error("❌ Profile completion error:", err.response?.data?.detail || err.message);
      setError(err.response?.data?.detail || "An error occurred. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-900">Complete Your Profile</h2>
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="full_name" placeholder="Full Name" className="w-full border p-2 rounded" onChange={handleChange} required />
        <input type="text" name="role" placeholder="Role" className="w-full border p-2 rounded" onChange={handleChange} required />
        <input type="text" name="company_name" placeholder="Company Name" className="w-full border p-2 rounded" onChange={handleChange} required />
        <input type="text" name="industry" placeholder="Industry" className="w-full border p-2 rounded" onChange={handleChange} required />
        <input type="text" name="company_size" placeholder="Company Size" className="w-full border p-2 rounded" onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" className="w-full border p-2 rounded" onChange={handleChange} required />

        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600">
          Complete Profile
        </button>
      </form>
    </div>
  );
}

export default CompleteProfile;
