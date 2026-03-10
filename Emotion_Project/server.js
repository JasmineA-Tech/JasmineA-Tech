/*
This is the Express server that listens for incoming requests from the browser. 
It has the three API routes which are GET, POST, DELETE, and tells the Express 
where to find the frontend files. 
node server.js is the file that starts everything
*/
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./database");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Test route
app.get("/api/ping", (req, res) => {
    res.json({ message: "Server is running!" });
});

// Serve daily.html as the homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "daily.html"));
});

// GET - load all moods from the database
app.get("/api/moods", (req, res) => {
    const moods = db.prepare("SELECT * FROM moods ORDER BY timestamp DESC").all();
    res.json(moods);
});

// POST - save a new mood to the database
app.post("/api/moods", (req, res) => {
    const { mood, note, timestamp } = req.body;
    const result = db.prepare("INSERT INTO moods (mood, note, timestamp) VALUES (?, ?, ?)").run(mood, note, timestamp);
    res.json({ id: result.lastInsertRowid, mood, note, timestamp });
});

// DELETE - remove a mood from the database
app.delete("/api/moods/:timestamp", (req, res) => {
    db.prepare("DELETE FROM moods WHERE timestamp = ?").run(req.params.timestamp);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});