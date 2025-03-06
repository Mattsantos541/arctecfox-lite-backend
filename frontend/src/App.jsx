
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import CompanyOverview from "./pages/CompanyOverview";
import Login from "./pages/Login";
import PMPlanner from "./pages/PMPlanner";
import WorkOrders from "./pages/WorkOrders";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import CompleteProfile from "./pages/CompleteProfile";
import { AuthProvider } from "./hooks/useAuth";
import { getCurrentUser, isProfileComplete, onAuthStateChange } from "./api";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          navigate("/login"); // Not authenticated → Send to login
          return;
        }
        
        const profileCompleted = await isProfileComplete(user.id);
        if (!profileCompleted) {
          navigate("/complete-profile"); // Profile not completed → Send to profile completion
          return;
        }
        
        setChecking(false);
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/login");
      }
    };

    checkUser();
  }, [navigate]);

  if (checking) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return children;
}

function AuthRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    const subscription = onAuthStateChange(async (user) => {
      if (user) {
        const profileCompleted = await isProfileComplete(user.id);
        navigate(profileCompleted ? "/company-overview" : "/complete-profile");
      } else {
        navigate("/login");
      }
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [navigate]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <AuthRoutes />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />

        {/* Protected Routes: User must be logged in */}
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/company-overview" replace />} />
          <Route path="/company-overview" element={<CompanyOverview />} />
          <Route path="/pm-planner" element={<PMPlanner />} />
          <Route path="/work-orders" element={<WorkOrders />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
