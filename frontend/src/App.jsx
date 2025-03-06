import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import CompanyOverview from "./pages/CompanyOverview";
import Login from "./pages/Login";
import PMPlanner from "./pages/PMPlanner";
import WorkOrders from "./pages/WorkOrders";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import CompleteProfile from "./pages/CompleteProfile"; // Import the new Complete Profile page
import { AuthProvider } from './hooks/useAuth';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Authentication Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/complete-profile" element={<CompleteProfile />} />

                    {/* Protected Routes */}
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<CompanyOverview />} />
                        <Route path="/company-overview" element={<CompanyOverview />} />
                        <Route path="/pm-planner" element={<PMPlanner />} />
                        <Route path="/work-orders" element={<WorkOrders />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
