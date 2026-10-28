
import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST(req: Request) {
  const { session_id, student_id, status } = await req.json();
  const records = store.getAttendanceForSession(session_id);
  const record = records.find(r => r.student_id === student_id);

  if (!record || record.final_status !== 'flagged') {
    return NextResponse.json({ error: { code: 'NOT_FLAGGED', message: 'This student is not awaiting review.' } }, { status: 409 });
  }

  record.final_status = status; // 'present' or 'absent'
  record.resolved_by_professor = true;

  return NextResponse.json({ success: true });
}
