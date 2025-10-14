import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../frontend/api/axios";

export default function Login({ setCurrentUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);

      // Save token
      localStorage.setItem("token", res.data.token);

      // Save user info
      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      if (setCurrentUser) setCurrentUser(user);

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/dashboard"); // admin sees all tasks
      } else {
        navigate("/dashboard"); // normal users see filtered tasks
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Login failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-400 via-blue-300 to-blue-100">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl w-[400px] p-8 text-center transition-all duration-300 hover:shadow-indigo-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back 👋</h2>
        <p className="text-gray-500 text-sm mb-6">
          Login to continue your journey.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-indigo-50 rounded-2xl p-6 space-y-6 text-left shadow-inner"
        >
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder-gray-400 bg-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all placeholder-gray-400 bg-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-blue-600 transition-all"
          >
            Login
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center font-medium ${message.includes("failed") ? "text-red-500" : "text-green-600"}`}>
            {message}
          </p>
        )}

        <p className="text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-500 font-medium hover:underline hover:text-indigo-600 transition">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
