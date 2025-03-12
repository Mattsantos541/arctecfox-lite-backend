import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Table } from "../components/ui/table";
import axios from "axios";
import { saveAs } from "file-saver";

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

  const handleInputChange = (e) => {
    setAssetData({ ...assetData, [e.target.name]: e.target.value });
  };

  const generatePMPlan = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:9000/api/generate_pm_plan", assetData);
      setPmPlan(response.data.pm_plan);
    } catch (error) {
      console.error("Error generating PM plan:", error);
    }
    setLoading(false);
  };

  // Convert PM Plan to CSV Format
  const exportToCSV = () => {
    if (pmPlan.length === 0) {
      alert("No PM plan available to export.");
      return;
    }

    let csvContent = "Interval,Task,Steps,Reason\n";
    pmPlan.forEach((task) => {
      csvContent += `"${task.interval}","${task.task}","${task.steps}","${task.reason}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "pm_plan.csv");
  };

  return (
    <div className="container mx-auto p-6">
      {/* Asset Data Input */}
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

      {/* AI-Powered PM Plan Table */}
      <Card title="AI-Powered PM Plan" className="mt-6">
        {pmPlan.length > 0 ? (
          <Table
            headers={["Interval", "Task", "Steps", "Reason"]}
            data={pmPlan.map((task) => [
              task.interval,
              task.task,
              task.steps,
              task.reason,
            ])}
          />
        ) : (
          <p>No PM Plan Generated Yet</p>
        )}
        <Button className="mt-4" variant="secondary">Regenerate Plan 🔄</Button>
      </Card>

      {/* Export & Integration Section */}
      <Card title="Export & Integration" className="mt-6">
        <div className="flex gap-4">
          <Button onClick={exportToCSV}>Download as CSV ⬇️</Button>
          <Button variant="secondary">Sync to CMMS 🔄</Button>
        </div>
      </Card>
    </div>
  );
}
