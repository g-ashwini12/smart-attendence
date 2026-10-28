
import { store, Student, Session, CheckIn, LocationReport, AttendanceRecord } from './store';
import { CONFIG } from './config';

export class AttendanceLogic {
  /**
   * L5-L9: Reconcile counts and handle flags.
   */
  static reconcile(session: Session, students: Student[], checkins: CheckIn[], locations: LocationReport[]) {
    const checkedInStudents = Array.from(new Set(checkins.map(c => c.student_id)));
    const checkedInCount = checkedInStudents.length;
    const headcount = session.headcount;

    if (headcount === null) {
      throw new Error('HEADCOUNT_MISSING');
    }

    const difference = checkedInCount - headcount;
    const mismatch = Math.abs(difference) > CONFIG.HEADCOUNT_TOLERANCE;
    const warnings: string[] = [];
    const records: AttendanceRecord[] = [];

    // L6: No mismatch - simple pass
    if (!mismatch) {
      students.forEach(s => {
        const isCheckedIn = checkedInStudents.includes(s.id);
        records.push({
          session_id: session.id,
          student_id: s.id,
          roll_no: s.roll_no,
          name: s.name,
          identity_signal: isCheckedIn ? 'matched' : 'none',
          location_status: null,
          final_status: isCheckedIn ? 'present' : 'absent',
          flag_reason: null,
          resolved_by_professor: false,
        });
      });
    }
    // L7: Mismatch - run location tiebreaker
    else {
      students.forEach(s => {
        const isCheckedIn = checkedInStudents.includes(s.id);

        if (!isCheckedIn) {
          records.push({
            session_id: session.id,
            student_id: s.id,
            roll_no: s.roll_no,
            name: s.name,
            identity_signal: 'none',
            location_status: null,
            final_status: 'absent',
            flag_reason: null,
            resolved_by_professor: false,
          });
          return;
        }

        const loc = locations.find(l => l.student_id === s.id)?.location_status || 'unreported';
        let status: 'present' | 'flagged' = 'present';
        let reason: 'location_elsewhere' | 'location_unreported' | null = null;

        if (loc === 'elsewhere') {
          status = 'flagged';
          reason = 'location_elsewhere';
        } else if (loc === 'unreported') {
          status = 'flagged';
          reason = 'location_unreported';
        }

        records.push({
          session_id: session.id,
          student_id: s.id,
          roll_no: s.roll_no,
          name: s.name,
          identity_signal: 'matched',
          location_status: loc,
          final_status: status,
          flag_reason: reason,
          resolved_by_professor: false,
        });
      });
    }

    // L8: Generate warnings
    if (difference > 0) {
      const flaggedCount = records.filter(r => r.final_status === 'flagged').length;
      if (flaggedCount < difference) {
        warnings.push(`N more students checked in than were counted, but fewer than N show a location mismatch. Manual review recommended.`);
      }
    } else if (difference < 0) {
      warnings.push(`Headcount exceeds check-ins by ${Math.abs(difference)}. An unenrolled person may be present.`);
    }

    return {
      records,
      warnings,
      mismatch,
      difference
    };
  }

  /**
   * L11: Calculate attendance rate.
   */
  static calculateRate(present: number, total: number): number {
    if (total === 0) return 0;
    return parseFloat(((present / total) * 100).toFixed(1));
  }
}
