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

        {/* Get Started Button */}
        <div className="text-center my-8">
          <StickyNote color="green" size="lg" className="mx-auto">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">🎯 Ready to Master Your Attendance?</h3>
              <p className="text-base">Start tracking and planning your bunks like a pro!</p>
              <Button 
                onClick={() => window.location.href = '/app'}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
                size="lg"
              >
                🚀 Get Started Now
              </Button>
              <p className="text-xs text-green-700 mt-2">Click to enter the full app experience</p>
            </div>
          </StickyNote>
        </div>

        {/* Overall Stats */}
        {subjects.length > 0 && (
          <div className="tour-overall-stats">
            <OverallStats subjects={subjects} settings={settings} />
          </div>
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