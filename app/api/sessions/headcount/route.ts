
import { NextResponse } from 'next/server';
import { store, Session } from '@/lib/store';

export async function POST(req: Request) {
  const { session_id, count, source } = await req.json();

  const session = store.getSession(session_id);
  if (!session) return NextResponse.json({ error: { code: 'SESSION_NOT_FOUND', message: 'Session not found' } }, { status: 404 });
  if (session.status !== 'open' && session.status !== 'headcount_recorded') {
    return NextResponse.json({ error: { code: 'SESSION_NOT_OPEN', message: 'Invalid session state for headcount.' } }, { status: 409 });
  }

  if (count < 0 || count > 1000 || isNaN(count)) {
    return NextResponse.json({ error: { code: 'INVALID_HEADCOUNT', message: 'Enter a whole number between 0 and 1000.' } }, { status: 422 });
  }

  session.headcount = count;
  session.headcount_source = source;
  session.status = 'headcount_recorded';
  store.saveSession(session);

  return NextResponse.json(session);
}
