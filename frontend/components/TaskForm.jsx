import { useState, useEffect } from "react";
import api from "../../frontend/api/axios";

export default function TaskForm({ onTaskCreated, currentUser, existingTask = null }) {
  const initialForm = {
    title: existingTask?.title || "",
    description: existingTask?.description || "",
    status: existingTask?.status || "todo",
    priority: existingTask?.priority || "Low",
    assignedTo: existingTask?.userId || currentUser.id,
  };

  const [form, setForm] = useState(initialForm);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all users if currentUser is admin
  useEffect(() => {
    if (currentUser?.role === "admin") {
      api.get("/users")
        .then(res => setUsers(res.data))
        .catch(err => console.error("Failed to fetch users:", err));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        userId: currentUser.role === "admin" ? form.assignedTo : currentUser.id,
      };

      if (existingTask) {
        await api.put(`/tasks/${existingTask.id}`, payload);
      } else {
        await api.post("/tasks", payload);
      }

      onTaskCreated();
      setForm({
        title: "",
        description: "",
        status: "todo",
        priority: "Low",
        assignedTo: currentUser.id,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded shadow bg-white"
    >
      {error && <div className="text-red-600 font-medium">{error}</div>}

      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        disabled={loading}
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        disabled={loading}
        rows={3}
        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="grid grid-cols-2 gap-4">
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          disabled={loading}
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          disabled={loading}
          className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>
      </div>

      {currentUser?.role === "admin" && (
        <select
          name="assignedTo"
          value={form.assignedTo}
          onChange={handleChange}
          disabled={loading}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Assign to user</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300"
      >
        {loading ? "Saving..." : existingTask ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
}
