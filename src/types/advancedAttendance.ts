// Enhanced types for Phase 2 advanced attendance features
export interface AdvancedAttendanceVariables {
  T: number; // total classes conducted so far
  A: number; // classes attended so far
  B: number; // absences so far = T - A
  P: number; // chosen target fraction (0.85 for 85%)
  Cpw: number; // classes per week
  K: number; // lookback window for trend calculations
  r: number; // recent missed-rate = absences in last K classes ÷ K
}

export interface BunkForecast {
  consecutive: {
    classes: number; // x_consec
    weeks: number;
    projectedDate: Date;
  };
  trend: {
    weeks: number; // n_weeks
    projectedDate: Date;
    isSafe: boolean; // if trend won't reach target
  };
}

export type MemeSeverity = 'safe' | 'cautious' | 'edge' | 'warning' | 'danger';

export interface MemeStatus {
  severity: MemeSeverity;
  distance: number; // currentPct - P%
  urgency: 'urgent' | 'mellow';
  message: string;
}

export interface AttendancePattern {
  type: 'weekly_count' | 'specific_days';
  classesPerWeek?: number; // d for weekly_count
  selectedDays?: string[]; // for specific_days
  totalClassesPerWeek: number; // Cpw
}

export interface PatternProjection {
  weeksNeeded: number;
  finalPercentage: number;
  isPossible: boolean;
  explanation: string;
}

export interface CIECheckpoint {
  name: string;
  totalClassesExpected: number; // S_cie
  requiredPresent: number;
  minAttendsNeeded: number;
  remainingClasses: number;
  isPossible: boolean;
  weeksNeeded: number;
}

export interface GroupMember {
  id: string;
  name: string;
  totalClasses: number;
  attendedClasses: number;
  targetPercentage: number;
}

export interface GroupBunkPlan {
  proposedMissedClasses: number;
  members: GroupMember[];
  safeMembers: string[];
  riskMembers: Array<{
    id: string;
    name: string;
    newPercentage: number;
    extraNeeded: number;
  }>;
  isGroupSafe: boolean;
}

export interface LifeEvent {
  name: string;
  startDate: Date;
  endDate: Date;
  expectedMissedClasses: number;
  newPercentage: number;
  catchupClassesNeeded: number;
  catchupWeeksNeeded: number;
}

export interface WeeklyMetrics {
  currentPercentage: number;
  previousPercentage: number;
  deltaPercentage: number;
  roastLevel: 'praise' | 'neutral' | 'mild' | 'savage' | 'critical';
  roastMessage: string;
}

export type AchievementType = 'lecture_ninja' | 'houdini' | 'last_minute_saver' | 'consistent_hero';

export interface Achievement {
  type: AchievementType;
  name: string;
  description: string;
  condition: string;
  unlocked: boolean;
  unlockedDate?: Date;
}

export interface ClassSchedule {
  daysOfWeek: string[]; // ['Monday', 'Wednesday', 'Friday']
  classesPerWeek: number;
  nextClassDate: Date;
}

export interface AttendanceSnapshot {
  date: Date;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
}

export interface TrendAnalysis {
  recentMissedRate: number; // r
  lookbackWindow: number; // K
  recentSnapshots: AttendanceSnapshot[];
  isImproving: boolean;
  isDeteriating: boolean;
}

export interface AdvancedAttendanceSettings {
  targetPercentage: number; // P
  lookbackWindow: number; // K
  classesPerWeek: number; // Cpw
  enableMemes: boolean;
  enableRoasts: boolean;
}