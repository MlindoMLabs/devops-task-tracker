require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "https://devops-task-tracker-frontend.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    console.log(
      `${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
    );
  });

  next();
});

const PORT = process.env.PORT || 3001;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.get("/", (req, res) => {
  res.json({
    message: "DevOps Task Tracker API is running"
  });
});

app.get("/health", async (req, res) => {
  try {
    const { error } = await supabase
      .from("tasks")
      .select("id")
      .limit(1);

    if (error) {
      return res.status(503).json({
        status: "unhealthy",
        database: "unavailable",
        error: error.message
      });
    }

    res.status(200).json({
      status: "healthy",
      database: "connected"
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      database: "unavailable",
      error: error.message
    });
  }
});

app.get("/api/test-supabase", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .limit(1);

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: "Supabase connection is working",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/api/tasks", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const validateTask = (req, res, next) => {
  const { title, description, status, priority } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      error: "Title is required and must be a non-empty string"
    });
  }

  if (description !== undefined && typeof description !== "string") {
    return res.status(400).json({
      error: "Description must be a string"
    });
  }

  const validStatuses = ["pending", "in-progress", "completed"];

  if (status !== undefined && !validStatuses.includes(status)) {
    return res.status(400).json({
      error: "Invalid status"
    });
  }

  const validPriorities = ["low", "medium", "high"];

  if (priority !== undefined && !validPriorities.includes(priority)) {
    return res.status(400).json({
      error: "Invalid priority"
    });
  }

  next();
};

app.post("/api/tasks", validateTask, async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: "Title is required",
      });
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title,
          description,
          status,
          priority,
        },
      ])
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.put("/api/tasks/:id", validateTask, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

    const { data, error } = await supabase
      .from("tasks")
      .update({
        title,
        description,
        status,
        priority,
      })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    res.json({
      success: true,
      message: "Task deleted successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
