
import { NextResponse } from 'next/server';
import { store, AttendanceRecord } from '@/lib/store';
import { AttendanceLogic } from '@/lib/attendance-logic';

export async function POST(req: Request) {
  const { session_id } = await req.json();
  const session = store.getSession(session_id);
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const records = store.getAttendanceForSession(session_id);
  const flagged = records.filter(r => r.final_status === 'flagged');

  if (flagged.length > 0) {
    return NextResponse.json({ error: { code: 'FLAGS_PENDING', message: 'Resolve all flagged students before closing.' } }, { status: 409 });
  }

  session.status = 'closed';
  session.closed_at = new Date().toISOString();
  store.saveSession(session);

  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get('session_id');
  const format = searchParams.get('format') || 'json';

  const session = store.getSession(session_id!);
  const records = store.getAttendanceForSession(session_id!);
  const students = store.getStudents();

  const present = records.filter(r => r.final_status === 'present').length;
  const rate = AttendanceLogic.calculateRate(present, students.length);

  const report = {
    session_id: session?.id,
    course_code: session?.course_code,
    attendance_rate: rate,
    records: records.sort((a, b) => a.roll_no.localeCompare(b.roll_no)),
  };

  if (format === 'csv') {
    const csv = [
      ['Roll No', 'Name', 'Status'],
      ...records.map(r => [r.roll_no, r.name, r.final_status])
    ].map(row => row.join(',')).join('\n');

    return new NextResponse(csv, {
      headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=report.csv' }
    });
  }

  return NextResponse.json(report);
}
