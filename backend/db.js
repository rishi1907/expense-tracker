const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'expenses.db');
const db = new Database(dbPath);

// Initialize database table
db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        amount INTEGER NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
    )
    `);

module.exports = db;
