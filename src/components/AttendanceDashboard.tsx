import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Plus, BookOpen, Zap } from 'lucide-react';
import { Subject, AttendanceSettings } from '@/types/attendance';
import { SubjectCard } from './SubjectCard';
import { AddSubjectDialog } from './AddSubjectDialog';
import { EditSubjectDialog } from './EditSubjectDialog';
import { OverallStats } from './OverallStats';
import { AdvancedFeaturesTab } from './AdvancedFeaturesTab';
import { BulletinBoard } from './BulletinBoard';
import { StickyNote } from './StickyNote';
import { FeatureShowcase } from './FeatureShowcase';
import { TourGuide, TourButton } from './TourGuide';

export function AttendanceDashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [settings, setSettings] = useState<AttendanceSettings>({
    targetPercentage: 85,
    safeThreshold: 85,
    weeklyClasses: 5
  });
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isTourRunning, setIsTourRunning] = useState(false);

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
    <BulletinBoard>
      <div className="container mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <StickyNote color="yellow" size="lg" className="mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <GraduationCap className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Grade-A Bunker</h1>
              </div>
              <p className="text-sm leading-relaxed">
                Master your attendance like a pro! Track, plan, and bunk strategically while keeping your grades safe. 
                Because sometimes you need a break, but your GPA doesn't! 🎯
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap mt-3">
                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">Smart Planning</span>
                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Risk-Free</span>
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Group Tools</span>
              </div>
            </div>
          </StickyNote>
        </div>

        {/* Feature Showcase */}
        <FeatureShowcase />

        {/* Overall Stats */}
        {subjects.length > 0 && (
          <div className="tour-overall-stats">
            <OverallStats subjects={subjects} settings={settings} />
          </div>
        )}

        {/* Main Content */}
        <StickyNote color="blue" className="mx-auto max-w-4xl">
          <Tabs defaultValue="subjects" className="space-y-6">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
              <TabsTrigger value="subjects" className="tour-subjects-tab flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Subjects
              </TabsTrigger>
              <TabsTrigger value="advanced" className="tour-advanced-tab flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Advanced Features
              </TabsTrigger>
            </TabsList>

            <TabsContent value="subjects" className="space-y-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold mb-2">📚 Your Subjects</h2>
                <p className="text-sm text-gray-700 mb-4">Track attendance for each subject individually</p>
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="flex items-center gap-2 mx-auto"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Subject
                </Button>
              </div>
              
              {subjects.length === 0 ? (
                <div className="text-center py-8 space-y-4">
                  <BookOpen className="h-8 w-8 mx-auto text-gray-600 opacity-50" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-700">No subjects yet</h3>
                    <p className="text-sm text-gray-600">
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
        </StickyNote>

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

        {/* Tour Guide */}
        <TourGuide 
          run={isTourRunning}
          onClose={() => setIsTourRunning(false)}
        />
        
        <TourButton onStartTour={() => setIsTourRunning(true)} />
      </div>
    </BulletinBoard>
  );
}