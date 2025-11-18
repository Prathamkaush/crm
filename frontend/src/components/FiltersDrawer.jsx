// src/components/FiltersDrawer.jsx
import { useState, useEffect } from "react";

export default function FiltersDrawer({ open, onClose, filters, setFilters, companies }) {
  const [local, setLocal] = useState(filters);

  useEffect(()=> setLocal(filters), [filters]);

  const apply = () => { setFilters(local); onClose(); };

  return !open ? null : (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-80 bg-[#0d1117] p-4 border-l border-blue-500/10 shadow-lg">
        <h3 className="text-lg font-semibold text-purple-300 mb-3">Filters</h3>

        <label className="block text-sm text-gray-300 mb-2">City</label>
        <select value={local.city||""} onChange={(e)=> setLocal({ ...local, city: e.target.value })} className="w-full p-2 mb-3 bg-[#0b0f14] text-gray-200 rounded border border-blue-500/20">
          <option value="">All</option>
          {["Delhi","Mumbai","Bangalore","Kolkata","Chennai","Hyderabad"].map(c=> <option key={c} value={c}>{c}</option>)}
        </select>

        <label className="block text-sm text-gray-300 mb-2">Sort</label>
        <select value={local.sort||""} onChange={(e)=> setLocal({ ...local, sort: e.target.value })} className="w-full p-2 mb-3 bg-[#0b0f14] text-gray-200 rounded border border-blue-500/20">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A → Z</option>
        </select>

        <label className="block text-sm text-gray-300 mb-2">Company</label>
        <select value={local.company||""} onChange={(e)=> setLocal({ ...local, company: e.target.value })} className="w-full p-2 mb-3 bg-[#0b0f14] text-gray-200 rounded border border-blue-500/20">
          <option value="">All</option>
          {companies.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="mt-4 flex justify-end gap-2">
          <button className="px-3 py-2 rounded bg-gray-700" onClick={onClose}>Close</button>
          <button className="px-3 py-2 rounded bg-purple-600" onClick={apply}>Apply</button>
        </div>
      </div>

      <div className="flex-1" onClick={onClose} />
    </div>
  );
}
