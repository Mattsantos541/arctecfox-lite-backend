import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp } from "../api"; // Ensure this import is correct

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("1-10");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await signUp(email, password, fullName, companyName, industry, companySize);
      } else {
        await signIn(email, password);
      }
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
        <h2 className="text-center text-3xl font-bold text-gray-900">
          {isSignUp ? "Create an Account" : "Sign In"}
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <input type="text" required className="block w-full p-3 border rounded-md"
                placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <input type="text" required className="block w-full p-3 border rounded-md"
                placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              <input type="text" required className="block w-full p-3 border rounded-md"
                placeholder="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
              <select className="block w-full p-3 border rounded-md" value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}>
                <option value="1-10">1-10 Employees</option>
                <option value="11-50">11-50 Employees</option>
                <option value="51-200">51-200 Employees</option>
                <option value="201+">201+ Employees</option>
              </select>
            </>
          )}
          <input type="email" required className="block w-full p-3 border rounded-md"
            placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" required className="block w-full p-3 border rounded-md"
            placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {isSignUp && (
            <input type="password" required className="block w-full p-3 border rounded-md"
              placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          )}
          <button type="submit" disabled={loading} className="w-full p-3 bg-blue-600 text-white rounded-md">
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="text-center">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-600">
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;