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
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            VTU Attendance Tracker
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your attendance, calculate bunks, and plan your academic success
          </p>
        </div>

        {/* Overall Stats */}
        <OverallStats subjects={subjects} settings={settings} />

        {/* Subjects Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Subjects</h2>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-200"
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