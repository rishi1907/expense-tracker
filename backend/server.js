const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Helper function to validate date format (YYYY-MM-DD)
const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regex)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
};

// POST /expenses
app.post('/expenses', (req, res) => {
    const { id, amount, category, description, date } = req.body;

    // Validation
    if (!id || !amount || !category || !date) {
        return res.status(400).json({ error: 'Missing required fields: id, amount, category, date' });
    }

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number (in cents)' });
    }

    if (!isValidDate(date)) {
        return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    try {
        const insert = db.prepare(`
      INSERT INTO expenses (id, amount, category, description, date)
      VALUES (?, ?, ?, ?, ?)
    `);
        insert.run(id, amount, category, description, date);
        res.status(201).json({ id, amount, category, description, date });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
            // Idempotency: Return existing resource if ID already exists
            const existing = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
            return res.status(200).json(existing);
        }
        console.error('Database error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /expenses
app.get('/expenses', (req, res) => {
    const { category, sort } = req.query;

    let query = 'SELECT * FROM expenses';
    const params = [];

    if (category && category !== 'All') {
        query += ' WHERE category = ?';
        params.push(category);
    }

    // Sorting logic
    if (sort === 'date_desc') {
        query += ' ORDER BY date DESC, created_at DESC';
    } else if (sort === 'date_asc') {
        query += ' ORDER BY date ASC, created_at ASC';
    } else {
        // Default sort by created_at desc (newest created first)
        query += ' ORDER BY created_at DESC';
    }

    try {
        const expenses = db.prepare(query).all(...params);
        res.json(expenses);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
