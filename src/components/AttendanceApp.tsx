import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Zap, Home } from 'lucide-react';
import { Subject, AttendanceSettings } from '@/types/attendance';
import { SubjectCard } from './SubjectCard';
import { AddSubjectDialog } from './AddSubjectDialog';
import { EditSubjectDialog } from './EditSubjectDialog';
import { OverallStats } from './OverallStats';
import { AdvancedFeaturesTab } from './AdvancedFeaturesTab';

export function AttendanceApp() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [settings, setSettings] = useState<AttendanceSettings>({
    targetPercentage: 85,
    safeThreshold: 85,
    weeklyClasses: 5
  });
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Grade-A Bunker</h1>
              <p className="text-sm text-muted-foreground">Smart Attendance Management</p>
            </div>
          </div>
        </div>

        {/* Overall Stats */}
        {subjects.length > 0 && (
          <OverallStats subjects={subjects} settings={settings} />
        )}

        {/* Main Content */}
        <Tabs defaultValue="subjects" className="space-y-6">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
            <TabsTrigger value="subjects" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Subjects
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Advanced Features
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subjects" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">📚 Your Subjects</h2>
              <p className="text-sm text-muted-foreground mb-4">Track attendance for each subject individually</p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Add Subject
              </Button>
            </div>
            
            {subjects.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <div>
                  <h3 className="text-lg font-medium">No subjects yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Add your first subject to start tracking attendance
                  </p>
                </div>
              </div>
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
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedFeaturesTab 
              subjects={subjects}
              settings={settings}
              onSettingsChange={setSettings}
            />
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <AddSubjectDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={addSubject}
        />

        {editingSubject && (
          <EditSubjectDialog
            subject={editingSubject}
            open={true}
            onOpenChange={(open) => !open && setEditingSubject(null)}
            onUpdate={updateSubject}
          />
        )}
      </div>
    </div>
  );
}