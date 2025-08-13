export type SubjectType = 'theory' | 'lab';

export interface Subject {
  id: string;
  name: string;
  credits?: number;
  totalClasses: number;
  attendedClasses: number;
  subjectType: SubjectType;
}

export interface AttendanceCalculation {
  currentPercentage: number;
  alreadyAbsent: number;
  maxAbsencesByCredit: number;
  maxAbsencesBySafeThreshold: number;
  allowedBunksRemaining: number;
  classesToAttendForTarget: number;
  warningLevel: 'safe' | 'warning' | 'danger';
}

export interface AttendanceSettings {
  safeThreshold: number;
  targetPercentage: number;
  weeklyClasses?: number;
}