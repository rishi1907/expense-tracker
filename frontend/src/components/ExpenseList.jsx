import React, { useEffect, useState } from 'react';
import { getExpenses } from '../api';
import { Filter, ArrowUpDown, Calendar, DollarSign, Tag, Search, RefreshCw, AlertTriangle } from 'lucide-react';

const CATEGORIES = ['All', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other'];

const ExpenseList = ({ refreshTrigger }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterCategory, setFilterCategory] = useState('All');
    const [sortOrder, setSortOrder] = useState('date_desc'); // date_desc, date_asc

    const fetchExpenses = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (filterCategory !== 'All') {
                params.category = filterCategory;
            }
            // We'll handle sorting in frontend for smoother UX or pass to backend
            // Backend supports sort=date_desc. Let's start with backend sort for date_desc.
            // But for date_asc, we might need manual sort if backend only supports desc.
            // Let's implement client-side sorting for flexibility since list might be small.
            // Actually, plan said backend supports date_desc. Let's use backend filtering.

            const response = await getExpenses(params);
            let data = response.data;

            // Client-side sorting
            data.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (sortOrder === 'date_desc') return dateB - dateA;
                return dateA - dateB;
            });

            setExpenses(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load expenses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [filterCategory, sortOrder, refreshTrigger]);

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const formatCurrency = (cents) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(cents / 100);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">Your Expenses</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {expenses.length} transaction{expenses.length !== 1 ? 's' : ''} found
                        </p>
                    </div>

                    <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
                        <span className="text-xs text-indigo-600 font-medium uppercase tracking-wider">Total</span>
                        <div className="text-2xl font-bold text-indigo-700">{formatCurrency(totalAmount)}</div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none appearance-none bg-white cursor-pointer hover:border-slate-300 transition-colors"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative flex-1">
                        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none appearance-none bg-white cursor-pointer hover:border-slate-300 transition-colors"
                        >
                            <option value="date_desc">Newest First</option>
                            <option value="date_asc">Oldest First</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                        <p className="text-sm">Loading transactions...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-red-500 px-6 text-center">
                        <AlertTriangle className="w-8 h-8 mb-2" />
                        <p className="text-sm">{error}</p>
                        <button
                            onClick={fetchExpenses}
                            className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : expenses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 px-6 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-lg font-medium text-slate-600">No expenses found</p>
                        <p className="text-sm mt-1">
                            {filterCategory !== 'All'
                                ? `No expenses found for "${filterCategory}".`
                                : "Add your first expense to get started!"}
                        </p>
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {expenses.map((expense) => (
                            <li key={expense.id} className="p-4 hover:bg-slate-50 transition-colors group">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Tag className="w-5 h-5 text-indigo-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800">{expense.description || 'No description'}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200">
                                                    {expense.category}
                                                </span>
                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(expense.date)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="font-semibold text-slate-800">
                                        {formatCurrency(expense.amount)}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ExpenseList;
