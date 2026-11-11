
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "https://kowsalya280506.github.io"
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err.message);
    });

// Task Schema
const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Ongoing", "Completed"],
            default: "Pending"
        }
    },
    { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

// Test API
app.get("/", (req, res) => {
    res.send("Project Management Backend is Running!");
});

// Get all tasks
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Could not fetch tasks" });
    }
});

// Add task
app.post("/tasks", async (req, res) => {
    try {
        const task = await Task.create({
            title: req.body.title
        });
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ message: "Could not create task" });
    }
});

// Update task
app.patch("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(task);
    } catch (err) {
        res.status(400).json({ message: "Could not update task" });
    }
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(400).json({ message: "Could not delete task" });
    }
});
