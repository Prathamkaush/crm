import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contact.jsx";
import DashboardLayout from "./layout/DashboardLayout.jsx";
import Leads from "./pages/Leads.jsx";
import Tasks from "./pages/tasks.jsx";
import Profile from "./pages/Profile.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/*contact*/}
        <Route path="/contacts" element={<Contacts/>} />

        {/*lead*/}
        <Route path="/leads" element={<Leads />} />

        {/*Tasks*/}
        <Route path="/tasks" element={<Tasks/>} />

        {/*Profile*/}
        <Route path="/profile" element={<Profile />} />

        {/* Default */}
        <Route path="*" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
}
