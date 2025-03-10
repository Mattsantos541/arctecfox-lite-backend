import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
      <Card>
        <CardHeader>
          <CardTitle>Asset Data Input</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Input name="name" placeholder="Asset Name" onChange={handleInputChange} />
          <Input name="model" placeholder="Make & Model" onChange={handleInputChange} />
          <Input name="serial" placeholder="Serial Number" onChange={handleInputChange} />
          <Input name="category" placeholder="Asset Category" onChange={handleInputChange} />
          <Input name="hours" placeholder="Usage Hours" type="number" onChange={handleInputChange} />
          <Input name="cycles" placeholder="Usage Cycles" type="number" onChange={handleInputChange} />
          <Input name="environment" placeholder="Environmental Conditions" onChange={handleInputChange} />
          <Input type="file" onChange={handleFileUpload} />
          <Button onClick={generatePMPlan} disabled={loading}>
            {loading ? "Generating..." : "Generate AI-Powered PM Plan"}
          </Button>
        </CardContent>
      </Card>

      {/* AI-Powered PM Plan */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>AI-Powered PM Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Interval (Hours/Cycles)</TableHead>
                <TableHead>AI Confidence Score</TableHead>
                <TableHead>Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pmPlan.length > 0 ? (
                pmPlan.map((task, index) => (
                  <TableRow key={index}>
                    <TableCell>{task.task}</TableCell>
                    <TableCell>{task.interval}</TableCell>
                    <TableCell>{task.confidence}%</TableCell>
                    <TableCell>
                      <Button variant="outline">✏️</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="4" className="text-center">
                    No PM Plan Generated Yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Button className="mt-4" variant="secondary">
            Regenerate Plan 🔄
          </Button>
        </CardContent>
      </Card>

      {/* Export & Integration */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Export & Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="mr-4">Download as CSV ⬇️</Button>
          <Button>Sync to CMMS 🔄</Button>
        </CardContent>
      </Card>
    </div>
  );
}
