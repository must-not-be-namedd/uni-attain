import { 
  AdvancedAttendanceVariables, 
  BunkForecast, 
  MemeStatus, 
  MemeSeverity,
  AttendancePattern, 
  PatternProjection,
  CIECheckpoint,
  GroupBunkPlan,
  GroupMember,
  LifeEvent,
  WeeklyMetrics,
  Achievement,
  AchievementType,
  TrendAnalysis,
  AttendanceSnapshot
} from '@/types/advancedAttendance';

// 1. Bunk Forecast (consecutive & trend)
export function calculateBunkForecast(
  variables: AdvancedAttendanceVariables,
  trendSnapshots: AttendanceSnapshot[] = []
): BunkForecast {
  const { T, A, P, Cpw } = variables;
  
  // A. Consecutive-bunk (pessimistic)
  // x_consec = max(0, floor((A / P) - T) + 1)
  const x_consec = Math.max(0, Math.floor((A / P) - T) + 1);
  const weeks_consec = Math.ceil(x_consec / Cpw);
  const consec_date = new Date();
  consec_date.setDate(consec_date.getDate() + weeks_consec * 7);

  // B. Trend-based forecast
  let trend_weeks = 0;
  let trend_date = new Date();
  let isSafe = true;

  if (trendSnapshots.length >= variables.K) {
    const recentSnapshots = trendSnapshots.slice(-variables.K);
    const recentAbsences = recentSnapshots.reduce((sum, snapshot, index) => {
      if (index === 0) return 0;
      const prevSnapshot = recentSnapshots[index - 1];
      return sum + (snapshot.totalClasses - prevSnapshot.totalClasses) - (snapshot.attendedClasses - prevSnapshot.attendedClasses);
    }, 0);
    
    const r = recentAbsences / variables.K;
    const D = r + P - 1;

    if (D > 0) {
      isSafe = false;
      const numerator = A - P * T;
      const denominator = Cpw * D;
      trend_weeks = Math.max(0, Math.floor(numerator / denominator) + 1);
      trend_date = new Date();
      trend_date.setDate(trend_date.getDate() + trend_weeks * 7);
    }
  }

  return {
    consecutive: {
      classes: x_consec,
      weeks: weeks_consec,
      projectedDate: consec_date
    },
    trend: {
      weeks: trend_weeks,
      projectedDate: trend_date,
      isSafe
    }
  };
}

// 2. Meme severity mapping
export function calculateMemeStatus(
  currentPct: number,
  targetPct: number,
  forecastClasses: number
): MemeStatus {
  const distance = currentPct - targetPct;
  
  let severity: MemeSeverity;
  let message: string;

  if (distance >= 10) {
    severity = 'safe';
    message = "You're crushing it! 🚀";
  } else if (distance >= 2) {
    severity = 'cautious';
    message = "Smooth sailing, but stay alert ⚠️";
  } else if (distance >= 0) {
    severity = 'edge';
    message = "Living on the edge! 😬";
  } else if (distance >= -5) {
    severity = 'warning';
    message = "Houston, we have a problem! 🚨";
  } else {
    severity = 'danger';
    message = "MAYDAY! MAYDAY! 💀";
  }

  const urgency = forecastClasses <= 3 ? 'urgent' : 'mellow';

  return { severity, distance, urgency, message };
}

