
import { NextResponse } from 'next/server';
import { store, Student } from '@/lib/store';

export async function POST(req: Request) {
  const { action } = await req.json();

  if (action === 'load') {
    store.resetAll();
    const sampleStudents: Student[] = [
      { id: 'S001', name: 'Aditi Sharma', roll_no: '25CS001', face_template: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8], consent_given_at: new Date().toISOString(), created_at: new Date().toISOString() },
      { id: 'S002', name: 'Rahul Verma', roll_no: '25CS002', face_template: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9], consent_given_at: new Date().toISOString(), created_at: new Date().toISOString() },
      { id: 'S003', name: 'Meera Nair', roll_no: '25CS003', face_template: [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.1], consent_given_at: new Date().toISOString(), created_at: new Date().toISOString() },
      { id: 'S004', name: 'Karan Patel', roll_no: '25CS004', face_template: [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.1, 0.2], consent_given_at: new Date().toISOString(), created_at: new Date().toISOString() },
      { id: 'S005', name: 'Sneha Iyer', roll_no: '25CS005', face_template: [0.5, 0.6, 0.7, 0.8, 0.9, 0.1, 0.2, 0.3], consent_given_at: new Date().toISOString(), created_at: new Date().toISOString() },
      { id: 'S006', name: 'Arjun Reddy', roll_no: '25CS006', face_template: [0.6, 0.7, 0.8, 0.9, 0.1, 0.2, 0.3, 0.4], consent_given_at: new Date().toISOString(), created_at: new Date().toISOString() },
      { id: 'S007', name: 'Divya Menon', roll_no: '25CS007', face_template: [0.7, 0.8, 0.9, 0.1, 0.2, 0.3, 0.4, 0.5], consent_given_at: new Date().toISOString(), created_at: new Date().toISOString() },
      { id: 'S008', name: 'Farhan Ali', roll_no: '25CS008', face_template: [0.8, 0.9, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6], consent_given_at: new Date().toISOString(), created_at: new Date().toISOString() },
      { id: 'S009', name: 'Neha Gupta', roll_no: '25CS009', face_template: [0.9, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7], consent_given_at: new Date().toISOString(), created_at: new Date().toISOString() },
      { id: 'S010', name: 'Vikram Rao', roll_no: '25CS010', face_template: [0.1, 0.4, 0.7, 0.1, 0.4, 0.7, 0.1, 0.4], consent_given_at: new Date().toISOString(), created_at: new Date().toISOString() },
    ];
    sampleStudents.forEach(s => store.saveStudent(s));
    return NextResponse.json({ success: true, count: 10 });
  }

  if (action === 'reset') {
    store.resetAll();
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
