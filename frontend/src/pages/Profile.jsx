import { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import api from "../api/axios";
import { FaCamera, FaShieldAlt, FaHistory } from "react-icons/fa";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("general"); // general | security | activity

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [saving, setSaving] = useState(false);

  // ---------- Load user ----------
  useEffect(() => {
  const stored = localStorage.getItem("user");

  if (!stored) return;

  try {
    const u = JSON.parse(stored);
    setUser(u);
    setForm({
      name: u.name || "",
      email: u.email || "",
      phone: u.phone || "",
      role: u.role || "",
    });
  } catch (err) {
    console.error("Invalid user stored:", err);
  }
}, []);


  // ---------- Save profile ----------
  const handleUpdate = async () => {
    setSaving(true);
    try {
      await api.put("/users/profile", form);

      const updated = { ...user, ...form };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);

      toast("Profile updated successfully");
    } catch (err) {
      toast("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // ---------- Change password ----------
  const changePassword = async () => {
    if (!passwords.oldPassword || !passwords.newPassword) {
      toast("Both password fields required");
      return;
    }

    try {
      await api.put("/users/change-password", passwords);
      toast("Password changed!");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      toast("Failed to change password");
    }
  };

  // ---------- Simple toast system ----------
  const toast = (msg) => {
    alert(msg); // Replace with toastify or custom UI later
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-gray-400 p-6">Loading profile...</div>
      </DashboardLayout>
    );
  }

  // ---------- Avatar initials ----------
  const getInitials = () => {
    const n = user.name || "U";
    return n.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="animate-fadeIn">

        {/* ---------- HEADER / COVER ---------- */}
        <div className="relative h-48 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg mb-16">
          <div className="absolute -bottom-14 left-10 flex items-center gap-5">
            
            {/* Avatar Circle */}
            <div className="relative">
              <div className="w-28 h-28 bg-[#0d1117] border-4 border-[#0d1117] rounded-full text-4xl font-bold flex items-center justify-center text-purple-300 shadow-2xl">
                {getInitials()}
              </div>

              {/* Edit Avatar Button */}
              <button className="absolute bottom-1 right-1 bg-purple-600 hover:bg-purple-700 p-2 rounded-full shadow-md">
                <FaCamera className="text-white text-sm" />
              </button>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white">{user.name}</h1>
              <p className="text-gray-200">{user.email}</p>
            </div>
          </div>
        </div>

        {/* ---------- TABS ---------- */}
        <div className="flex gap-8 border-b border-gray-800 px-10 mb-8">
          {[
            { id: "general", label: "General Info" },
            { id: "security", label: "Security" },
            { id: "activity", label: "Activity" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`pb-3 transition ${
                activeTab === t.id
                  ? "text-purple-400 border-b-2 border-purple-500"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ---------- GENERAL TAB ---------- */}
        {activeTab === "general" && (
          <div className="px-10 space-y-8">
            <div className="bg-[#0d1117] p-8 rounded-xl border border-gray-800 shadow-xl">

              <h2 className="text-xl font-semibold text-purple-300 mb-6">Personal Information</h2>

              <div className="grid md:grid-cols-2 gap-6">

                {/* Name */}
                <div>
                  <label className="text-gray-300 text-sm">Full Name</label>
                  <input
                    className="w-full p-3 mt-1 bg-[#0b0f14] border border-gray-700 rounded-lg text-gray-200"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-gray-300 text-sm">Email</label>
                  <input
                    className="w-full p-3 mt-1 bg-[#0b0f14] border border-gray-700 rounded-lg text-gray-200"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-gray-300 text-sm">Phone</label>
                  <input
                    className="w-full p-3 mt-1 bg-[#0b0f14] border border-gray-700 rounded-lg text-gray-200"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="text-gray-300 text-sm">Role</label>
                  <input
                    className="w-full p-3 mt-1 bg-[#0b0f14] border border-gray-700 rounded-lg text-gray-200"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  />
                </div>

              </div>

              <button
                onClick={handleUpdate}
                className="mt-8 w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg text-white font-semibold hover:scale-105 transition"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>
          </div>
        )}

        {/* ---------- SECURITY TAB ---------- */}
        {activeTab === "security" && (
          <div className="px-10 space-y-8">

            <div className="bg-[#0d1117] p-8 rounded-xl border border-gray-800 shadow-xl">
              <h2 className="text-xl font-semibold text-purple-300 mb-6 flex items-center gap-3">
                <FaShieldAlt /> Security Settings
              </h2>

              {/* Old password */}
              <div className="mb-6">
                <label className="text-gray-300 text-sm">Old Password</label>
                <input
                  type="password"
                  className="w-full p-3 mt-1 bg-[#0b0f14] border border-gray-700 rounded-lg text-gray-200"
                  value={passwords.oldPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, oldPassword: e.target.value })
                  }
                />
              </div>

              {/* New password */}
              <div className="mb-6">
                <label className="text-gray-300 text-sm">New Password</label>
                <input
                  type="password"
                  className="w-full p-3 mt-1 bg-[#0b0f14] border border-gray-700 rounded-lg text-gray-200"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                />
              </div>

              <button
                onClick={changePassword}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-red-400 rounded-lg text-white font-semibold hover:scale-105 transition"
              >
                Update Password
              </button>
            </div>
          </div>
        )}

        {/* ---------- ACTIVITY TAB ---------- */}
        {activeTab === "activity" && (
          <div className="px-10 space-y-8">
            <div className="bg-[#0d1117] p-8 rounded-xl border border-gray-800 shadow-xl">

              <h2 className="text-xl font-semibold text-purple-300 mb-6 flex items-center gap-3">
                <FaHistory /> Recent Activity
              </h2>

              <div className="space-y-4 text-gray-300">
                <p>• Logged in: {new Date().toLocaleString()}</p>
                <p>• Last profile update: {new Date().toLocaleString()}</p>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
