import { useState } from "react";
import { createPortal } from "react-dom";

export default function DeleteLeadModal({ open, onClose, onDelete, lead }) {
  const [confirmText, setConfirmText] = useState("");

  if (!open) return null;

  const isValid = confirmText.trim().toLowerCase() === "confirm";

  return createPortal(
    <div className="fixed inset-0 bg-black/70 z-[9999999] flex items-center justify-center">
      <div className="bg-[#0d1117] p-6 rounded-xl w-full max-w-sm border border-gray-800 text-gray-200">

        <h2 className="text-xl font-bold text-red-400">Delete Lead</h2>

        <p className="mt-3 text-gray-400">
          You are about to delete:
          <span className="text-gray-200 font-semibold"> "{lead?.title}"</span>
        </p>

        <p className="mt-2 text-gray-400">
          This action cannot be undone.  
          <br />
          Type <span className="text-red-400 font-bold">"confirm"</span> below to continue:
        </p>

        <input
          className="w-full mt-4 p-2 bg-[#0b0f14] border border-gray-700 rounded text-gray-200"
          placeholder='Type "confirm"'
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={() => {
              setConfirmText("");
              onClose();
            }}
            className="px-4 py-2 bg-gray-700 rounded"
          >
            Cancel
          </button>

          <button
            disabled={!isValid}
            onClick={() => {
              onDelete(lead?.id);
              setConfirmText("");
              onClose();
            }}
            className={`px-4 py-2 rounded text-white transition-all 
              ${isValid ? "bg-red-600 hover:bg-red-700" : "bg-red-600/40 cursor-not-allowed"}
            `}
          >
            Delete
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