// 3. Reverse Attendance Calculator
export function calculatePatternProjection(
  T: number,
  A: number,
  P: number,
  pattern: AttendancePattern,
  weeksToProject?: number,
  targetPercentage?: number
): PatternProjection {
  const Cpw = pattern.totalClassesPerWeek;
  let d: number;

  if (pattern.type === 'weekly_count') {
    d = pattern.classesPerWeek || 0;
  } else {
    d = pattern.selectedDays?.length || 0;
  }

  // For fixed n weeks
  if (weeksToProject) {
    const deltaT = weeksToProject * Cpw;
    const deltaA = weeksToProject * d;
    const finalPercentage = ((A + deltaA) / (T + deltaT)) * 100;
    
    return {
      weeksNeeded: weeksToProject,
      finalPercentage,
      isPossible: true,
      explanation: `After ${weeksToProject} weeks: ${finalPercentage.toFixed(1)}%`
    };
  }

  // For target find minimal n
  if (targetPercentage) {
    const targetFraction = targetPercentage / 100;
    const denominator = d - targetFraction * Cpw;
    
    if (denominator <= 0) {
      const numerator = targetFraction * T - A;
      if (numerator <= 0) {
        return {
          weeksNeeded: 0,
          finalPercentage: (A / T) * 100,
          isPossible: true,
          explanation: "Already at target!"
        };
      } else {
        return {
          weeksNeeded: Infinity,
          finalPercentage: 0,
          isPossible: false,
          explanation: "Impossible with this attendance pattern"
        };
      }
    }

    const n = Math.max(0, Math.ceil((targetFraction * T - A) / denominator));
    const finalA = A + n * d;
    const finalT = T + n * Cpw;
    const finalPercentage = (finalA / finalT) * 100;

    return {
      weeksNeeded: n,
      finalPercentage,
      isPossible: true,
      explanation: `Need ${n} weeks to reach ${targetPercentage}%`
    };
  }

  return {
    weeksNeeded: 0,
    finalPercentage: (A / T) * 100,
    isPossible: true,
    explanation: "No projection specified"
  };
}

// 4. CIE Panic Button
export function calculateCIECheckpoint(
  A: number,
  T: number,
  P: number,
  Cpw: number,
  S_cie: number,
  checkpointName: string
): CIECheckpoint {
  const requiredPresent = Math.ceil(P * S_cie);
  const minAttendsNeeded = Math.max(0, requiredPresent - A);
  const remainingClasses = S_cie - T;
  const isPossible = minAttendsNeeded <= remainingClasses;
  const weeksNeeded = Math.ceil(minAttendsNeeded / Cpw);

  return {
    name: checkpointName,
    totalClassesExpected: S_cie,
    requiredPresent,
    minAttendsNeeded,
    remainingClasses,
    isPossible,
    weeksNeeded
  };
}

// 5. Group Bunk Planner
export function calculateGroupBunkPlan(
  members: GroupMember[],
  proposedMissedClasses: number
): GroupBunkPlan {
  const safeMembers: string[] = [];
  const riskMembers: Array<{
    id: string;
    name: string;
    newPercentage: number;
    extraNeeded: number;
  }> = [];

  members.forEach(member => {
    const newTotal = member.totalClasses + proposedMissedClasses;
    const newPercentage = (member.attendedClasses / newTotal) * 100;
    const targetThreshold = Math.max(member.targetPercentage, 85);

    if (newPercentage >= targetThreshold) {
      safeMembers.push(member.id);
    } else {
      const requiredAttended = Math.ceil(targetThreshold * newTotal / 100);
      const extraNeeded = Math.max(0, requiredAttended - member.attendedClasses);
      
      riskMembers.push({
        id: member.id,
        name: member.name,
        newPercentage,
        extraNeeded
      });
    }
  });

  return {
    proposedMissedClasses,
    members,
    safeMembers,
    riskMembers,
    isGroupSafe: riskMembers.length === 0
  };
}

// 6. Life-Event Bunk Planner
export function calculateLifeEventImpact(
  A: number,
  T: number,
  P: number,
  Cpw: number,
  event: Omit<LifeEvent, 'newPercentage' | 'catchupClassesNeeded' | 'catchupWeeksNeeded'>
): LifeEvent {
  const T_event = T + event.expectedMissedClasses;
  const A_event = A; // no change if event missed classes
  const newPercentage = (A_event / T_event) * 100;
  
  // Catch-up formula: X = ceil((P × T_event - A_event) / (1 - P))
  const numerator = P * T_event - A_event;
  const denominator = 1 - P;
  const catchupClassesNeeded = denominator > 0 ? Math.max(0, Math.ceil(numerator / denominator)) : 0;
  const catchupWeeksNeeded = Math.ceil(catchupClassesNeeded / Cpw);

  return {
    ...event,
    newPercentage,
    catchupClassesNeeded,
    catchupWeeksNeeded
  };
}

