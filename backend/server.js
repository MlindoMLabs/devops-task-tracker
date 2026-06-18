import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);


// Health check
app.get("/", (req, res) => res.send("API running"));

// Get task 
app.get("/tasks", async (req, res) => {
  const { data } = await supabase.from("tasks").select("*");
  res.json(data);
});

// Add task
app.post("/tasks", async (req, res) => {
  const { title } = req.body;
  const { data } = await supabase.from("tasks").insert([{ title }]);
  res.json(data);
});


app.listen(3001, () => console.log("Server running on 3001"));
