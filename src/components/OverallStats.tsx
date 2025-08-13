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

  const totalBunksAllowed = calculations.reduce((sum, calc) => 
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

      {/* Bunks Available */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bunks Available</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBunksAllowed}</div>
          <p className="text-xs text-muted-foreground">
            Classes you can safely miss
          </p>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status Summary</CardTitle>
          {status === 'safe' && <CheckCircle className="h-4 w-4 text-success" />}
          {status === 'warning' && <AlertCircle className="h-4 w-4 text-warning" />}
          {status === 'danger' && <AlertCircle className="h-4 w-4 text-destructive" />}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {safeSubjects > 0 && (
              <Badge className="bg-success text-success-foreground mr-2">
                {safeSubjects} Safe
              </Badge>
            )}
            {warningSubjects > 0 && (
              <Badge className="bg-warning text-warning-foreground mr-2">
                {warningSubjects} Warning
              </Badge>
            )}
            {dangerSubjects > 0 && (
              <Badge className="bg-destructive text-destructive-foreground">
                {dangerSubjects} At Risk
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Subject status breakdown
          </p>
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