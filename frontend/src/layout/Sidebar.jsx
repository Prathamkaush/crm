import { useState } from "react";
import { FaHome,FaUserCircle ,FaUserFriends, FaBullseye, FaTasks, FaBars } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";


export default function Sidebar({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, link: "/dashboard" },
    { name: "Contacts", icon: <FaUserFriends />, link: "/contacts" },
    { name: "Leads", icon: <FaBullseye />, link: "/leads" },
    { name: "Tasks", icon: <FaTasks />, link: "/tasks" },
    { name: "Profile", icon: <FaUserCircle />, link: "/profile" },
  ];

  return (
    <div
      className={`h-screen transition-all duration-300 bg-[#0F1624] text-white flex flex-col 
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* TOP BAR */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && <h1 className="text-xl font-bold text-purple-400">My CRM</h1>}
        <FaBars 
          className="cursor-pointer text-xl text-purple-300" 
          onClick={() => setCollapsed(!collapsed)} 
        />
      </div>

      {/* MENU */}
      <div className="flex-1 mt-4">
        {menuItems.map((item) => (
          <Link
  key={item.name}
  to={item.link}
  className={`flex items-center gap-4 px-4 py-3 my-2 transition-all 
    hover:bg-purple-600/30 rounded-lg cursor-pointer
    ${collapsed ? "justify-center" : ""}`}
>
  <span className="text-xl">{item.icon}</span>
  {!collapsed && <span>{item.name}</span>}
</Link>

        ))}
      </div>

      {/* LOGOUT BUTTON */}
      <div className="p-4 mt-auto">
        <button
          onClick={onLogout}
          className={`w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg 
            flex items-center justify-center gap-2 transition-all`}
        >
          <FiLogOut className="text-xl" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}
