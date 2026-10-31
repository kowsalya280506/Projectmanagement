
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const API = "http://localhost:5000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API);
      setTasks(res.data);
      setError("");
    } catch {
      setError("Cannot connect to server. Check backend.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) {
      setError("Enter a task title.");
      return;
    }

    try {
      await axios.post(API, { title: title.trim() });
      setTitle("");
      fetchTasks();
    } catch {
      setError("Could not add task.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/${id}`, { status });
      fetchTasks();
    } catch {
      setError("Could not update task.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchTasks();
    } catch {
      setError("Could not delete task.");
    }
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">
        Task Manager Dashboard
      </h1>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      <div className="input-group mb-4">
        <input
          className="form-control"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && addTask()
          }
        />
        <button className="btn btn-primary" onClick={addTask}>
          Add Task
        </button>
      </div>

      <div className="row">
        {["Pending", "Ongoing", "Completed"].map((status) => (
          <div className="col-md-4 mb-3" key={status}>
            <div className="card shadow-sm h-100">
              <div className="card-header bg-primary text-white">
                {status} Tasks
              </div>

              <div className="card-body">
                {tasks.filter((t) => t.status === status).length === 0 && (
                  <p className="text-muted">No tasks here.</p>
                )}

                {tasks
                  .filter((t) => t.status === status)
                  .map((task) => (
                    <div className="border rounded p-3 mb-3" key={task._id}>
                      <h6>{task.title}</h6>

                      <p>Status: {task.status}</p>

                      {status !== "Pending" && (
                        <button
                          className="btn btn-sm btn-secondary me-2 mb-2"
                          onClick={() =>
                            updateStatus(task._id, "Pending")
                          }
                        >
                          Pending
                        </button>
                      )}

                      {status !== "Ongoing" && (
                        <button
                          className="btn btn-sm btn-info me-2 mb-2"
                          onClick={() =>
                            updateStatus(task._id, "Ongoing")
                          }
                        >
                          Ongoing
                        </button>
                      )}

                      {status !== "Completed" && (
                        <button
                          className="btn btn-sm btn-success me-2 mb-2"
                          onClick={() =>
                            updateStatus(task._id, "Completed")
                          }
                        >
                          Complete
                        </button>
                      )}

                      <button
                        className="btn btn-sm btn-danger mb-2"
                        onClick={() => deleteTask(task._id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
