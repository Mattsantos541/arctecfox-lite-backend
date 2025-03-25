import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Table } from "../components/ui/table";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

// ✅ Use proxy-friendly base URL
const API_BASE_URL = "http://0.0.0.0:8000/api";


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

  const [pmPlan, setPmPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssetData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generatePMPlan = async () => {
    setLoading(true);
    setPmPlan([]);
    setError(null);

    try {
      // Cast hours and cycles to int before sending (if not empty)
      const payload = {
        ...assetData,
        hours: assetData.hours ? parseInt(assetData.hours) : 0,
        cycles: assetData.cycles ? parseInt(assetData.cycles) : 0,
      };

      console.log("📤 Payload:", payload);

      const response = await axios.post(`${API_BASE_URL}/generate_pm_plan`, payload);

      if (response.data?.data?.maintenance_plan) {
        setPmPlan(response.data.data.maintenance_plan);
        console.log("✅ Received PM Plan:", response.data.data.maintenance_plan);
      } else {
        throw new Error("Invalid API response");
      }
    } catch (err) {
      console.error("❌ Error generating PM plan:", err);
      setError("Failed to generate PM plan. Check your input and backend logs.");
    }

    setLoading(false);
  };

  const exportToCSV = () => {
    if (pmPlan.length === 0) return alert("No PM plan to export.");
    let csv = "Task,Interval,Instructions,Reason\n";
    pmPlan.forEach((t) => {
      csv += `"${t.task_name}","${t.maintenance_interval}","${t.instructions?.join("; ") ?? ""}","${t.reason}"\n`;
    });
    saveAs(new Blob([csv], { type: "text/csv;charset=utf-8;" }), "pm_plan.csv");
  };

  const exportToExcel = () => {
    if (pmPlan.length === 0) return alert("No PM plan to export.");
    const data = [["Task", "Interval", "Instructions", "Reason"]];
    pmPlan.forEach((t) =>
      data.push([
        t.task_name,
        t.maintenance_interval,
        t.instructions?.join("; ") ?? "",
        t.reason,
      ])
    );
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PM Plan");
    XLSX.writeFile(wb, "pm_plan.xlsx");
  };

  return (
    <div className="container mx-auto p-6">
      <Card title="Asset Data Input">
        <div className="grid grid-cols-2 gap-4">
          <Input name="name" value={assetData.name} placeholder="Asset Name" onChange={handleInputChange} />
          <Input name="model" value={assetData.model} placeholder="Make & Model" onChange={handleInputChange} />
          <Input name="serial" value={assetData.serial} placeholder="Serial Number" onChange={handleInputChange} />
          <Input name="category" value={assetData.category} placeholder="Asset Category" onChange={handleInputChange} />
          <Input name="hours" value={assetData.hours} placeholder="Usage Hours" type="number" onChange={handleInputChange} />
          <Input name="cycles" value={assetData.cycles} placeholder="Usage Cycles" type="number" onChange={handleInputChange} />
          <Input name="environment" value={assetData.environment} placeholder="Environmental Conditions" onChange={handleInputChange} />
          <Button onClick={generatePMPlan} disabled={loading}>
            {loading ? "Generating..." : "Generate AI-Powered PM Plan"}
          </Button>
        </div>
      </Card>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <Card title="AI-Powered PM Plan" className="mt-6">
        {loading ? (
          <div className="text-center p-4">
            <span className="loader" />
            <p className="mt-2 text-gray-600">Generating PM Plan... Please wait.</p>
          </div>
        ) : pmPlan.length > 0 ? (
          <Table
            headers={["Task", "Interval", "Instructions", "Reason"]}
            data={pmPlan.map((task) => [
              task.task_name,
              task.maintenance_interval,
              task.instructions?.join("; ") ?? "N/A",
              task.reason,
            ])}
          />
        ) : (
          <p>No PM Plan Generated Yet</p>
        )}
      </Card>

      <Card title="Export & Integration" className="mt-6">
        <div className="flex gap-4">
          <Button onClick={exportToCSV}>Download as CSV ⬇️</Button>
          <Button onClick={exportToExcel}>Download as Excel 📊</Button>
        </div>
      </Card>
    </div>
  );
}
