// src/components/AddContactModal.jsx
import { useState } from "react";

export default function AddContactModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", address: "" });
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCreate(form);
      setForm({ name: "", email: "", phone: "", company: "", address: "" });
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Create failed");
    } finally { setLoading(false); }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form onSubmit={submit} className="w-full max-w-md bg-[#0d1117] p-6 rounded-xl border border-blue-500/10 shadow-lg">
        <h3 className="text-xl font-bold text-purple-300 mb-3">Add Contact</h3>

        {["name","email","phone","company","address"].map((f) => (
          <input
            key={f}
            name={f}
            onChange={change}
            value={form[f]}
            placeholder={f.charAt(0).toUpperCase()+f.slice(1)}
            className="w-full p-3 mb-3 rounded bg-[#0b0f14] border border-blue-500/20 text-gray-200"
            required={f==="name"}
          />
        ))}

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-700">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-purple-600">Create</button>
        </div>
      </form>
    </div>
  );
}
