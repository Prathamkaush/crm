// src/components/DeleteConfirm.jsx
export default function DeleteConfirm({ open, onClose, onDelete, contact }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm bg-[#0d1117] p-6 rounded-lg border border-red-600/20 text-white">
        <h4 className="text-lg font-semibold text-red-400 mb-3">Delete contact?</h4>
        <p className="text-sm text-gray-300 mb-4">This will permanently remove <span className="font-medium">{contact?.name}</span>.</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-3 py-2 rounded bg-gray-700">Cancel</button>
          <button onClick={() => onDelete(contact.id)} className="px-3 py-2 rounded bg-red-600">Delete</button>
        </div>
      </div>
    </div>
  );
}
