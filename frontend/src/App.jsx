import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CompanyProfile from "./pages/CompanyProfile";
import IssueBreakdown from "./pages/IssueBreakdown";
import DataTransparency from "./pages/DataTransparency";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="company/:id" element={<CompanyProfile />} />
          <Route path="issues" element={<IssueBreakdown />} />
          <Route path="transparency" element={<DataTransparency />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
