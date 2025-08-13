import { useState } from 'react';
import { BookOpen, Calculator, Trash2, Edit, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Subject, AttendanceSettings } from '@/types/attendance';
import { calculateAttendance } from '@/utils/attendanceCalculations';
import { EditSubjectDialog } from './EditSubjectDialog';

interface SubjectCardProps {
  subject: Subject;
  settings: AttendanceSettings;
  onUpdate: (id: string, updates: Partial<Subject>) => void;
  onDelete: (id: string) => void;
}

export function SubjectCard({ subject, settings, onUpdate, onDelete }: SubjectCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const calculation = calculateAttendance(subject, settings.safeThreshold, settings.targetPercentage);
  
  const getWarningIcon = () => {
    switch (calculation.warningLevel) {
      case 'safe':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'danger':
        return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getWarningBadge = () => {
    switch (calculation.warningLevel) {
      case 'safe':
        return <Badge className="bg-success text-success-foreground">Safe Zone</Badge>;
      case 'warning':
        return <Badge className="bg-warning text-warning-foreground">Below Target</Badge>;
      case 'danger':
        return <Badge className="bg-destructive text-destructive-foreground">At Risk</Badge>;
    }
  };

  return (
    <>
      <Card className="group hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50 relative overflow-hidden">
        {/* Academic accent stripe */}
        <div className={`absolute left-0 top-0 w-1 h-full ${
          calculation.warningLevel === 'safe' ? 'bg-gradient-to-b from-green-500 to-emerald-600' :
          calculation.warningLevel === 'warning' ? 'bg-gradient-to-b from-amber-500 to-orange-600' :
          'bg-gradient-to-b from-red-500 to-pink-600'
        }`}></div>
        
        <CardHeader className="pb-3 relative">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  {subject.name}
                </span>
              </CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="font-medium border-slate-300 dark:border-slate-600">
                  {subject.subjectType === 'theory' ? '📚 Theory' : '🔬 Lab'}
                  {subject.credits && ` • ${subject.credits} Credits`}
                </Badge>
                {getWarningBadge()}
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditOpen(true)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(subject.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Attendance Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-1">
                {getWarningIcon()}
                Attendance
              </span>
              <span className="text-sm font-bold">
                {calculation.currentPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={calculation.currentPercentage} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{subject.attendedClasses} attended</span>
              <span>{subject.totalClasses} total</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground">Bunks Allowed</div>
              <div className="font-semibold text-lg">
                {calculation.allowedBunksRemaining}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">To 85% Safe</div>
              <div className="font-semibold text-lg">
                {calculation.classesToAttendFor85Percent} classes
              </div>
            </div>
          </div>

          {/* Helpful Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
              <div className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Quick Actions:</strong> Click "Attend" or "Bunk" buttons to instantly update your attendance stats. 
                Your real-time attendance percentage and bunk calculations will update immediately for accurate planning.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-green-200 hover:bg-green-50 hover:border-green-300 dark:border-green-800 dark:hover:bg-green-950/20"
              onClick={() => onUpdate(subject.id, { 
                attendedClasses: subject.attendedClasses + 1,
                totalClasses: subject.totalClasses + 1 
              })}
            >
              <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
              Attend Class
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-red-200 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:hover:bg-red-950/20"
              onClick={() => onUpdate(subject.id, { 
                totalClasses: subject.totalClasses + 1 
              })}
            >
              <XCircle className="w-3 h-3 mr-1 text-red-600" />
              Mark Absent
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditSubjectDialog
        subject={subject}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onUpdate={onUpdate}
      />
    </>
  );
}