import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import CompanyOverview from "./pages/CompanyOverview";
import Login from "./pages/Login";
import PMPlanner from "./pages/PMPlanner";
import WorkOrders from "./pages/WorkOrders";
import Settings from "./pages/Settings";

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<CompanyOverview />} /> {/* ✅ Default to Company Overview */}
                    <Route path="/company-overview" element={<CompanyOverview />} />
                    <Route path="/pm-planner" element={<PMPlanner />} />
                    <Route path="/work-orders" element={<WorkOrders />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
