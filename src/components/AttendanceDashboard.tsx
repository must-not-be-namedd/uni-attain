import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubjectCard } from './SubjectCard';
import { AddSubjectDialog } from './AddSubjectDialog';
import { OverallStats } from './OverallStats';
import { Subject, AttendanceSettings } from '@/types/attendance';

export function AttendanceDashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [settings, setSettings] = useState<AttendanceSettings>({
    safeThreshold: 85,
    targetPercentage: 75,
    weeklyClasses: 5
  });

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject = {
      ...subject,
      id: Date.now().toString()
    };
    setSubjects([...subjects, newSubject]);
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(subjects.map(subject => 
      subject.id === id ? { ...subject, ...updates } : subject
    ));
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 relative">
          {/* University-style header */}
          <div className="inline-block">
            <div className="text-xs text-muted-foreground mb-1 tracking-wider uppercase">
              Smart Attendance Management
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              The Grade-A Bunker
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-2 rounded-full"></div>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Smart attendance management system for college students to track, analyze, and optimize academic performance
          </p>
        </div>

        {/* Overall Stats */}
        <OverallStats subjects={subjects} settings={settings} />

        {/* Subjects Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/20 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Academic Subjects</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Real-time attendance tracking with instant calculations
              </p>
            </div>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          </div>

          {subjects.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-muted-foreground mb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Plus className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No subjects added yet</h3>
                  <p className="text-sm">Add your first subject to start tracking your attendance</p>
                </div>
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  variant="outline"
                >
                  Add Your First Subject
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  settings={settings}
                  onUpdate={updateSubject}
                  onDelete={deleteSubject}
                />
              ))}
            </div>
          )}
        </div>

        <AddSubjectDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={addSubject}
        />
      </div>
    </div>
  );
}