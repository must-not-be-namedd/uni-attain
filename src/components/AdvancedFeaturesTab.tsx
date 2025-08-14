import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BunkForecastCard } from './BunkForecastCard';
import { ReverseCalculator } from './ReverseCalculator';
import { SafeBufferSlider } from './SafeBufferSlider';
import { CIEPanicButton } from './CIEPanicButton';
import { GroupBunkPlanner } from './GroupBunkPlanner';
import { LifeEventPlanner } from './LifeEventPlanner';
import { WeeklyRoastReport } from './WeeklyRoastReport';
import { QuickStats } from './QuickStats';
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
  const [customTargetPercentage, setCustomTargetPercentage] = useState(85);

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
      {/* Global Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 glass-effect rounded-xl border border-border/50">
        {subjects.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject for Analysis</label>
            <select
              value={selectedSubject?.id || ''}
              onChange={(e) => {
                const subject = subjects.find(s => s.id === e.target.value);
                setSelectedSubject(subject || null);
              }}
              className="w-full p-3 border rounded-lg bg-card/50 backdrop-blur-sm text-foreground"
            >
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} ({((subject.attendedClasses / subject.totalClasses) * 100).toFixed(1)}%)
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Target Attendance %</label>
          <input
            type="number"
            min="0"
            max="100"
            value={customTargetPercentage}
            onChange={(e) => setCustomTargetPercentage(Number(e.target.value) || 85)}
            className="w-full p-3 border rounded-lg bg-card/50 backdrop-blur-sm text-foreground"
            placeholder="85"
          />
        </div>
      </div>

      {!selectedSubject ? (
        <div className="text-center py-12 text-muted-foreground">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Add some subjects to access advanced features</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Direct Feature Grid - All features listed directly */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bunk Forecast */}
            <div className="tour-bunk-forecast border-2 border-purple-500/50 rounded-lg p-1">
              {metrics && (
                <BunkForecastCard
                  forecast={metrics.forecast}
                  memeStatus={metrics.memeStatus}
                  currentPercentage={metrics.currentPercentage}
                  targetPercentage={customTargetPercentage}
                />
              )}
            </div>

            {/* Reverse Calculator */}
            <div className="tour-reverse-calculator border-2 border-blue-500/50 rounded-lg p-1">
              <ReverseCalculator
                totalClasses={selectedSubject.totalClasses}
                attendedClasses={selectedSubject.attendedClasses}
                classesPerWeek={settings.weeklyClasses || 3}
                targetPercentage={customTargetPercentage}
              />
            </div>

            {/* Safe Buffer Slider */}
            <div className="tour-safe-buffer border-2 border-green-500/50 rounded-lg p-1">
              {metrics && (
                <SafeBufferSlider
                  currentPercentage={metrics.currentPercentage}
                  targetPercentage={customTargetPercentage}
                  onTargetChange={setCustomTargetPercentage}
                />
              )}
            </div>

            {/* CIE Panic Button */}
            <div className="border-2 border-red-500/50 rounded-lg p-1">
              <CIEPanicButton
                totalClasses={selectedSubject.totalClasses}
                attendedClasses={selectedSubject.attendedClasses}
                targetPercentage={customTargetPercentage}
                classesPerWeek={settings.weeklyClasses || 3}
              />
            </div>

            {/* Group Bunk Planner */}
            <div className="tour-group-planner border-2 border-orange-500/50 rounded-lg p-1">
              <GroupBunkPlanner
                subjects={subjects}
                targetPercentage={customTargetPercentage}
              />
            </div>

            {/* Life Event Planner */}
            <div className="tour-life-planner border-2 border-indigo-500/50 rounded-lg p-1">
              <LifeEventPlanner
                totalClasses={selectedSubject.totalClasses}
                attendedClasses={selectedSubject.attendedClasses}
                targetPercentage={customTargetPercentage}
                classesPerWeek={settings.weeklyClasses || 3}
              />
            </div>

            {/* Weekly Roast Report */}
            <div className="border-2 border-pink-500/50 rounded-lg p-1">
              <WeeklyRoastReport metrics={weeklyMetrics} />
            </div>

            {/* Quick Stats */}
            <div className="tour-quick-stats border-2 border-cyan-500/50 rounded-lg p-1">
              <QuickStats 
                totalClasses={selectedSubject.totalClasses}
                attendedClasses={selectedSubject.attendedClasses}
                currentPercentage={metrics?.currentPercentage || 0}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}