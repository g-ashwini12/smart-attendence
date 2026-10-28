
'use client';

import React, { useState } from 'react';

export default function OperatorView() {
  const [loading, setLoading] = useState(false);

  const triggerAction = async (action: 'load' | 'reset') => {
    setLoading(true);
    const res = await fetch('/api/demo', {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      alert(`Data ${action === 'load' ? 'loaded' : 'reset'} successfully`);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-20">
      <div className="p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Operator Control Panel</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="font-bold mb-2 text-slate-700">Demo Data</h3>
            <p className="text-sm text-slate-500 mb-6">Quickly populate the system with 10 fictional students for testing.</p>
            <button
              onClick={() => triggerAction('load')}
              disabled={loading}
              className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition-all shadow-sm"
            >
              Load Sample Class
            </button>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="font-bold mb-2 text-slate-700">System Reset</h3>
            <p className="text-sm text-slate-500 mb-6">Wipe all students, sessions, and attendance records.</p>
            <button
              onClick={() => triggerAction('reset')}
              disabled={loading}
              className="w-full py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-medium hover:bg-red-100 transition-all"
            >
              Reset All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
