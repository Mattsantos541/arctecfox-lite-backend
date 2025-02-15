
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement auth logic
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Welcome to ArcTecFox PM
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <input
              type="email"
              required
              className="relative block w-full rounded-t-md border p-3"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              className="relative block w-full rounded-b-md border p-3"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-md bg-[#007BFF] px-4 py-2 text-white hover:bg-[#00C2FF]"
          >
            Sign in
          </button>
          <div className="flex items-center justify-center space-x-4">
            <button type="button" className="flex items-center rounded-md border p-2">
              <img src="/google-icon.svg" alt="Google" className="h-5 w-5" />
              <span className="ml-2">Sign in with Google</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
