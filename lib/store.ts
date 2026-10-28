
import { CONFIG } from './config';

export type Student = {
  id: string;
  name: string;
  roll_no: string;
  face_template: number[];
  consent_given_at: string;
  created_at: string;
};

export type Session = {
  id: string;
  course_code: string;
  classroom_id: string;
  status: 'open' | 'headcount_recorded' | 'reconciled' | 'closed';
  started_at: string;
  closed_at: string | null;
  headcount: number | null;
  headcount_source: 'camera' | 'manual' | null;
  warnings: string[];
};

export type CheckIn = {
  session_id: string;
  student_id: string;
  method: 'face' | 'demo' | 'manual';
  distance: number | null;
  checked_in_at: string;
};

export type LocationReport = {
  session_id: string;
  student_id: string;
  location_status: 'in_classroom' | 'elsewhere' | 'unreported';
  reported_at: string;
};

export type AttendanceRecord = {
  session_id: string;
  student_id: string;
  roll_no: string;
  name: string;
  identity_signal: 'matched' | 'none';
  location_status: 'in_classroom' | 'elsewhere' | 'unreported' | null;
  final_status: 'pending' | 'present' | 'absent' | 'flagged';
  flag_reason: 'location_elsewhere' | 'location_unreported' | null;
  resolved_by_professor: boolean;
};

/**
 * In-memory store for the demo.
 * Reset on server restart.
 */
export const db = {
  students: new Map<string, Student>(),
  sessions: new Map<string, Session>(),
  checkins: [] as CheckIn[],
  locationReports: [] as LocationReport[],
  attendanceRecords: [] as AttendanceRecord[],
};

export const store = {
  saveStudent: (s: Student) => db.students.set(s.id, s),
  getStudents: () => Array.from(db.students.values()),
  deleteStudent: (id: string) => db.students.delete(id),

  saveSession: (s: Session) => db.sessions.set(s.id, s),
  getSession: (id: string) => db.sessions.get(id),
  getAllSessions: () => Array.from(db.sessions.values()),

  addCheckin: (c: CheckIn) => db.checkins.push(c),
  getCheckinsForSession: (sid: string) => db.checkins.filter(c => c.session_id === sid),

  addLocationReport: (l: LocationReport) => db.locationReports.push(l),
  getLocationsForSession: (sid: string) => db.locationReports.filter(l => l.session_id === sid),

  setAttendanceRecords: (records: AttendanceRecord[]) => {
    db.attendanceRecords = records;
  },
  getAttendanceForSession: (sid: string) => db.attendanceRecords.filter(r => r.session_id === sid),

  resetAll: () => {
    db.students.clear();
    db.sessions.clear();
    db.checkins = [];
    db.locationReports = [];
    db.attendanceRecords = [];
  }
};
