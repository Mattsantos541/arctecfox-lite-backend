import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PMPlanner from "./pages/PMPlanner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PMPlanner />} />
      </Routes>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

export default App;
