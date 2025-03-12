import { useState } from "react";
import { Input } from "../components/ui/input";  // ✅ Fixed Import
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Table } from "../components/ui/table";
import axios from "axios";

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
  const [file, setFile] = useState(null);
  const [pmPlan, setPmPlan] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setAssetData({ ...assetData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const generatePMPlan = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/generate_pm_plan", assetData);
      setPmPlan(response.data.pm_plan);
    } catch (error) {
      console.error("Error generating PM plan:", error);
    }
    setLoading(false);
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
          <Input type="file" onChange={handleFileUpload} />
          <Button onClick={generatePMPlan} disabled={loading}>
            {loading ? "Generating..." : "Generate PM Plan"}
          </Button>
        </div>
      </Card>

      {/* AI-Powered PM Plan */}
      <Card title="AI-Powered PM Plan" className="mt-6">
        <Table
          headers={["Task", "Interval (Hours/Cycles)", "AI Confidence Score", "Edit"]}
          data={pmPlan.length > 0 ? pmPlan.map((task) => [
            task.task,
            task.interval,
            `${task.confidence}%`,
            <Button variant="outline">✏️</Button>
          ]) : [["No PM Plan Generated Yet", "", "", ""]]}
        />
        <Button className="mt-4" variant="secondary">Regenerate Plan 🔄</Button>
      </Card>

      {/* Export & Integration */}
      <Card title="Export & Integration" className="mt-6">
        <div className="flex gap-4">
          <Button>Download as CSV ⬇️</Button>
          <Button>Sync to CMMS 🔄</Button>
        </div>
      </Card>
    </div>
  );
}
