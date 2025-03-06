
import React, { useState, useEffect } from "react";
import { isProfileComplete } from "./api";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import CompanyOverview from "./pages/CompanyOverview";
import Login from "./pages/Login";
import CompleteProfile from "./pages/CompleteProfile";
import PMPlanner from "./pages/PMPlanner";
import WorkOrders from "./pages/WorkOrders";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import { AuthProvider, useAuth } from "./hooks/useAuth";

// Protected route component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

// Profile check route
function ProfileCheckRoute({ children }) {
  const { user, loading } = useAuth();
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  
  useEffect(() => {
    const checkProfile = async () => {
      if (user) {
        try {
          const isComplete = await isProfileComplete(user.id);
          setProfileComplete(isComplete);
        } catch (error) {
          console.error("Profile check error:", error);
        } finally {
          setCheckingProfile(false);
        }
      }
    };
    
    if (!loading) {
      checkProfile();
    }
  }, [user, loading]);
  
  if (loading || checkingProfile) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!profileComplete) {
    return <Navigate to="/complete-profile" />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="/" element={<CompanyOverview />} />
            <Route path="/company-overview" element={<CompanyOverview />} />
            <Route path="/pm-planner" element={<PMPlanner />} />
            <Route path="/work-orders" element={<WorkOrders />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
