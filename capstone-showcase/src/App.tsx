import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { MenuProvider } from "./MenuContext";
import Menu from "./Menu";
import PreEventLandingPage from "./Pages/PreEventLandingPage";
import ComputerScience from "./Pages/ComputerScience";
import ComputerSystemsEngineering from "./Pages/ComputerSystemsEngineering";
import IndustrialEngineering from "./Pages/IndustrialEngineering";
import Survey from "./Pages/Survey";
import Informatics from "./Pages/Informatics";
import Interdisciplinary from "./Pages/Interdisciplinary";
import ElectricalEngineering from "./Pages/ElectricalEngineering";
import BiomedicalEngineering from "./Pages/BiomedicalEngineering";
import About from "./Pages/About";
import MechanicalEngineering from "./Pages/MechanicalEngineering";
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";
import EditPresentation from "./Pages/EditPresentation";
import EditSubmissions from "./Pages/EditSubmissions";
import ContactSupport from "./Pages/ContactSupport";
import Winners from "./Pages/Winners";
import ProjectDetails from "./Pages/ProjectDetails";
import { SurveyDetails } from "./Pages/SurveyDetails";
import { AuthProvider } from "./AuthContext";
import {RouteNotFound} from "./RouteNotFound";

const AppContent: React.FC = () => {
  const location = useLocation();
  // Exclude Menu on admin routes
  const hideMenu = location.pathname.startsWith('/admin') || location.pathname.startsWith('/admin-dashboard');
  return (
    <MenuProvider>
      <AuthProvider>
      {!hideMenu && <Menu />}
      <div className="content">
        <Routes>
          <Route path="/" element={<PreEventLandingPage />} />
          <Route path="/winners" element={<Winners />} />
          <Route path="/winners/entry/:id" element={<ProjectDetails />} />
          <Route path="/survey/:id" element={<SurveyDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/computer-science" element={<ComputerScience />} />
          <Route path="/computer-systems-engineering" element={<ComputerSystemsEngineering />} />
          <Route path="/biomedical-engineering" element={<BiomedicalEngineering />} />
          <Route path="/mechanical-engineering" element={<MechanicalEngineering />} />
          <Route path="/electrical-engineering" element={<ElectricalEngineering />} />
          <Route path="/industrial-engineering" element={<IndustrialEngineering />} />
          <Route path="/informatics" element={<Informatics />} />
          <Route path="/interdisciplinary" element={<Interdisciplinary />} />
          <Route path="/survey" element={<Survey />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="admin-dashboard" element={<AdminDashboard pageTitle="Admin Dashboard" />} />
          <Route path="admin-dashboard/edit/presentation" element={<EditPresentation />} />
          <Route path="admin-dashboard/edit/submissions" element={<EditSubmissions />} />
          <Route path="admin-dashboard/support" element={<ContactSupport />} />
          <Route path="*" element={<RouteNotFound />} />
        </Routes>
      </div>
      </AuthProvider>
    </MenuProvider>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
