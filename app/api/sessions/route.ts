
import { NextResponse } from 'next/server';
import { store, Session } from '@/lib/store';

export async function POST(req: Request) {
  const { course_code, classroom_id } = await req.json();

  const session: Session = {
    id: `SES${Date.now()}`,
    course_code,
    classroom_id,
    status: 'open',
    started_at: new Date().toISOString(),
    closed_at: null,
    headcount: null,
    headcount_source: null,
    warnings: [],
  };

  store.saveSession(session);
  return NextResponse.json(session);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const session = store.getSession(id);
  if (!session) return NextResponse.json({ error: { code: 'SESSION_NOT_FOUND', message: 'That session could not be found.' } }, { status: 404 });

  return NextResponse.json(session);
}
