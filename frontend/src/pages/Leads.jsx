// src/pages/Leads.jsx
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { FaChartBar, FaPlus } from "react-icons/fa";
import api from "../api/axios";
import AddLeadModal from "../components/AddLeadModal";
import { getLeads, createLead , updateLead , deleteLead } from "../api/leads";
import EditLeadModal from "../components/EditLeadModal";
import DeleteLeadModal from "../components/DeleteLeadModal";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ q: "", status: "all", source: "all", sort: "newest" });
  const [sources, setSources] = useState([]);
  const [addOpen, setAddOpen] = useState(false);  
  const [editOpen, setEditOpen] = useState(false);
const [deleteOpen, setDeleteOpen] = useState(false);
const [selected, setSelected] = useState(null);



  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get("/leads");
      const data = res.data.leads || res.data;
      setLeads(data);
      setSources(Array.from(new Set(data.map(l => l.source).filter(Boolean))));
    } catch (err) {
      console.error("failed load leads", err);
      alert("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=> { fetch(); }, []);

  const filtered = useMemo(() => {
    let list = [...leads];
    const q = filters.q.trim().toLowerCase();
    if (q) {
      list = list.filter(i =>
        (i.title||"").toLowerCase().includes(q) ||
        (i.source||"").toLowerCase().includes(q)
      );
    }
    if (filters.status !== "all") list = list.filter(i => i.status === filters.status);
    if (filters.source !== "all") list = list.filter(i => i.source === filters.source);
    if (filters.sort === "newest") list.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
    if (filters.sort === "oldest") list.sort((a,b)=> new Date(a.createdAt) - new Date(b.createdAt));
    return list;
  }, [leads, filters]);

  const handleCreateLead = async (form) => {
  await createLead(form);
  fetch();
};


  return (
    <>
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-extrabold text-purple-300">Leads</h2>
          <div className="text-sm text-gray-300">Overview & pipeline</div>
        </div>

        <div className="flex gap-3 items-center">
          <input value={filters.q} onChange={(e)=> setFilters({...filters, q: e.target.value})}
            className="flex-1 p-3 bg-[#0b0f14] border border-blue-500/10 rounded text-gray-200"
            placeholder="Search title, source..." />

          <select value={filters.status} onChange={(e)=> setFilters({...filters, status: e.target.value})}
            className="p-2 bg-[#0b0f14] border border-blue-500/10 rounded text-gray-200">
            <option value="all">All Status</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="WON">Won</option>
          </select>

          <select value={filters.source} onChange={(e)=> setFilters({...filters, source: e.target.value})}
            className="p-2 bg-[#0b0f14] border border-blue-500/10 rounded text-gray-200">
            <option value="all">All Sources</option>
            {sources.map(s => <option value={s} key={s}>{s}</option>)}
          </select>

          <select value={filters.sort} onChange={(e)=> setFilters({...filters, sort: e.target.value})}
            className="p-2 bg-[#0b0f14] border border-blue-500/10 rounded text-gray-200">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A → Z</option>
          </select>

         <button
  onClick={() => {
    console.log("ADD lead clicked");
    setAddOpen(true);
  }}
  className="px-4 py-2 rounded bg-gradient-to-br from-purple-600 to-indigo-500 text-white flex items-center gap-2"
>
  <FaPlus /> Add Lead
</button>

        </div>

        <div className="bg-[#0d1117] p-6 rounded-xl border border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-200">
              <thead>
                <tr className="text-gray-300 border-b border-gray-700">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Value</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
  {filtered.map((l, idx) => (
    <tr
      key={l.id}
      className="border-b border-gray-800 hover:bg-gray-800/40 transition-all duration-200"
    >
      <td className="py-3 px-4 text-gray-500 font-mono">{idx + 1}</td>

      <td className="py-3 px-4 font-medium text-gray-200">
        {l.title}
      </td>

      {/* STATUS BADGE */}
      <td className="py-3 px-4">
        <span
          className={`
            px-2 py-1 rounded text-xs font-semibold
            ${l.status === "NEW" && "bg-blue-600/20 text-blue-400"}
            ${l.status === "CONTACTED" && "bg-yellow-600/20 text-yellow-400"}
            ${l.status === "QUALIFIED" && "bg-purple-600/20 text-purple-400"}
            ${l.status === "WON" && "bg-green-600/20 text-green-400"}
          `}
        >
          {l.status}
        </span>
      </td>

      <td className="py-3 px-4">{l.value ?? "-"}</td>
      <td className="py-3 px-4">{l.source ?? "-"}</td>

      <td className="py-3 px-4 text-gray-400">
        {new Date(l.createdAt).toLocaleDateString()}
      </td>

      {/* ACTIONS */}
      <td className="py-3 px-4 text-right flex gap-4 justify-end">
  <button
    onClick={() => {
      setSelected(l);
      setEditOpen(true);
    }}
    className="text-blue-400 hover:text-blue-300 transition"
  >
    ✏️
  </button>

  <button
    onClick={() => {
      setSelected(l);
      setDeleteOpen(true);
    }}
    className="text-red-400 hover:text-red-300 transition"
  >
    🗑️
  </button>
</td>

    </tr>
  ))}

  {!loading && filtered.length === 0 && (
    <tr>
      <td colSpan={7} className="py-6 px-4 text-gray-400 text-center">
        No leads found.
      </td>
    </tr>
  )}

  {loading && (
    <tr>
      <td colSpan={7} className="py-6 px-4 text-gray-400 text-center">
        Loading…
      </td>
    </tr>
  )}
</tbody>

            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
    <AddLeadModal 
  open={addOpen}
  onClose={() => setAddOpen(false)}
  onCreate={handleCreateLead}
/>

<EditLeadModal
  open={editOpen}
  onClose={() => setEditOpen(false)}
  onUpdate={async (id, data) => {
    await updateLead(id, data);
    fetch();
  }}
  lead={selected}
/>

<DeleteLeadModal
  open={deleteOpen}
  onClose={() => setDeleteOpen(false)}
  onDelete={async (id) => {
    await deleteLead(id);
    fetch();
  }}
  lead={selected}
/>
</>
  );
}
