import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createExpense } from '../api';

const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other'];

const ExpenseForm = ({ onExpenseAdded }) => {
    const [formData, setFormData] = useState({
        amount: '',
        category: 'Food',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setError(null);

        const expenseId = uuidv4(); // Idempotency key
        const payload = {
            id: expenseId,
            ...formData,
            amount: Math.round(parseFloat(formData.amount) * 100), // Convert to cents
        };

        try {
            await createExpense(payload);
            setStatus('success');
            setFormData({
                amount: '',
                category: 'Food',
                description: '',
                date: new Date().toISOString().split('T')[0],
            });
            if (onExpenseAdded) onExpenseAdded();

            // Reset success message after 3 seconds
            setTimeout(() => setStatus('idle'), 3000);
        } catch (err) {
            console.error(err);
            setError('Failed to save expense. Please try again.');
            setStatus('error');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                Add New Expense
            </h2>

            {status === 'success' && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 text-sm border border-green-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    Expense added successfully!
                </div>
            )}

            {status === 'error' && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 text-sm border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Amount</label>
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">₹</span>
                            <input
                                type="number"
                                name="amount"
                                step="0.01"
                                min="0.01"
                                required
                                value={formData.amount}
                                onChange={handleChange}
                                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all hover:border-slate-300"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all bg-white hover:border-slate-300 cursor-pointer"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Date</label>
                    <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all hover:border-slate-300"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Description</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all hover:border-slate-300"
                        placeholder="What was this for?"
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 mt-2"
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Add Expense'
                    )}
                </button>
            </form>
        </div>
    );
};

export default ExpenseForm;
