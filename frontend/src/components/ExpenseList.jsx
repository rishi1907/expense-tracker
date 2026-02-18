import React, { useEffect, useState } from 'react';
import { getExpenses } from '../api';
import { Filter, ArrowUpDown, Calendar, DollarSign, Tag, Search, RefreshCw, AlertTriangle, ChevronDown } from 'lucide-react';

const CATEGORIES = ['All', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Education', 'Travel', 'Investments', 'Gifts', 'Rent', 'Other'];
const MONTHS = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const CATEGORY_COLORS = {
    Food: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Transport: 'bg-blue-100 text-blue-700 border-blue-200',
    Utilities: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Entertainment: 'bg-purple-100 text-purple-700 border-purple-200',
    Health: 'bg-red-100 text-red-700 border-red-200',
    Shopping: 'bg-pink-100 text-pink-700 border-pink-200',
    Education: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    Travel: 'bg-sky-100 text-sky-700 border-sky-200',
    Investments: 'bg-green-100 text-green-700 border-green-200',
    Gifts: 'bg-rose-100 text-rose-700 border-rose-200',
    Rent: 'bg-orange-100 text-orange-700 border-orange-200',
    Other: 'bg-slate-100 text-slate-700 border-slate-200'
};

const ExpenseList = ({ refreshTrigger }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1); // Default to current month (1-12)
    const [filterYear, setFilterYear] = useState(new Date().getFullYear());
    const [specificDate, setSpecificDate] = useState('');
    const [sortOrder, setSortOrder] = useState('date_desc');

    // Generate years list (current year back to 2020)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => currentYear - i);

    const fetchExpenses = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (filterCategory !== 'All') {
                params.category = filterCategory;
            }

            if (specificDate) {
                params.specific_date = specificDate;
            } else {
                if (filterYear !== 'All') {
                    params.year = filterYear;
                }
                if (filterMonth !== 'All') {
                    params.month = filterMonth;
                }
            }

            // Backend sort
            params.sort = sortOrder;

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
    }, [filterCategory, filterYear, filterMonth, specificDate, sortOrder, refreshTrigger]);

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

    // Calculate totals per category
    const categoryTotals = expenses.reduce((acc, expense) => {
        const cat = expense.category || 'Other';
        acc[cat] = (acc[cat] || 0) + expense.amount;
        return acc;
    }, {});

    return (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-300 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b-2 border-slate-300 bg-white sticky top-0 z-10">
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

                {/* Filters Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 items-end">
                    {/* Category Filter */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1 uppercase tracking-wider">Category</label>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="w-full pl-9 pr-10 py-2.5 rounded-xl border-2 border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none appearance-none bg-white cursor-pointer hover:border-slate-400 transition-colors"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Specific Date Filter */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1 uppercase tracking-wider">Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="date"
                                value={specificDate}
                                onChange={(e) => setSpecificDate(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border-2 border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all hover:border-slate-400 text-slate-600 placeholder-slate-400 min-h-[42px]"
                                placeholder="Select Date"
                            />
                        </div>
                    </div>

                    {/* Month Filter */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1 uppercase tracking-wider">Month</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <select
                                value={filterMonth}
                                onChange={(e) => {
                                    setFilterMonth(e.target.value);
                                    setSpecificDate(''); // Clear specific date when month changes
                                }}
                                disabled={!!specificDate}
                                className={`w-full pl-9 pr-10 py-2.5 rounded-xl border-2 border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none appearance-none bg-white cursor-pointer hover:border-slate-400 transition-colors ${specificDate ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}
                            >
                                <option value="All">All Months</option>
                                {MONTHS.slice(1).map((month, index) => (
                                    <option key={month} value={index + 1}>{month}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Year Filter */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1 uppercase tracking-wider">Year</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <select
                                value={filterYear}
                                onChange={(e) => {
                                    setFilterYear(e.target.value);
                                    setSpecificDate(''); // Clear specific date when year changes
                                }}
                                disabled={!!specificDate}
                                className={`w-full pl-9 pr-10 py-2.5 rounded-xl border-2 border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none appearance-none bg-white cursor-pointer hover:border-slate-400 transition-colors ${specificDate ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Sort */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1 uppercase tracking-wider">Sort</label>
                        <div className="relative">
                            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full pl-9 pr-10 py-2.5 rounded-xl border-2 border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none appearance-none bg-white cursor-pointer hover:border-slate-400 transition-colors"
                            >
                                <option value="date_desc">Newest First</option>
                                <option value="date_asc">Oldest First</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Summary View */}
                {expenses.length > 0 && (
                    <div className="mt-6 p-4 bg-slate-50 rounded-xl border-2 border-slate-200 flex gap-4 overflow-x-auto pb-4">
                        {Object.entries(categoryTotals).map(([cat, total]) => (
                            <div key={cat} className={`flex-shrink-0 px-4 py-3 rounded-xl border ${CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other} bg-white shadow-sm min-w-[140px]`}>
                                <div className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">{cat}</div>
                                <div className="text-lg font-bold">{formatCurrency(total)}</div>
                            </div>
                        ))}
                    </div>
                )}
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
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other}`}>
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
