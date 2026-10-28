
'use client';

import React, { useState, useEffect } from 'react';
import { store, Session, AttendanceRecord } from '@/lib/store';
import AnimatedContent from '@/app/components/animations/AnimatedContent';

export default function ProfessorView() {
  const [session, setSession] = useState<Session | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [course, setCourse] = useState('CS201');
  const [room, setRoom] = useState('R204');
  const [loading, setLoading] = useState(false);

  const startSession = async () => {
    setLoading(true);
    const res = await fetch('/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ course_code: course, classroom_id: room }),
    });
    const data = await res.json();
    setSession(data);
    setLoading(false);
  };

  const recordHeadcount = async (count: number) => {
    if (!session) return;
    const res = await fetch('/api/sessions/headcount', {
      method: 'POST',
      body: JSON.stringify({ session_id: session.id, count, source: 'manual' }),
    });
    const data = await res.json();
    setSession(data);
  };

  const reconcile = async () => {
    if (!session) return;
    const res = await fetch('/api/sessions/reconcile', {
      method: 'POST',
      body: JSON.stringify({ session_id: session.id }),
    });
    const data = await res.json();
    setRecords(data.records);
    setSession({ ...session, status: 'reconciled', warnings: data.warnings });
  };

  const resolveFlag = async (studentId: string, status: 'present' | 'absent') => {
    await fetch('/api/sessions/resolve', {
      method: 'POST',
      body: JSON.stringify({ session_id: session?.id, student_id: studentId, status }),
    });
    // Refresh records
    const res = await fetch(`/api/sessions?id=${session?.id}`);
    // In a real app, we'd fetch actual attendance records here
    reconcile();
  };

  const closeSession = async () => {
    if (!session) return;
    const res = await fetch('/api/sessions/close', {
      method: 'POST',
      body: JSON.stringify({ session_id: session.id }),
    });
    if (res.ok) {
      alert('Session closed successfully');
      setSession(null);
      setRecords([]);
    } else {
      const data = await res.json();
      alert(data.error.message);
    }
  };

  if (!session) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-slate-100 text-center">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Start New Class Session</h2>
        <div className="space-y-4 mb-8">
          <div className="text-left">
            <label className="text-sm font-medium text-slate-500 ml-1">Course Code</label>
            <input
              value={course} onChange={e => setCourse(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-[#065A82] outline-none transition-all"
            />
          </div>
          <div className="text-left">
            <label className="text-sm font-medium text-slate-500 ml-1">Classroom</label>
            <input
              value={room} onChange={e => setRoom(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-[#065A82] outline-none transition-all"
            />
          </div>
        </div>
        <button
          onClick={startSession}
          disabled={loading}
          className="w-full py-4 bg-[#065A82] text-white rounded-xl font-bold hover:bg-[#054a6d] transition-colors shadow-lg disabled:opacity-50"
        >
          {loading ? 'Initializing...' : 'Start Session'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Session Status Badge */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white ${
            session.status === 'open' ? 'bg-blue-500' :
            session.status === 'headcount_recorded' ? 'bg-amber-500' :
            session.status === 'reconciled' ? 'bg-indigo-500' : 'bg-green-500'
          }`}>
            {session.status}
          </span>
          <h2 className="text-2xl font-bold text-slate-800">{session.course_code} - {session.classroom_id}</h2>
        </div>
        <button onClick={closeSession} className="px-6 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-all">
          Close Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Control Pipeline */}
        <div className="space-y-6">
          <AnimatedContent distance={20} delay={0.1} trigger="mount">
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs">1</span>
                Identity Signal
              </h3>
              <p className="text-sm text-slate-500 mb-4">Students are currently scanning in. Watch the live count.</p>
              <div className="text-4xl font-black text-[#065A82] mb-4">
                {/* In a real app, this would be a live socket. For demo, we'll just show a placeholder */}
                Wait for check-ins...
              </div>
            </div>
          </AnimatedContent>

          <AnimatedContent distance={20} delay={0.2} trigger="mount">
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs">2</span>
                Presence Signal
              </h3>
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Enter Headcount"
                  className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 ring-[#065A82]"
                  onKeyDown={(e) => e.key === 'Enter' && recordHeadcount(parseInt((e.target as HTMLInputElement).value))}
                />
                <button
                  onClick={() => recordHeadcount(0)} // Demo
                  className="px-6 py-3 bg-[#065A82] text-white rounded-xl font-bold hover:bg-[#054a6d] transition-all"
                >
                  Record
                </button>
              </div>
            </div>
          </AnimatedContent>

          <AnimatedContent distance={20} delay={0.3} trigger="mount">
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs">3</span>
                Reconciliation
              </h3>
              <button
                onClick={reconcile}
                disabled={session.status === 'closed'}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50"
              >
                Run Reconciliation
              </button>
            </div>
          </AnimatedContent>
        </div>

        {/* Right Column: Results & Flags */}
        <div className="space-y-6">
          {session.warnings.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm font-medium">
              ⚠️ {session.warnings[0]}
            </div>
          )}

          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
            <h3 className="text-lg font-bold mb-4 text-slate-800">Attendance Records</h3>
            {records.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-sm">
                No records generated yet. Run reconciliation.
              </div>
            ) : (
              <div className="space-y-3">
                {records.map(r => (
                  <div key={r.student_id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <div>
                      <span className="font-bold text-slate-700">{r.roll_no}</span>
                      <span className="ml-2 text-slate-500 text-sm">{r.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        r.final_status === 'present' ? 'bg-green-100 text-green-700' :
                        r.final_status === 'absent' ? 'bg-slate-200 text-slate-600' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {r.final_status}
                      </span>
                      {r.final_status === 'flagged' && (
                        <div className="flex gap-1">
                          <button onClick={() => resolveFlag(r.student_id, 'present')} className="p-1 bg-white border border-slate-200 rounded hover:bg-green-50 text-green-600 text-xs font-bold">P</button>
                          <button onClick={() => resolveFlag(r.student_id, 'absent')} className="p-1 bg-white border border-slate-200 rounded hover:bg-red-50 text-red-600 text-xs font-bold">A</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
