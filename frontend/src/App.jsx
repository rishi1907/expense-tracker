import React, { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import { Wallet } from 'lucide-react';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleExpenseAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              ExpenseTracker
            </h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Simple & Reliable Personal Finance
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <ExpenseForm onExpenseAdded={handleExpenseAdded} />

            <div className="mt-6 bg-indigo-900 rounded-2xl p-6 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-20 h-20 bg-indigo-400 opacity-20 rounded-full blur-xl"></div>

              <h3 className="text-lg font-semibold mb-2 relative z-10">Pro Tip</h3>
              <p className="text-indigo-100 text-sm relative z-10">
                Regularly tracking your expenses can help you save up to 15% more each month. Keep it up!
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 h-full">
            <ExpenseList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
