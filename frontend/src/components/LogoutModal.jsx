import { createPortal } from "react-dom";
import { FaSignOutAlt } from "react-icons/fa";

export default function LogoutModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#0d1117]/90 p-6 rounded-xl w-full max-w-sm border border-gray-700 shadow-xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center gap-3">
          <FaSignOutAlt className="text-4xl text-red-400" />

          <h2 className="text-xl font-bold text-red-300">
            Confirm Logout
          </h2>

          <p className="text-gray-400 text-sm">
            Are you sure you want to logout?  
            You’ll need to log in again to access your dashboard.
          </p>

          <div className="flex w-full mt-4 gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-gray-700 rounded text-gray-200 hover:bg-gray-600 transition"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="flex-1 py-2 bg-gradient-to-r from-red-600 to-red-400 rounded text-white hover:scale-105 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
