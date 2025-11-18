// src/components/EditContactModal.jsx
import { useEffect, useState } from "react";

export default function EditContactModal({ open, contact, onClose, onUpdate }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", address: "" });
  useEffect(() => { if (contact) setForm({ name: contact.name||"", email: contact.email||"", phone: contact.phone||"", company: contact.company||"", address: contact.address||"" }); }, [contact]);

  if (!open) return null;

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    try {
      await onUpdate(contact.id, form);
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form onSubmit={submit} className="w-full max-w-md bg-[#0d1117] p-6 rounded-xl border border-blue-500/10 shadow-lg">
        <h3 className="text-xl font-bold text-purple-300 mb-3">Edit Contact</h3>

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
          <button type="submit" className="px-4 py-2 rounded bg-purple-600">Save</button>
        </div>
      </form>
    </div>
  );
}
