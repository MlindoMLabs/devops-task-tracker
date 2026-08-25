import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");

  const [editingTaskId, setEditingTaskId] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const result = await response.json();

      setTasks(result.data);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const url = editingTaskId
        ? `${API_URL}/${editingTaskId}`
        : API_URL;

      const method = editingTaskId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          status,
          priority,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save task");
      }

      resetForm();
      fetchTasks();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete task");
      }

      fetchTasks();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  const resetForm = () => {
    setEditingTaskId(null);
    setTitle("");
    setDescription("");
    setStatus("pending");
    setPriority("medium");
    setError("");
  };

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>DevOps Task Tracker</h1>
          <p>Manage your development and operations tasks</p>
        </div>
      </header>

      <main className="container">

        <section className="stats">
          <div className="stat-card">
            <span>Total Tasks</span>
            <strong>{tasks.length}</strong>
          </div>

          <div className="stat-card">
            <span>Pending</span>
            <strong>{pendingTasks}</strong>
          </div>

          <div className="stat-card">
            <span>In Progress</span>
            <strong>{inProgressTasks}</strong>
          </div>

          <div className="stat-card">
            <span>Completed</span>
            <strong>{completedTasks}</strong>
          </div>
        </section>

        <section className="form-card">
          <h2>{editingTaskId ? "Edit Task" : "Create New Task"}</h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Title</label>

              <input
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                placeholder="Enter task description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
              />
            </div>

            <div className="form-row">

              <div className="form-group">
                <label>Status</label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">
                    In Progress
                  </option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority</label>

                <select
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value)
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

            </div>

            <div className="form-buttons">

              <button type="submit" className="primary-button">
                {editingTaskId ? "Update Task" : "Create Task"}
              </button>

              {editingTaskId && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>
        </section>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <section className="tasks-section">

          <div className="section-header">
            <h2>Tasks</h2>
            <button onClick={fetchTasks} className="refresh-button">
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="message">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="message">No tasks found.</p>
          ) : (

            <div className="task-grid">

              {tasks.map((task) => (

                <article className="task-card" key={task.id}>

                  <div className="task-header">

                    <h3>{task.title}</h3>

                    <span className={`priority ${task.priority}`}>
                      {task.priority}
                    </span>

                  </div>

                  <p className="description">
                    {task.description}
                  </p>

                  <div className="task-info">

                    <span className={`status ${task.status}`}>
                      {task.status}
                    </span>

                    <span>
                      Task #{task.id}
                    </span>

                  </div>

                  <div className="task-actions">

                    <button
                      className="edit-button"
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => handleDelete(task.id)}
                    >
                      Delete
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>
    </div>
  );
}

export default App;
