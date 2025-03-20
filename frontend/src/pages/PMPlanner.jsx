import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Table } from "../components/ui/table";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx"; // ✅ Import XLSX for Excel support

// ✅ Use Environment Variable for Backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"; 

export default function PMPlanner() {
  const [assetData, setAssetData] = useState({
    name: "",
    model: "",
    serial: "",
    category: "",
    hours: "",
    cycles: "",
    environment: "",
  });

  const [pmPlan, setPmPlan] = useState([]); // ✅ Ensure pmPlan is always an array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setAssetData({ ...assetData, [e.target.name]: e.target.value });
  };

  const generatePMPlan = async () => {
    setLoading(true);
    setPmPlan([]);
    setError(null);

    try {
      console.log("📤 Sending request to backend:", assetData);
      const response = await axios.post(`${API_BASE_URL}/generate_pm_plan`, assetData);

      if (response.data && response.data.data && Array.isArray(response.data.data.maintenance_plan)) {
        setPmPlan(response.data.data.maintenance_plan);
        console.log("✅ Successfully received PM plan:", response.data.data.maintenance_plan);
      } else {
        console.error("❌ Unexpected API response format:", response.data);
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("❌ Error generating PM plan:", error);
      setError("Failed to generate PM plan. Please check your connection and backend logs.");
    }

    setLoading(false);
  };

  // ✅ Convert PM Plan to CSV Format
  const exportToCSV = () => {
    if (pmPlan.length === 0) {
      alert("No PM plan available to export.");
      return;
    }

    let csvContent = "Task,Interval,Instructions,Reason\n";
    pmPlan.forEach((task) => {
      csvContent += `"${task.task_name}","${task.maintenance_interval}","${task.instructions?.join("; ") || "N/A"}","${task.reason}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "pm_plan.csv");
  };

  // ✅ Convert PM Plan to Excel Format
  const exportToExcel = () => {
    if (pmPlan.length === 0) {
      alert("No PM plan available to export.");
      return;
    }

    const data = [["Task", "Interval", "Instructions", "Reason"]];
    pmPlan.forEach((task) => {
      data.push([
        task.task_name,
        task.maintenance_interval,
        task.instructions?.join("; ") || "N/A",
        task.reason,
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PM Plan");

    XLSX.writeFile(wb, "pm_plan.xlsx");
  };

  return (
    <div className="container mx-auto p-6">
      {/* ✅ Asset Data Input */}
      <Card title="Asset Data Input">
        <div className="grid grid-cols-2 gap-4">
          <Input name="name" placeholder="Asset Name" onChange={handleInputChange} />
          <Input name="model" placeholder="Make & Model" onChange={handleInputChange} />
          <Input name="serial" placeholder="Serial Number" onChange={handleInputChange} />
          <Input name="category" placeholder="Asset Category" onChange={handleInputChange} />
          <Input name="hours" placeholder="Usage Hours" type="number" onChange={handleInputChange} />
          <Input name="cycles" placeholder="Usage Cycles" type="number" onChange={handleInputChange} />
          <Input name="environment" placeholder="Environmental Conditions" onChange={handleInputChange} />
          <Button onClick={generatePMPlan} disabled={loading}>
            {loading ? "Generating..." : "Generate AI-Powered PM Plan"}
          </Button>
        </div>
      </Card>

      {/* ✅ Show Error Message if API Call Fails */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* ✅ AI-Powered PM Plan Table with Loading Indicator */}
      <Card title="AI-Powered PM Plan" className="mt-6">
        {loading ? (
          <div className="text-center p-4">
            <span className="loader"></span>
            <p className="mt-2 text-gray-600">Generating PM Plan... Please wait.</p>
          </div>
        ) : pmPlan.length > 0 ? (
          <Table
            headers={["Task", "Interval", "Instructions", "Reason"]}
            data={pmPlan.map((task) => [
              task.task_name,
              task.maintenance_interval,
              task.instructions?.join("; ") || "N/A",
              task.reason,
            ])}
          />
        ) : (
          <p>No PM Plan Generated Yet</p>
        )}
      </Card>

      {/* ✅ Export & Integration Section */}
      <Card title="Export & Integration" className="mt-6">
        <div className="flex gap-4">
          <Button onClick={exportToCSV}>Download as CSV ⬇️</Button>
          <Button onClick={exportToExcel}>Download as Excel 📊</Button>
        </div>
      </Card>
    </div>
  );
}
