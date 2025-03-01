import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, getUserProfile } from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await signIn(email, password);
      const userProfile = await getUserProfile(user.id); // Fetch profile

      console.log("✅ User Profile Loaded:", userProfile);

      navigate("/company-overview");
    } catch (err) {
      setError(err.message);
      console.error("❌ Authentication Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">Sign In</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            className="block w-full p-3 border rounded-t-md"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            className="block w-full p-3 border rounded-b-md"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Processing..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
