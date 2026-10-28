
import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { AttendanceLogic } from '@/lib/attendance-logic';

export async function POST(req: Request) {
  const { session_id } = await req.json();
  const session = store.getSession(session_id);
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const students = store.getStudents();
  const checkins = store.getCheckinsForSession(session_id);
  const locations = store.getLocationsForSession(session_id);

  try {
    const { records, warnings, mismatch, difference } = AttendanceLogic.reconcile(session, students, checkins, locations);

    session.status = 'reconciled';
    session.warnings = warnings;
    store.saveSession(session);
    store.setAttendanceRecords(records);

    return NextResponse.json({
      session_id: session.id,
      status: session.status,
      checked_in_count: checkins.length,
      headcount: session.headcount,
      difference,
      mismatch,
      location_check_ran: mismatch,
      counts: {
        present: records.filter(r => r.final_status === 'present').length,
        absent: records.filter(r => r.final_status === 'absent').length,
        flagged: records.filter(r => r.final_status === 'flagged').length,
        enrolled: students.length,
      },
      records,
      warnings,
    });
  } catch (e: any) {
    return NextResponse.json({ error: { code: e.message, message: e.message } }, { status: 409 });
  }
}
