import { useEffect, useState } from "react";
import api from "../../frontend/api/axios";
import TaskForm from "../components/TaskForm.jsx";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load logged-in user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch all tasks
  const fetchTasks = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/tasks");
      // Normal users see only their tasks
      if (currentUser.role !== "admin") {
        setTasks(res.data.filter((t) => t.userId === currentUser.id));
      } else {
        setTasks(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users (for admin)
  const fetchUsers = async () => {
    if (currentUser?.role === "admin") {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
      fetchUsers();
    }
  }, [currentUser]);

  // Update a task field
  const updateTaskField = async (id, field, value) => {
    try {
      await api.put(`/tasks/${id}`, { [field]: value });
      setSuccess(`Task ${field} updated successfully!`);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to update task ${field}.`);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      setSuccess("Task deleted successfully!");
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task.");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low": return "bg-green-200 text-green-800";
      case "Medium": return "bg-yellow-200 text-yellow-800";
      case "High": return "bg-red-200 text-red-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "todo": return "bg-gray-200 text-gray-800";
      case "in-progress": return "bg-blue-200 text-blue-800";
      case "done": return "bg-green-200 text-green-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  if (!currentUser) return <p className="text-center mt-10">Loading user info...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">
        {currentUser.role === "admin" ? "Admin Dashboard" : "Dashboard"}
      </h2>

      {/* Notifications */}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

      {/* Inline Add Task Form */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-3">Add New Task</h3>
        <TaskForm
          currentUser={currentUser}
          onTaskCreated={() => {
            fetchTasks();
            setSuccess("Task added successfully!");
          }}
        />
      </div>

      {/* Tasks List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks yet.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tasks.map((t) => {
            const isAssignedToCurrentUser = t.userId === currentUser.id;

            return (
              <li
                key={t.id}
                className={`flex flex-col justify-between p-5 rounded-lg shadow hover:shadow-lg transition-shadow border-l-4 ${
                  isAssignedToCurrentUser ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
                }`}
              >
                {isAssignedToCurrentUser && (
                  <span className="text-xs text-blue-700 font-semibold mb-2">Assigned to You</span>
                )}

                {/* Title and Description */}
                <input
                  type="text"
                  value={t.title}
                  onChange={(e) => updateTaskField(t.id, "title", e.target.value)}
                  className="text-xl font-semibold text-gray-900 w-full mb-2 p-1 border-b border-gray-300 focus:outline-none"
                />
                <textarea
                  rows={3}
                  value={t.description || ""}
                  onChange={(e) => updateTaskField(t.id, "description", e.target.value)}
                  className="w-full mb-2 p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                {/* Status and Priority */}
                <div className="flex justify-between items-center mb-2">
                  <select
                    value={t.status}
                    onChange={(e) => updateTaskField(t.id, "status", e.target.value)}
                    className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(t.status)} cursor-pointer`}
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>

                  <select
                    value={t.priority || "Low"}
                    onChange={(e) => updateTaskField(t.id, "priority", e.target.value)}
                    className={`px-2 py-1 rounded text-sm font-medium ${getPriorityColor(t.priority)} cursor-pointer`}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* Admin: Assign task */}
                {currentUser.role === "admin" && (
                  <select
                    value={t.userId || ""}
                    onChange={(e) => updateTaskField(t.id, "userId", Number(e.target.value))}
                    className="w-full mb-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Assign to user</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                )}

                {/* Task info and actions */}
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>Created by: {t.user?.name || "Unknown"}</span>
                  <div className="flex space-x-2">
                    {(currentUser.role === "admin" || t.userId === currentUser.id) && (
                      <button
                        onClick={() => deleteTask(t.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
