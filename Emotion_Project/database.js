/*
database file that will create the database and create a mood table to store 
all the moods that are inputed in the front end section 
It is responsible for creating the database connection 
*/
const Database = require("better-sqlite3");

// Creates the database file automatically if it doesn't exist
const db = new Database("moods.db");

// Create the moods table if it doesn't already exist
db.exec(`
    CREATE TABLE IF NOT EXISTS moods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mood TEXT NOT NULL,
        note TEXT,
        timestamp TEXT NOT NULL
    )
`);

console.log("Database connected and table ready!");

module.exports = db;