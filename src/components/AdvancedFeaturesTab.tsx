import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BunkForecastCard } from './BunkForecastCard';
import { ReverseCalculator } from './ReverseCalculator';
import { SafeBufferSlider } from './SafeBufferSlider';
import { CIEPanicButton } from './CIEPanicButton';
import { GroupBunkPlanner } from './GroupBunkPlanner';
import { LifeEventPlanner } from './LifeEventPlanner';
import { WeeklyRoastReport } from './WeeklyRoastReport';
import { AchievementBadges } from './AchievementBadges';
import { Subject, AttendanceSettings } from '@/types/attendance';
import { 
  calculateBunkForecast, 
  calculateMemeStatus, 
  checkAchievements,
  calculateWeeklyRoast 
} from '@/utils/advancedCalculations';
import { 
  TrendingUp, 
  Calculator, 
  Shield, 
  AlertCircle, 
  Users, 
  Calendar, 
  MessageSquare, 
  Trophy 
} from 'lucide-react';

interface AdvancedFeaturesTabProps {
  subjects: Subject[];
  settings: AttendanceSettings;
  onSettingsChange: (settings: AttendanceSettings) => void;
}

export function AdvancedFeaturesTab({ 
  subjects, 
  settings, 
  onSettingsChange 
}: AdvancedFeaturesTabProps) {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(
    subjects.length > 0 ? subjects[0] : null
  );

  // Calculate overall metrics for the selected subject
  const getSubjectMetrics = (subject: Subject | null) => {
    if (!subject) return null;

    const variables = {
      T: subject.totalClasses,
      A: subject.attendedClasses,
      B: subject.totalClasses - subject.attendedClasses,
      P: settings.targetPercentage / 100,
      Cpw: settings.weeklyClasses || 3,
      K: 7, // 7-day lookback window
      r: 0.1 // Mock recent missed rate, would be calculated from real data
    };

    const currentPercentage = (subject.attendedClasses / subject.totalClasses) * 100;
    const forecast = calculateBunkForecast(variables);
    const memeStatus = calculateMemeStatus(
      currentPercentage, 
      settings.targetPercentage,
      forecast.consecutive.classes
    );

    return {
      variables,
      currentPercentage,
      forecast,
      memeStatus
    };
  };

  const metrics = getSubjectMetrics(selectedSubject);

  // Mock weekly data for roast report
  const weeklyMetrics = calculateWeeklyRoast(
    metrics?.currentPercentage || 0,
    (metrics?.currentPercentage || 0) - 2 // Mock previous week
  );

  // Mock achievements data
  const achievements = checkAchievements([], metrics?.variables.A || 0, metrics?.variables.T || 0);

  const handleTargetChange = (newTarget: number) => {
    onSettingsChange({
      ...settings,
      targetPercentage: newTarget
    });
  };

  return (
    <div className="space-y-6">
      {/* Subject Selector */}
      {subjects.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Subject for Analysis</label>
          <select
            value={selectedSubject?.id || ''}
            onChange={(e) => {
              const subject = subjects.find(s => s.id === e.target.value);
              setSelectedSubject(subject || null);
            }}
            className="w-full p-2 border rounded-md bg-background"
          >
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name} ({((subject.attendedClasses / subject.totalClasses) * 100).toFixed(1)}%)
              </option>
            ))}
          </select>
        </div>
      )}

      {!selectedSubject ? (
        <div className="text-center py-12 text-muted-foreground">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Add some subjects to access advanced features</p>
        </div>
      ) : (
        <Tabs defaultValue="forecast" className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
            <TabsTrigger value="forecast" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span className="hidden sm:inline">Forecast</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-1">
              <Calculator className="h-3 w-3" />
              <span className="hidden sm:inline">Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="buffer" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span className="hidden sm:inline">Buffer</span>
            </TabsTrigger>
            <TabsTrigger value="cie" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span className="hidden sm:inline">CIE</span>
            </TabsTrigger>
            <TabsTrigger value="group" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span className="hidden sm:inline">Group</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="roast" className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span className="hidden sm:inline">Roast</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              <span className="hidden sm:inline">Awards</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forecast">
            {metrics && (
              <BunkForecastCard
                forecast={metrics.forecast}
                memeStatus={metrics.memeStatus}
                currentPercentage={metrics.currentPercentage}
              />
            )}
          </TabsContent>

          <TabsContent value="calculator">
            <ReverseCalculator
              totalClasses={selectedSubject.totalClasses}
              attendedClasses={selectedSubject.attendedClasses}
              classesPerWeek={settings.weeklyClasses || 3}
            />
          </TabsContent>

          <TabsContent value="buffer">
            {metrics && (
              <SafeBufferSlider
                currentPercentage={metrics.currentPercentage}
                targetPercentage={settings.targetPercentage}
                onTargetChange={handleTargetChange}
              />
            )}
          </TabsContent>

          <TabsContent value="cie">
            <CIEPanicButton
              totalClasses={selectedSubject.totalClasses}
              attendedClasses={selectedSubject.attendedClasses}
              targetPercentage={settings.targetPercentage}
              classesPerWeek={settings.weeklyClasses || 3}
            />
          </TabsContent>

          <TabsContent value="group">
            <GroupBunkPlanner
              subjects={subjects}
              targetPercentage={settings.targetPercentage}
            />
          </TabsContent>

          <TabsContent value="events">
            <LifeEventPlanner
              totalClasses={selectedSubject.totalClasses}
              attendedClasses={selectedSubject.attendedClasses}
              targetPercentage={settings.targetPercentage}
              classesPerWeek={settings.weeklyClasses || 3}
            />
          </TabsContent>

          <TabsContent value="roast">
            <WeeklyRoastReport metrics={weeklyMetrics} />
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementBadges achievements={achievements} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}