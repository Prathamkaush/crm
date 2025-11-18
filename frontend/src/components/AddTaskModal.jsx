import { useState } from "react";
import { createPortal } from "react-dom";

export default function AddTaskModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    dueDate: "",
    status: "pending",
  });

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center">
      <div className="bg-[#0d1117] p-6 rounded-xl w-full max-w-md border border-gray-700 shadow-2xl">

        <h2 className="text-xl font-bold mb-5 text-purple-300">Create Task</h2>

        <input
          className="w-full p-2 mb-3 bg-[#0b0f14] border border-gray-700 rounded text-gray-200"
          placeholder="Task Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          type="date"
          className="w-full p-2 mb-3 bg-[#0b0f14] border border-gray-700 rounded text-gray-200"
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />

        <select
          className="w-full p-2 mb-3 bg-[#0b0f14] border border-gray-700 rounded text-gray-200"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="pending">Pending</option>
          <option value="progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded text-gray-200"
          >
            Cancel
          </button>

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
    </div>,
    document.body
  );
}
