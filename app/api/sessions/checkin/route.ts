
import { NextResponse } from 'next/server';
import { store, CheckIn } from '@/lib/store';
import { VisionService } from '@/lib/vision-service';
import { CONFIG } from '@/lib/config';

export async function POST(req: Request) {
  const { session_id, image, demo_student_id, student_id, manual } = await req.json();

  const session = store.getSession(session_id);
  if (!session) return NextResponse.json({ error: { code: 'SESSION_NOT_FOUND', message: 'Session not found' } }, { status: 404 });
  if (session.status !== 'open') return NextResponse.json({ error: { code: 'SESSION_NOT_OPEN', message: 'This session is no longer accepting check-ins.' } }, { status: 409 });

  let matchedStudentId: string | null = null;
  let distance: number | null = null;
  let method: 'face' | 'demo' | 'manual' = 'face';

  if (manual) {
    matchedStudentId = student_id;
    method = 'manual';
  } else if (demo_student_id) {
    matchedStudentId = demo_student_id;
    method = 'demo';
  } else if (image) {
    try {
      const { template } = await VisionService.extractFaceTemplate(image);
      const enrolled = store.getStudents().map(s => ({ student_id: s.id, template: s.face_template }));
      const match = VisionService.matchFace(template, enrolled, CONFIG.FACE_MATCH_THRESHOLD);
      matchedStudentId = match.student_id;
      distance = match.distance;
    } catch (e: any) {
      return NextResponse.json({ error: { code: 'VISION_NOT_CONFIGURED', message: e.message } }, { status: 501 });
    }
  }

  if (!matchedStudentId) {
    return NextResponse.json({ result: 'unmatched', student_id: null, method, already_checked_in: false, checked_in_count: store.getCheckinsForSession(session_id).length }, { status: 200 });
  }

  const existing = store.getCheckinsForSession(session_id).find(c => c.student_id === matchedStudentId);
  const already_checked_in = !!existing;

  if (!already_checked_in) {
    store.addCheckin({
      session_id,
      student_id: matchedStudentId,
      method,
      distance,
      checked_in_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    result: 'matched',
    student_id: matchedStudentId,
    method,
    already_checked_in,
    checked_in_count: store.getCheckinsForSession(session_id).length,
  });
}
