import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/add-expense", async (req, res) => {
  try {
    const { description, amount, type, category } = req.body;

    await pool.query(
      "INSERT INTO expenses (description, amount, type, category) VALUES (?, ?, ?, ?)",
      [description, amount, type, category]
    );

    res.json({ message: "Expense added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/expenses", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM expenses ORDER BY created_at DESC"
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
