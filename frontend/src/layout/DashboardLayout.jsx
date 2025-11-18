import { useState, useEffect } from "react";
import LogoutModal from "../components/LogoutModal";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) navigate("/login");
  }, []);

  const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  navigate("/login");
};

  return (
    <>
  <LogoutModal
    open={logoutOpen}
    onClose={() => setLogoutOpen(false)}
    onConfirm={logout}
  />

  <div className="flex min-h-screen bg-[#0d1117] text-gray-200">
    <Sidebar onLogout={() => setLogoutOpen(true)} />
    
    <div className="flex-1 flex flex-col">
      <Navbar />
      <div className="p-6">{children}</div>
    </div>
  </div>
</>

  );
}
