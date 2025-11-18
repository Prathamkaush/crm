import { useEffect, useState } from "react";

export default function Navbar() {
    
    const [user, setUser] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
  }, []);
  
  return (
    <div className="h-16 flex items-center justify-between px-6 bg-[#161b22] border-b border-blue-500/20 shadow-sm">
      <h2 className="text-xl font-semibold text-blue-400 animate-pulse">
        
      </h2>

      <div className="flex justify-end items-center p-4 pr-8 text-gray-300 text-lg">
  Welcome : <span className="p-1 text-xl font-semibold text-blue-400 animate-pulse">{user?.name}</span> 👋
</div>
    </div>
  );
}
