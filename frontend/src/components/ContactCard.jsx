// src/components/ContactCard.jsx
import { FaEnvelope, FaPhone, FaBuilding } from "react-icons/fa";

export default function ContactCard({ contact, onEdit, onDelete }) {
  return (
    <div className="bg-[#161b22] p-4 rounded-lg border border-blue-500/10 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-purple-300">{contact.name}</h3>
          <p className="text-sm text-gray-400">{contact.company}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(contact)} className="text-sm text-blue-400 px-2 py-1 rounded hover:bg-blue-600/20">Edit</button>
          <button onClick={() => onDelete(contact)} className="text-sm text-red-400 px-2 py-1 rounded hover:bg-red-600/10">Delete</button>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-300 space-y-1">
        <div className="flex items-center gap-2"><FaEnvelope className="text-xs text-gray-400"/> <span>{contact.email || "—"}</span></div>
        <div className="flex items-center gap-2"><FaPhone className="text-xs text-gray-400"/> <span>{contact.phone || "—"}</span></div>
        <div className="flex items-center gap-2"><FaBuilding className="text-xs text-gray-400"/> <span>{contact.address || "—"}</span></div>
      </div>
    </div>
  );
}
