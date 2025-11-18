import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await api.post("/auth/login", form);

    // 👉 Store tokens
    localStorage.setItem("access_token", res.data.data.access);
    localStorage.setItem("refresh_token", res.data.data.refresh);

    // 👉 Store user object (THIS WAS MISSING)
    localStorage.setItem("user", JSON.stringify(res.data.data.user));

    navigate("/dashboard");

  } catch (err) {
    setError(err.response?.data?.error || "Login failed");
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md bg-[#161b22] p-8 rounded-xl border border-blue-500/20 shadow-xl">

        <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">
          Login
        </h1>

        {error && (
          <p className="mb-4 text-red-400 text-center text-sm">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 bg-[#0d1117] border border-blue-500/40 rounded-md text-gray-300"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 bg-[#0d1117] border border-blue-500/40 rounded-md text-gray-300"
            required
          />

          <button className="w-full p-3 rounded-md bg-blue-600 hover:bg-blue-700 transition text-white font-semibold">
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-gray-400">
          Don’t have an account?
          <Link to="/signup" className="text-purple-400 hover:underline ml-1">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
