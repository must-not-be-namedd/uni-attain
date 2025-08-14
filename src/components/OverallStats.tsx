import { TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Subject, AttendanceSettings } from '@/types/attendance';
import { calculateAttendance } from '@/utils/attendanceCalculations';

interface OverallStatsProps {
  subjects: Subject[];
  settings: AttendanceSettings;
}

export function OverallStats({ subjects, settings }: OverallStatsProps) {
  if (subjects.length === 0) {
    return null;
  }

  const calculations = subjects.map(subject => 
    calculateAttendance(subject, settings.safeThreshold, settings.targetPercentage)
  );

  const overallAttendance = subjects.reduce((sum, subject) => 
    sum + subject.attendedClasses, 0
  ) / subjects.reduce((sum, subject) => 
    sum + subject.totalClasses, 0
  ) * 100;

  const totalSafeBunksAvailable = calculations.reduce((sum, calc) => 
    sum + calc.allowedBunksRemaining, 0
  );

  const safeSubjects = calculations.filter(calc => calc.warningLevel === 'safe').length;
  const warningSubjects = calculations.filter(calc => calc.warningLevel === 'warning').length;
  const dangerSubjects = calculations.filter(calc => calc.warningLevel === 'danger').length;

  const getOverallStatus = () => {
    if (dangerSubjects > 0) return 'danger';
    if (warningSubjects > 0) return 'warning';
    return 'safe';
  };

  const status = getOverallStatus();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Overall Attendance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overallAttendance.toFixed(1)}%</div>
          <Progress value={overallAttendance} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Across {subjects.length} subjects
          </p>
        </CardContent>
      </Card>

      {/* Safe Bunks Available */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Safe Bunks Available</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{totalSafeBunksAvailable}</div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Total classes you can skip across all subjects while staying above 85%
            </p>
            <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md border border-primary/20">
              📊 Check individual subjects for detailed bunk calculations
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Academic Status</CardTitle>
          {status === 'safe' && <CheckCircle className="h-4 w-4 text-success" />}
          {status === 'warning' && <AlertCircle className="h-4 w-4 text-warning" />}
          {status === 'danger' && <AlertCircle className="h-4 w-4 text-destructive" />}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="space-y-2">
              {safeSubjects > 0 && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-success text-success-foreground">
                    {safeSubjects} Safe
                  </Badge>
                  <span className="text-xs text-muted-foreground">Above target attendance</span>
                </div>
              )}
              {warningSubjects > 0 && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-warning text-warning-foreground">
                    {warningSubjects} Warning
                  </Badge>
                  <span className="text-xs text-muted-foreground">Below target but above 85%</span>
                </div>
              )}
              {dangerSubjects > 0 && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-destructive text-destructive-foreground">
                    {dangerSubjects} At Risk
                  </Badge>
                  <span className="text-xs text-muted-foreground">May not get condonation</span>
                </div>
              )}
            </div>
            
            {/* Overall Status Description */}
            <div className="pt-2 border-t border-border">
              {status === 'safe' && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  🎯 All subjects are on track for successful completion
                </p>
              )}
              {status === 'warning' && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  📚 Some subjects need attention to reach target attendance
                </p>
              )}
              {status === 'danger' && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  🚨 Immediate action required to avoid academic penalties
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safe Threshold */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Safe Threshold</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{settings.safeThreshold}%</div>
          <p className="text-xs text-muted-foreground">
            Minimum for condonation
          </p>
        </CardContent>
      </Card>
    </div>
  );
}