// 8. Weekly Roast Report
export function calculateWeeklyRoast(
  currentPercentage: number,
  previousPercentage: number
): WeeklyMetrics {
  const deltaPercentage = currentPercentage - previousPercentage;
  
  let roastLevel: WeeklyMetrics['roastLevel'];
  let roastMessage: string;

  if (deltaPercentage >= 2) {
    roastLevel = 'praise';
    roastMessage = "You showed up — proud of you! 👏";
  } else if (deltaPercentage >= 0) {
    roastLevel = 'neutral';
    roastMessage = "Not bad, could be worse 😐";
  } else if (deltaPercentage >= -2) {
    roastLevel = 'mild';
    roastMessage = "You could do better... 😒";
  } else if (deltaPercentage >= -5) {
    roastLevel = 'savage';
    roastMessage = "You missed more than your alarm ⏰💀";
  } else {
    roastLevel = 'critical';
    roastMessage = "Attendance on life support 🏥💔";
  }

  // Additional roast for absolute percentage
  if (currentPercentage < 60) {
    roastMessage += " Your attendance is flatlining!";
  }

  return {
    currentPercentage,
    previousPercentage,
    deltaPercentage,
    roastLevel,
    roastMessage
  };
}

// 9. Attendance Achievements
export function checkAchievements(
  attendanceHistory: AttendanceSnapshot[],
  currentA: number,
  currentT: number
): Achievement[] {
  const achievements: Achievement[] = [];

  // Lecture Ninja: attended all classes in last 7 consecutive
  const lectureNinja = checkLectureNinja(attendanceHistory);
  achievements.push({
    type: 'lecture_ninja',
    name: 'Lecture Ninja',
    description: 'Attended all classes for 7 consecutive days',
    condition: 'Perfect attendance streak',
    unlocked: lectureNinja.unlocked,
    unlockedDate: lectureNinja.date
  });

  // The Houdini: absent for exactly 5 consecutive classes
  const houdini = checkHoudini(attendanceHistory);
  achievements.push({
    type: 'houdini',
    name: 'The Houdini',
    description: 'Vanished for exactly 5 consecutive classes',
    condition: '5 consecutive absences',
    unlocked: houdini.unlocked,
    unlockedDate: houdini.date
  });

  // Last-Minute Saver: improved from <75% to ≥85% within limited window
  const lastMinuteSaver = checkLastMinuteSaver(attendanceHistory);
  achievements.push({
    type: 'last_minute_saver',
    name: 'Last-Minute Saver',
    description: 'Rescued attendance from below 75% to above 85%',
    condition: 'Dramatic improvement',
    unlocked: lastMinuteSaver.unlocked,
    unlockedDate: lastMinuteSaver.date
  });

  // Consistent Hero: ≥90% in last 30 classes
  const consistentHero = checkConsistentHero(attendanceHistory, currentA, currentT);
  achievements.push({
    type: 'consistent_hero',
    name: 'Consistent Hero',
    description: 'Maintained ≥90% attendance over last 30 classes',
    condition: 'Long-term consistency',
    unlocked: consistentHero.unlocked,
    unlockedDate: consistentHero.date
  });

  return achievements;
}

