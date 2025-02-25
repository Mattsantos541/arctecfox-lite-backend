import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import CompanyOverview from "./pages/CompanyOverview"; // Updated name
import Login from "./pages/Login";
import PMPlanner from "./pages/PMPlanner";
import WorkOrders from "./pages/WorkOrders";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function App() {
    return (
        <Router>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<CompanyOverview />} /> {/* Default to Company Overview */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/company-overview" element={<CompanyOverview />} />
                    <Route path="/pm-planner" element={<PMPlanner />} />
                    <Route path="/work-orders" element={<WorkOrders />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </MainLayout>
        </Router>
    );
}

export default App;
