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
```

## Project Notes

### Key Design Decisions
- **MongoDB vs SQLite**: Initial thought was SQLite for simplicity, but switched to MongoDB to leverage its flexible schema and better support for date-based querying (e.g., ISO dates) which was crucial for the filtering features.
- **Tailwind CSS**: Chosen for rapid UI development and easy responsiveness. The utility-first approach allowed for quick iteration on the "premium" feel (colors, shadows, borders) without wrestling with custom CSS files.
- **Component Structure**: Kept it simple with `ExpenseList` and `ExpenseForm`. Avoided over-engineering with a complex state manager like Redux since React's `useState` and prop drilling were sufficient for this scope.

### Trade-offs (Timebox Constraints)
- **Validation**: Input validation is primarily client-side (HTML5 attributes). Robust backend validation (e.g., using `zod` or `joi`) was omitted to save time.
- **Error Handling**: Basic try/catch blocks are used. A centralized error handling middleware would be better for a production app but was skipped.
- **Testing**: Manual verification was prioritized over writing automated unit/integration tests to deliver features faster.

### Intentional Omissions
- **User Authentication**: The app is single-user for now. Adding Auth0 or JWT would have consumed a significant portion of the timebox.
- **Edit/Delete Functionality**: Currently, expenses can only be added. Full CRUD (Update/Delete) was deprioritized to focus on the core "Add & View" flow and filtering capabilities.
- **Advanced Analytics**: Charts/Graphs (e.g., using Recharts) were considered but the "Summary View" (simple totals) was implemented instead as a quicker high-value alternative.