// Helper functions for achievements
function checkLectureNinja(history: AttendanceSnapshot[]): { unlocked: boolean; date?: Date } {
  if (history.length < 7) return { unlocked: false };
  
  const recent7 = history.slice(-7);
  let perfectStreak = true;
  
  for (let i = 1; i < recent7.length; i++) {
    const classesAdded = recent7[i].totalClasses - recent7[i-1].totalClasses;
    const attendedAdded = recent7[i].attendedClasses - recent7[i-1].attendedClasses;
    if (classesAdded !== attendedAdded) {
      perfectStreak = false;
      break;
    }
  }
  
  return { unlocked: perfectStreak, date: perfectStreak ? recent7[recent7.length - 1].date : undefined };
}

function checkHoudini(history: AttendanceSnapshot[]): { unlocked: boolean; date?: Date } {
  if (history.length < 5) return { unlocked: false };
  
  // Look for exactly 5 consecutive missed classes
  for (let i = 4; i < history.length; i++) {
    let consecutiveMisses = 0;
    for (let j = i - 4; j <= i; j++) {
      if (j === 0) continue;
      const classesAdded = history[j].totalClasses - history[j-1].totalClasses;
      const attendedAdded = history[j].attendedClasses - history[j-1].attendedClasses;
      if (classesAdded > attendedAdded) {
        consecutiveMisses += (classesAdded - attendedAdded);
      } else {
        break;
      }
    }
    if (consecutiveMisses === 5) {
      return { unlocked: true, date: history[i].date };
    }
  }
  
  return { unlocked: false };
}

function checkLastMinuteSaver(history: AttendanceSnapshot[]): { unlocked: boolean; date?: Date } {
  if (history.length < 2) return { unlocked: false };
  
  for (let i = 1; i < history.length; i++) {
    const prevPct = history[i-1].percentage;
    const currPct = history[i].percentage;
    
    if (prevPct < 75 && currPct >= 85) {
      return { unlocked: true, date: history[i].date };
    }
  }
  
  return { unlocked: false };
}

function checkConsistentHero(
  history: AttendanceSnapshot[], 
  currentA: number, 
  currentT: number
): { unlocked: boolean; date?: Date } {
  if (currentT < 30) return { unlocked: false };
  
  // Calculate attendance over last 30 classes
  const last30Classes = Math.min(30, currentT);
  const attendedLast30 = currentA - (history.length > 0 ? 
    Math.max(0, currentA - last30Classes) : 0);
  
  const last30Percentage = (attendedLast30 / last30Classes) * 100;
  
  return { 
    unlocked: last30Percentage >= 90, 
    date: last30Percentage >= 90 ? new Date() : undefined 
  };
}

// 11. Edge case handlers
export function handleEdgeCases(T: number, A: number, P: number): {
  isValid: boolean;
  message?: string;
  adjustedValues?: { T: number; A: number; P: number };
} {
  // If T = 0
  if (T === 0) {
    return {
      isValid: true,
      message: "No classes yet - starting fresh!",
      adjustedValues: { T: 0, A: 0, P }
    };
  }

  // If P = 1.0 (100%)
  if (P >= 1.0) {
    return {
      isValid: true,
      message: "Perfect attendance required - every class counts!",
      adjustedValues: { T, A, P: 0.999 } // Adjust to avoid division by zero
    };
  }

  // Normal case
  return { isValid: true, adjustedValues: { T, A, P } };
}

// Date projection utilities
export function projectClassToDate(
  classesToAdd: number,
  classesPerWeek: number,
  currentDate: Date = new Date()
): Date {
  if (classesPerWeek <= 0) {
    // Return far future date if no classes per week
    const futureDate = new Date(currentDate);
    futureDate.setFullYear(futureDate.getFullYear() + 10);
    return futureDate;
  }

  const weeks = Math.floor(classesToAdd / classesPerWeek);
  const extraDays = Math.ceil((classesToAdd % classesPerWeek) * (7 / classesPerWeek));
  
  const projectedDate = new Date(currentDate);
  projectedDate.setDate(projectedDate.getDate() + weeks * 7 + extraDays);
  
  return projectedDate;
}