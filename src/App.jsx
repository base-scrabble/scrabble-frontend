// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Waitlist from "./pages/Waitlist";
import Success from "./pages/Success";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Redirect root to /waitlist */}
          <Route path="/" element={<Navigate to="/waitlist" replace />} />

          {/* Pages */}
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/success" element={<Success />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/game" element={<Game />} />
          <Route path="/profile" element={<Profile />} />

          {/* Catch-all → waitlist */}
          <Route path="*" element={<Navigate to="/waitlist" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
