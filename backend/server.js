const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const Expense = require('./models/Expense');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(cors({
    origin: ['https://expense-tracker-33mu.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(bodyParser.json());

// Root endpoint
// Root endpoint
app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Helper function to validate date format (YYYY-MM-DD)
const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regex)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
};

// POST /expenses
app.post('/expenses', async (req, res) => {
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
        const newExpense = await Expense.create({
            id,
            amount,
            category,
            description,
            date
        });

        // Mongoose returns the full document including _id and __v, 
        // but we'll return what the client gave us + standardized fields if needed.
        res.status(201).json({
            id: newExpense.id,
            amount: newExpense.amount,
            category: newExpense.category,
            description: newExpense.description,
            date: newExpense.date
        });
    } catch (err) {
        // Duplicate key error (idempotency)
        if (err.code === 11000) {
            try {
                const existing = await Expense.findOne({ id });
                return res.status(200).json(existing);
            } catch (findErr) {
                console.error('Error finding existing expense:', findErr);
                return res.status(500).json({ error: 'Internal server error during idempotency check' });
            }
        }
        console.error('Database error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /expenses
app.get('/expenses', async (req, res) => {
    const { category, sort, year, month, specific_date } = req.query;

    let query = {};

    if (category && category !== 'All') {
        query.category = category;
    }

    // Date Filtering
    if (specific_date) {
        // Specific Date (YYYY-MM-DD local time from client)
        // We want to match any time on that specific day
        const startOfDay = new Date(specific_date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(specific_date);
        endOfDay.setHours(23, 59, 59, 999);

        query.date = {
            $gte: startOfDay,
            $lte: endOfDay
        };
    } else if (year) {
        // Month/Year Filtering
        const yearInt = parseInt(year);
        let startDate, endDate;

        if (month && month !== 'All') {
            const monthInt = parseInt(month) - 1; // JS months are 0-indexed
            startDate = new Date(yearInt, monthInt, 1);
            endDate = new Date(yearInt, monthInt + 1, 0, 23, 59, 59, 999);
        } else {
            // Whole year
            startDate = new Date(yearInt, 0, 1);
            endDate = new Date(yearInt, 11, 31, 23, 59, 59, 999);
        }

        query.date = {
            $gte: startDate,
            $lte: endDate
        };
    }

    let sortOptions = {};
    // Sorting logic
    if (sort === 'date_desc') {
        sortOptions = { date: -1, created_at: -1 };
    } else if (sort === 'date_asc') {
        sortOptions = { date: 1, created_at: 1 };
    } else {
        // Default sort by created_at desc
        sortOptions = { created_at: -1 };
    }

    try {
        const expenses = await Expense.find(query).sort(sortOptions);
        res.json(expenses);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
