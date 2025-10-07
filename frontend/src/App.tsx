import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import IssuePage from "./pages/IssuePage";
import VerifyPage from "./pages/VerifyPage";

function App() {
  return (
    <Router>
      <nav>
        <div className="logo">Kube Credential</div>
        <div>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Issue
          </NavLink>
          <NavLink
            to="/verify"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Verify
          </NavLink>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<IssuePage />} />
        <Route path="/verify" element={<VerifyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
