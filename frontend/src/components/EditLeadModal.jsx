import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function EditLeadModal({ open, onClose, onUpdate, lead }) {
  const [form, setForm] = useState({
    title: "",
    status: "NEW",
    source: "",
    value: ""
  });

  useEffect(() => {
    if (lead) {
      setForm({
        title: lead.title || "",
        status: lead.status || "NEW",
        source: lead.source || "",
        value: lead.value || ""
      });
    }
  }, [lead]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/70 z-[9999999] flex items-center justify-center">
      <div className="bg-[#0d1117] p-6 rounded-xl w-full max-w-md border border-gray-800">
        <h2 className="text-xl font-bold mb-4 text-blue-400">Edit Lead</h2>

        <input
          className="w-full p-2 mb-3 bg-[#0b0f14] border border-gray-700 rounded text-gray-200"
          placeholder="Lead Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          className="w-full p-2 mb-3 bg-[#0b0f14] border border-gray-700 rounded text-gray-200"
          placeholder="Source"
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
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded text-gray-200">
            Cancel
          </button>

          <button
            onClick={async () => {
              await onUpdate(lead.id, form);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 rounded text-white"
          >
            Update
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
