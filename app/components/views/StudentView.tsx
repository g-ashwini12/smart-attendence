
'use client';

import React, { useState } from 'react';

export default function StudentView() {
  const [step, setStep] = useState<'enroll' | 'checkin'>('enroll');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleEnroll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get('name'),
      roll_no: formData.get('roll_no'),
      consent: formData.get('consent') === 'on',
      image: 'data:image/jpeg;base64,FAKE_IMAGE_DATA', // Simulated camera capture
    };

    const res = await fetch('/api/students', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setMessage('Successfully enrolled! You can now check in.');
      setStep('checkin');
    } else {
      const data = await res.json();
      setMessage(data.error.message);
    }
    setLoading(false);
  };

  const handleCheckIn = async () => {
    setLoading(true);
    // In a real app, we'd get the current session ID from a global state or API
    const res = await fetch('/api/sessions/checkin', {
      method: 'POST',
      body: JSON.stringify({
        session_id: 'SES_DEMO', // Should be dynamic
        image: 'data:image/jpeg;base64,FAKE_IMAGE_DATA',
      }),
    });

    if (res.ok) {
      setMessage('Check-in successful!');
    } else {
      const data = await res.json();
      setMessage(data.error?.message || 'Check-in failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      {step === 'enroll' ? (
        <div className="p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
          <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Student Enrollment</h2>
          <form onSubmit={handleEnroll} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-500 ml-1">Full Name</label>
              <input name="name" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-[#065A82]" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 ml-1">Roll Number</label>
              <input name="roll_no" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-[#065A82]" />
            </div>
            <div className="flex items-center gap-2 py-2">
              <input type="checkbox" name="consent" id="consent" required className="w-4 h-4 accent-[#065A82]" />
              <label htmlFor="consent" className="text-sm text-slate-600">I consent to face data storage for attendance</label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#065A82] text-white rounded-xl font-bold hover:bg-[#054a6d] transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Capture & Enroll'}
            </button>
          </form>
        </div>
      ) : (
        <div className="p-8 bg-white rounded-2xl shadow-xl border border-slate-100 text-center">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Class Check-in</h2>
          <div className="w-48 h-48 bg-slate-100 rounded-2xl mx-auto mb-6 flex items-center justify-center border-2 border-dashed border-slate-300">
            <span className="text-slate-400 text-sm">Camera Preview</span>
          </div>
          <button
            onClick={handleCheckIn}
            disabled={loading}
            className="w-full py-4 bg-[#065A82] text-white rounded-xl font-bold hover:bg-[#054a6d] transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? 'Scanning...' : 'Scan Face to Check-in'}
          </button>
        </div>
      )}
      {message && (
        <div className="mt-6 p-4 bg-blue-50 text-blue-700 rounded-xl text-center text-sm font-medium">
          {message}
        </div>
      )}
    </div>
  );
}
