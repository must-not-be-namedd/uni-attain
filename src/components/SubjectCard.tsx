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
      <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-primary">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {subject.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {subject.subjectType === 'theory' ? 'Theory' : 'Lab'}
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
              <div className="text-muted-foreground">To Target</div>
              <div className="font-semibold text-lg">
                {calculation.classesToAttendForTarget} classes
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onUpdate(subject.id, { 
                attendedClasses: subject.attendedClasses + 1,
                totalClasses: subject.totalClasses + 1 
              })}
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Attend
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onUpdate(subject.id, { 
                totalClasses: subject.totalClasses + 1 
              })}
            >
              <XCircle className="w-3 h-3 mr-1" />
              Bunk
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