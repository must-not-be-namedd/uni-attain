import { Subject, AttendanceCalculation } from '@/types/attendance';

export function calculateAttendance(
  subject: Subject,
  safeThreshold: number = 85,
  targetPercentage: number = 75
): AttendanceCalculation {
  const { totalClasses, attendedClasses, credits, subjectType } = subject;
  
  // Current attendance percentage
  const currentPercentage = (attendedClasses / totalClasses) * 100;
  
  // Already absent classes
  const alreadyAbsent = totalClasses - attendedClasses;
  
  // Max absences by credit rule (only for theory subjects)
  const maxAbsencesByCredit = subjectType === 'theory' && credits ? credits : 0;
  
  // Max absences by safe threshold
  const maxAbsencesBySafeThreshold = totalClasses - Math.ceil((safeThreshold * totalClasses) / 100);
  
  // Allowed bunks remaining
  let allowedBunksRemaining;
  if (subjectType === 'lab') {
    allowedBunksRemaining = Math.max(0, maxAbsencesBySafeThreshold - alreadyAbsent);
  } else {
    allowedBunksRemaining = Math.max(0, Math.min(
      maxAbsencesByCredit - alreadyAbsent,
      maxAbsencesBySafeThreshold - alreadyAbsent
    ));
  }
  
  // Classes to attend to reach 85% safe threshold
  const classesToAttendFor85Percent = calculateClassesToReachTarget(
    attendedClasses,
    totalClasses,
    85
  );
  
  // Classes to attend to reach target percentage
  const classesToAttendForTarget = calculateClassesToReachTarget(
    attendedClasses,
    totalClasses,
    targetPercentage
  );
  
  // Warning level
  let warningLevel: 'safe' | 'warning' | 'danger' = 'safe';
  if (currentPercentage < 85) {
    warningLevel = 'danger';
  } else if (currentPercentage < targetPercentage) {
    warningLevel = 'warning';
  }
  
  return {
    currentPercentage,
    alreadyAbsent,
    maxAbsencesByCredit,
    maxAbsencesBySafeThreshold,
    allowedBunksRemaining,
    classesToAttendForTarget,
    classesToAttendFor85Percent,
    warningLevel
  };
}

function calculateClassesToReachTarget(
  attended: number,
  total: number,
  targetPercentage: number
): number {
  if ((attended / total) * 100 >= targetPercentage) {
    return 0;
  }
  
  // Solve: (A + x) / (T + x) >= target/100
  // x >= (target * T - 100 * A) / (100 - target)
  const numerator = (targetPercentage * total) - (100 * attended);
  const denominator = 100 - targetPercentage;
  
  if (denominator <= 0) return 0;
  
  return Math.max(0, Math.ceil(numerator / denominator));
}

export function simulateAttendance(
  subject: Subject,
  futureClasses: number,
  futureAttended: number
): number {
  const newTotal = subject.totalClasses + futureClasses;
  const newAttended = subject.attendedClasses + futureAttended;
  return (newAttended / newTotal) * 100;
}