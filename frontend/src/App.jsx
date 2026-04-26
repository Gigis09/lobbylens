import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CompanyProfile from "./pages/CompanyProfile";
import IssueBreakdown from "./pages/IssueBreakdown";
import DataTransparency from "./pages/DataTransparency";
import PrototypeDashboard from "../projectFrontend/Dashboard.jsx";
import PrototypeComparison from "../projectFrontend/Comparison.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="company/:id" element={<CompanyProfile />} />
          <Route path="issues" element={<IssueBreakdown />} />
          <Route path="transparency" element={<DataTransparency />} />
          <Route path="prototype/dashboard" element={<PrototypeDashboard />} />
          <Route path="prototype/comparison" element={<PrototypeComparison />} />
          <Route path="/companies" element={<CompanyDirectory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
