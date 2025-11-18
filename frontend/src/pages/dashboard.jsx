// src/pages/Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { FaChartLine, FaUsers, FaTasks, FaBolt } from "react-icons/fa";
import api from "../api/axios"; // your axios instance
import AddLeadModal from "../components/AddLeadModal"

const sampleOverview = {
  contacts: 24,
  leads: 8,
  tasks: 5,
  timeline: [
    { date: "2025-11-10", contacts: 2, leads: 1 },
    { date: "2025-11-11", contacts: 1, leads: 0 },
    { date: "2025-11-12", contacts: 3, leads: 2 },
    { date: "2025-11-13", contacts: 1, leads: 1 },
    { date: "2025-11-14", contacts: 6, leads: 2 },
    { date: "2025-11-15", contacts: 5, leads: 1 },
    { date: "2025-11-16", contacts: 6, leads: 1 }
  ]
};



export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(sampleOverview);

  const [addOpen, setAddOpen] = useState(false);

const handleCreateLead = async (data) => {
  try {
    const res = await api.post("/leads", data);
    console.log("Lead created:", res.data);
  } catch (err) {
    console.error("Failed to create lead:", err);
  }
};


  useEffect(() => {
    const load = async () => {
      try {
        // Try to fetch real counts from backend. Add endpoints if missing.
        const [cRes, lRes, tRes] = await Promise.allSettled([
          api.get("/contacts/count"),
          api.get("/leads/count"),
          api.get("/tasks/count"),
        ]);

        const contacts = cRes.status === "fulfilled" ? cRes.value.data.count : sampleOverview.contacts;
        const leads = lRes.status === "fulfilled" ? lRes.value.data.count : sampleOverview.leads;
        const tasks = tRes.status === "fulfilled" ? tRes.value.data.count : sampleOverview.tasks;

        // optionally fetch timeline:
        let timeline = sampleOverview.timeline;
        try {
          const tl = await api.get("/analytics/timeline"); // optional endpoint
          if (tl?.data) timeline = tl.data;
        } catch (err) {}

        setOverview({ contacts, leads, tasks, timeline });
      } catch (err) {
        console.error("dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const chartData = useMemo(() => overview.timeline || [], [overview]);

  return (
    <>
    <AddLeadModal
      open={addOpen}
      
      onClose={() => setAddOpen(false)}
      onCreate={handleCreateLead}
    />

  
    <DashboardLayout>
      
      <div className="space-y-6 animate-fadeIn delay-75">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-extrabold text-purple-300">Dashboard Overview</h2>
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Contacts" value={overview.contacts} icon={<FaUsers />} color="from-blue-600 to-indigo-600" loading={loading} />
          <StatCard title="Active Leads" value={overview.leads} icon={<FaBolt />} color="from-cyan-600 to-blue-600" loading={loading} />
          <StatCard title="Pending Tasks" value={overview.tasks} icon={<FaTasks />} color="from-purple-600 to-pink-600" loading={loading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 bg-[#0d1117] rounded-xl p-6 border border-gray-800 shadow">
            <h3 className="text-xl font-semibold text-indigo-200 mb-4">Activity (last 7 days)</h3>
            <div style={{ height: 260 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="c1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="c2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>

                  <CartesianGrid stroke="#111827" strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: "#9CA3AF" }} />
                  <YAxis tick={{ fill: "#9CA3AF" }} />
                  <Tooltip wrapperStyle={{ background: "#0b1220", borderRadius: 8, border: "1px solid #222" }} />
                  <Area type="monotone" dataKey="contacts" stroke="#7c3aed" fill="url(#c1)" strokeWidth={2} />
                  <Area type="monotone" dataKey="leads" stroke="#06b6d4" fill="url(#c2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#0d1117] rounded-xl p-6 border border-gray-800 shadow flex flex-col gap-4">
            <h3 className="text-xl font-semibold text-indigo-200">Quick Actions</h3>

            <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-500 rounded text-white hover:scale-105 transition"
            
            >Create Contact</button>
            <button className="w-full py-2 border border-gray-700 rounded text-gray-200 hover:bg-gray-800 transition">Import CSV</button>
            <button className="w-full py-2 border border-gray-700 rounded text-gray-200 hover:bg-gray-800 transition">Export</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  </>
  );
}

/* small StatCard component (placed in same file for convenience) */
function StatCard({ title, value, icon, color = "from-purple-500 to-indigo-500", loading }) {
  return (
    <div className="bg-[#0d1117] rounded-xl p-5 border border-gray-800 shadow flex items-center gap-4">
      <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-white text-xl shadow-lg`}>
        {icon}
      </div>

      <div className="flex-1">
        <div className="text-sm text-gray-300">{title}</div>
        <div className="text-3xl font-bold text-white">
          {loading ? <Skeleton /> : value}
        </div>
      </div>
    </div>
  
  );
}

function Skeleton() {
  return <div className="h-6 w-20 bg-gray-700 rounded animate-pulse" />;
}
