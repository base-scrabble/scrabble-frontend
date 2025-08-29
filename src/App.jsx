// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Waitlist from "./pages/Waitlist";
import Success from "./pages/Success";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to /waitlist */}
        <Route path="/" element={<Navigate to="/waitlist" replace />} />

        {/* Pages */}
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/success" element={<Success />} />

        {/* Catch-all → waitlist */}
        <Route path="*" element={<Navigate to="/waitlist" replace />} />
      </Routes>
    </Router>
  );
}

export default App;