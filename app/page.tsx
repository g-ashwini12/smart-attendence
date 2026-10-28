
'use client';

import React, { useState } from 'react';
import AnimatedContent from '@/app/components/animations/AnimatedContent';
import ProfessorView from '@/app/components/views/ProfessorView';
import StudentView from '@/app/components/views/StudentView';
import OperatorView from '@/app/components/views/OperatorView';

export default function SmartAttendanceApp() {
  const [role, setRole] = useState<'professor' | 'student' | 'operator'>('professor');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#065A82] rounded-lg flex items-center justify-center text-white font-bold text-xl">SA</div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Smart Attendance System</h1>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200">
          {(['professor', 'student', 'operator'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                role === r
                ? 'bg-white text-[#065A82] shadow-sm ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        <AnimatedContent trigger="mount" distance={30} duration={0.6}>
          {role === 'professor' && <ProfessorView />}
          {role === 'student' && <StudentView />}
          {role === 'operator' && <OperatorView />}
        </AnimatedContent>
      </main>
    </div>
  );
}
