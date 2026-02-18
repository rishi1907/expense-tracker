# Expense Tracker

A minimal full-stack Expense Tracker application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Add Expenses**: Record amount, category, date, and description.
- **View Expenses**: List all expenses with filtering by category and sorting by date.
- **Idempotency**: Prevents duplicate submissions using unique IDs.
- **Responsive Design**: Polished UI built with Tailwind CSS.
- **Robustness**: Handles network flakiness with exponential backoff retries.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Axios.
- **Backend**: Node.js, Express, Mongoose.
- **Database**: MongoDB (Atlas or Local).

## Prerequisites

- Node.js (v14+ recommended)
- MongoDB (Running locally or an Atlas connection string)

## Setup Instructions

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory and add your MongoDB connection string:
    ```env
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    # Example: mongodb://localhost:27017/expense-tracker
    ```
4.  Start the server:
    ```bash
    npm start
    ```
    The server will run on `http://localhost:3000`.

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## API Endpoints

- `GET /`: Health check ("Backend is running").
- `GET /expenses`: Retrieve expenses (supports `?category=Food&sort=date_desc`).
- `POST /expenses`: Create a new expense.

## Project Structure

```
expense-tracker/
├── backend/         # Express API
│   ├── models/      # Mongoose models
│   ├── db.js        # Database connection
│   └── server.js    # Entry point
└── frontend/        # React App
    ├── src/
    │   ├── components/
    │   └── api.js   # API client with retry logic
    └── tailwind.config.js
```
