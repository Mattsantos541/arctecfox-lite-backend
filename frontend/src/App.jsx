import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import CompanyOverview from "./pages/CompanyOverview"; 
import Login from "./pages/Login";
import PMPlanner from "./pages/PMPlanner";
import WorkOrders from "./pages/WorkOrders";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import { AuthProvider } from './hooks/useAuth'; // Added import for AuthProvider


function App() {
    return (
        <Router>
            <AuthProvider> {/* Wrapped Routes with AuthProvider */}
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<CompanyOverview />} />
                        <Route path="/company-overview" element={<CompanyOverview />} />
                        <Route path="/pm-planner" element={<PMPlanner />} />
                        <Route path="/work-orders" element={<WorkOrders />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>
                </Routes>
            </AuthProvider> {/* Closed AuthProvider */}
        </Router>
    );
}

export default App;

//File: ./hooks/useAuth.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  //  In a real application, you would fetch user data here from Supabase or another auth provider.
  //  This is a placeholder.
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = { user, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};