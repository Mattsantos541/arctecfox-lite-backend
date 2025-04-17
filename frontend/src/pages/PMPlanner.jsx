import { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import MainLayout from "../layouts/MainLayout";

// ----- Reusable UI Components -----
function Input({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col mb-2">
      {label && <label className="font-medium mb-1">{label}</label>}
      <input
        className="border border-gray-300 rounded px-2 py-1"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

function Button({ onClick, children, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white shadow rounded p-4 mb-4">
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      {children}
    </div>
  );
}
// -----------------------------------

const API_BASE_URL = "/api";

export default function PMPlanner() {
  const [userInfo, setUserInfo] = useState({ email: "", company: "" });
  const [assetData, setAssetData] = useState({
    name: "",
    model: "",
    serial: "",
    category: "",
    hours: "",
    cycles: "",
    environment: "",
    date_of_plan_start: "", // NEW
  });

  const [pmPlan, setPmPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssetData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const generatePMPlan = async () => {
    setLoading(true);
    setError(null);
    setPmPlan([]);

    try {
      const payload = {
        ...assetData,
        hours: parseInt(assetData.hours || 0),
        cycles: parseInt(assetData.cycles || 0),
        email: userInfo.email || null,
        company: userInfo.company || null,
      };

      const response = await axios.post(`${API_BASE_URL}/generate_pm_plan`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.data?.data?.maintenance_plan) {
        setPmPlan(response.data.data.maintenance_plan);
      } else {
        throw new Error("Invalid response format from API.");
      }
    } catch (err) {
      console.error("Error generating PM plan:", err);
      setError("Something went wrong while generating the PM plan.");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(pmPlan);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "PMPlan.csv");
  };

  const exportToExcel = () => {
    const flattenedData = [];

    pmPlan.forEach((task) => {
      if (Array.isArray(task.scheduled_dates)) {
        task.scheduled_dates.forEach((date) => {
          flattenedData.push({
            "Scheduled Date": date,
            "Task Name": task.task_name,
            "Maintenance Interval": task.maintenance_interval,
            "Instructions": Array.isArray(task.instructions) ? task.instructions.join(" | ") : task.instructions,
            "Reason": task.reason,
            "Common Failures Prevented": task.common_failures_prevented,
            "Engineering Rationale": task.engineering_rationale,
            "Safety Precautions": task.safety_precautions,
          });
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PM Schedule");
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "Chronological_PM_Schedule.xlsx");
  };

  return (
    <MainLayout>
      {/* Contact Info */}
      <Card title="Optional Contact Info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email (optional)"
            name="email"
            value={userInfo.email}
            onChange={handleUserInfoChange}
            placeholder="e.g. jane@factory.com"
          />
          <Input
            label="Company (optional)"
            name="company"
            value={userInfo.company}
            onChange={handleUserInfoChange}
            placeholder="e.g. XYZ Manufacturing"
          />
        </div>
      </Card>

      {/* Asset Input */}
      <Card title="Asset Data Input">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Asset Name" name="name" value={assetData.name} onChange={handleInputChange} placeholder="e.g. Hydraulic Pump" />
          <Input label="Model" name="model" value={assetData.model} onChange={handleInputChange} placeholder="e.g. XJ-2000" />
          <Input label="Serial Number" name="serial" value={assetData.serial} onChange={handleInputChange} placeholder="e.g. SN12345" />
          <Input label="Asset Category" name="category" value={assetData.category} onChange={handleInputChange} placeholder="e.g. Pump" />
          <Input label="Usage Hours" name="hours" value={assetData.hours} onChange={handleInputChange} placeholder="e.g. 1200" type="number" />
          <Input label="Usage Cycles" name="cycles" value={assetData.cycles} onChange={handleInputChange} placeholder="e.g. 300" type="number" />
          <Input label="Environmental Condition" name="environment" value={assetData.environment} onChange={handleInputChange} placeholder="e.g. Outdoor, dusty" />
          <Input label="Plan Start Date" name="date_of_plan_start" value={assetData.date_of_plan_start} onChange={handleInputChange} type="date" />
        </div>

        <div className="mt-4">
          <Button onClick={generatePMPlan} disabled={loading}>
            {loading ? "Generating..." : "Generate AI-Powered PM Plan"}
          </Button>
        </div>
      </Card>

      {/* PM Plan Preview */}
      <Card title="AI-Powered PM Plan">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <svg className="animate-spin h-5 w-5 mr-3 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-gray-700">Generating PM Plan...</span>
          </div>
        ) : pmPlan.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b">Task</th>
                  <th className="px-4 py-2 border-b">Interval</th>
                  <th className="px-4 py-2 border-b">Instructions</th>
                  <th className="px-4 py-2 border-b">Scheduled Dates</th>
                  <th className="px-4 py-2 border-b">Reason</th>
                  <th className="px-4 py-2 border-b">Failures Prevented</th>
                  <th className="px-4 py-2 border-b">Rationale</th>
                  <th className="px-4 py-2 border-b">Safety</th>
                </tr>
              </thead>
              <tbody>
                {pmPlan.map((task, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2">{task.task_name}</td>
                    <td className="px-4 py-2">{task.maintenance_interval}</td>
                    <td className="px-4 py-2">
                      {Array.isArray(task.instructions) ? (
                        <ul className="list-disc list-inside">
                          {task.instructions.map((instr, idx) => (
                            <li key={idx}>{instr}</li>
                          ))}
                        </ul>
                      ) : (
                        task.instructions
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {Array.isArray(task.scheduled_dates) ? (
                        <ul className="list-disc list-inside">
                          {task.scheduled_dates.map((date, idx) => (
                            <li key={idx}>{date}</li>
                          ))}
                        </ul>
                      ) : (
                        task.scheduled_dates
                      )}
                    </td>
                    <td className="px-4 py-2">{task.reason}</td>
                    <td className="px-4 py-2">{task.common_failures_prevented}</td>
                    <td className="px-4 py-2">{task.engineering_rationale}</td>
                    <td className="px-4 py-2">{task.safety_precautions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No PM Plan generated yet.</p>
        )}
      </Card>

      {/* Export Options */}
      <Card title="Export PM Plan">
        <div className="flex space-x-4">
          <Button onClick={exportToCSV} disabled={pmPlan.length === 0}>Download as CSV</Button>
          <Button onClick={exportToExcel} disabled={pmPlan.length === 0}>Download Excel (Chronological)</Button>
        </div>
      </Card>

      {/* Error Message */}
      {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mt-4">{error}</div>}
    </MainLayout>
  );
}
