import { useState } from "react";
import { createPortal } from "react-dom";

export default function AddLeadModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    status: "NEW",
    source: "",
    value: ""
  });

  if (!open) return null;

  const modal = (
    <div className="fixed inset-0 bg-black/70 z-[9999999] flex items-center justify-center">
      <div className="bg-[#0d1117] p-6 rounded-xl w-full max-w-md border border-gray-800">
        <h2 className="text-xl font-bold mb-4 text-purple-300">Add Lead</h2>

        <input
          className="w-full p-2 mb-3 bg-[#0b0f14] border border-gray-700 rounded text-gray-200"
          placeholder="Lead Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          className="w-full p-2 mb-3 bg-[#0b0f14] border border-gray-700 rounded text-gray-200"
          placeholder="Source (Facebook, Google, Referral)"
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
        />

        <input
          className="w-full p-2 mb-3 bg-[#0b0f14] border border-gray-700 rounded text-gray-200"
          placeholder="Value (₹)"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
        />

        <select
          className="w-full p-2 mb-3 bg-[#0b0f14] border border-gray-700 rounded text-gray-200"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="QUALIFIED">Qualified</option>
          <option value="WON">Won</option>
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded text-gray-200">Cancel</button>
          <button
            onClick={async () => {
              await onCreate(form);
              onClose();
            }}
            className="px-4 py-2 bg-purple-600 rounded text-white"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
