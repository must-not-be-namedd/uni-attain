import { useState } from 'react';
import { Plus, Sparkles, Target, TrendingUp, Users, Calendar, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { SubjectCard } from './SubjectCard';
import { AddSubjectDialog } from './AddSubjectDialog';
import { OverallStats } from './OverallStats';
import { AdvancedFeaturesTab } from './AdvancedFeaturesTab';
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-40 h-40 bg-cyan-500/30 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300 font-medium">Smart Attendance Management</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold gradient-text leading-tight animate-slide-up">
                The Grade-A Bunker
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 mx-auto rounded-full animate-glow"></div>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-4 animate-scale-in">
              <p className="text-xl text-muted-foreground leading-relaxed">
                The most <span className="text-purple-400 font-semibold">intelligent</span> attendance management system for college students.
                Track, analyze, and optimize your academic performance with 
                <span className="text-cyan-400 font-semibold"> AI-powered insights</span>.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  <Target className="w-3 h-3 mr-1" />
                  Smart Forecasting
                </Badge>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trend Analysis
                </Badge>
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                  <Users className="w-3 h-3 mr-1" />
                  Group Planning
                </Badge>
                <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                  <Shield className="w-3 h-3 mr-1" />
                  Risk Assessment
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Overall Stats */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <OverallStats subjects={subjects} settings={settings} />
        </div>

        {/* Feature Tabs */}
        <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Tabs defaultValue="subjects" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-card/50 backdrop-blur-sm border border-border/50">
              <TabsTrigger value="subjects" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                Subjects
              </TabsTrigger>
              <TabsTrigger value="advanced" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Sparkles className="w-4 h-4 mr-2" />
                Advanced Features
              </TabsTrigger>
            </TabsList>

            <TabsContent value="subjects" className="space-y-6">
              {/* Subjects Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between glass-effect p-6 rounded-2xl border border-border/50">
                  <div>
                    <h2 className="text-3xl font-bold gradient-text">Academic Subjects</h2>
                    <p className="text-muted-foreground mt-2">
                      Real-time attendance tracking with <span className="text-purple-400">instant calculations</span> & 
                      <span className="text-cyan-400"> predictive analytics</span>
                    </p>
                  </div>
                  <Button 
                    onClick={() => setIsAddDialogOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 text-white border-0 hover-lift"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Subject
                  </Button>
                </div>

                {subjects.length === 0 ? (
                  <Card className="text-center py-16 glass-effect border-border/50">
                    <CardContent>
                      <div className="text-muted-foreground mb-6">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 flex items-center justify-center animate-pulse">
                          <Plus className="w-10 h-10 text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-bold gradient-text mb-3">Ready to dominate your attendance?</h3>
                        <p className="text-lg">Add your first subject and unlock the power of smart attendance tracking</p>
                      </div>
                      <Button 
                        onClick={() => setIsAddDialogOpen(true)}
                        className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0 px-8 py-3 text-lg hover-lift"
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        Start Your Journey
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {subjects.map((subject, index) => (
                      <div 
                        key={subject.id}
                        className="animate-scale-in hover-lift"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <SubjectCard
                          subject={subject}
                          settings={settings}
                          onUpdate={updateSubject}
                          onDelete={deleteSubject}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="advanced">
              <AdvancedFeaturesTab 
                subjects={subjects}
                settings={settings}
                onSettingsChange={setSettings}
              />
            </TabsContent>

          </Tabs>
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