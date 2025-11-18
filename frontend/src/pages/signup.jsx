import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    company: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/signup", form);
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md bg-[#161b22] p-8 rounded-xl border border-blue-500/20 shadow-xl">

        <h1 className="text-3xl font-bold text-center mb-6 text-purple-400">
          Create Account
        </h1>

        {error && (
          <p className="mb-4 text-red-400 text-center text-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-[#0d1117] border border-blue-500/40 text-gray-300"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-[#0d1117] border border-blue-500/40 text-gray-300"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-[#0d1117] border border-blue-500/40 text-gray-300"
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-[#0d1117] border border-blue-500/40 text-gray-300"
          />

          <input
            name="address"
            placeholder="Address"
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-[#0d1117] border border-blue-500/40 text-gray-300"
          />

          <input
            name="company"
            placeholder="Company"
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-[#0d1117] border border-blue-500/40 text-gray-300"
          />

          <button className="w-full p-3 rounded-md bg-purple-600 hover:bg-purple-700 transition text-white font-semibold">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 text-gray-400">
          Already have an account?
          <Link to="/login" className="text-blue-400 hover:underline ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
