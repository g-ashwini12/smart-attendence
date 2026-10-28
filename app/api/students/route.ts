
import { NextResponse } from 'next/server';
import { store, Student } from '@/lib/store';
import { VisionService } from '@/lib/vision-service';
import { CONFIG } from '@/lib/config';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, roll_no, consent, image } = body;

    if (!consent) {
      return NextResponse.json({ error: { code: 'CONSENT_REQUIRED', message: 'Consent is required before a face can be enrolled.' } }, { status: 400 });
    }

    const existing = store.getStudents().find(s => s.roll_no.toLowerCase() === roll_no.toLowerCase());
    if (existing) {
      return NextResponse.json({ error: { code: 'DUPLICATE_ROLL_NO', message: 'That roll number is already enrolled.' } }, { status: 409 });
    }

    if (!image) {
      return NextResponse.json({ error: { code: 'NO_FACE_DETECTED', message: 'No image provided.' } }, { status: 422 });
    }

    const { template, quality } = await VisionService.extractFaceTemplate(image);

    const student: Student = {
      id: `S${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name,
      roll_no,
      face_template: template,
      consent_given_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    store.saveStudent(student);
    return NextResponse.json({ student_id: student.id }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: e.message } }, { status: 500 });
  }
}
