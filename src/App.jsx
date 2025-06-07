import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import IncidentMonitoring from "./nav/incident-monitoring";
import PatrolSchedule from "./nav/patrol-schedule";
import HistoryReport from "./nav/history-report";
import IncidentReport from "./nav/incident-report";
import Dashboard from "./nav/dashboard-reports";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/incidentmonitoring" element={<IncidentMonitoring />} />
        <Route path="/patrolschedule" element={<PatrolSchedule />} />
        <Route path="/historyreport" element={<HistoryReport />} />
        <Route path="/incidentreport" element={<IncidentReport />} />
        <Route path="/dashboardreport" element={<Dashboard />} />
      
        
        
        {/* Add more routes as needed */}
        
        
      </Routes>
    </Router>
  );
}

export default App;
