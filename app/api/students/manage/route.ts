
import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  return NextResponse.json(store.getStudents());
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  store.deleteStudent(id);
  return NextResponse.json({ success: true });
}
