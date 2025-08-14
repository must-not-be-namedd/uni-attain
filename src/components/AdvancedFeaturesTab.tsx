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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Bunk Forecast - Purple Theme */}
            <div className="tour-bunk-forecast relative group">
              <div className="relative bg-card/50 backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 hover:shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 border-purple-500/30 hover:border-purple-400/50">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">Bunk Forecast</span>
                </div>
                {metrics && (
                  <BunkForecastCard
                    forecast={metrics.forecast}
                    memeStatus={metrics.memeStatus}
                    currentPercentage={metrics.currentPercentage}
                    targetPercentage={customTargetPercentage}
                  />
                )}
              </div>
            </div>

            {/* Reverse Calculator - Blue Theme */}
            <div className="tour-reverse-calculator relative group">
              <div className="relative bg-card/50 backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 hover:shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 border-blue-500/30 hover:border-blue-400/50">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="h-5 w-5 text-blue-400" />
                  <span className="text-sm font-medium text-blue-300">Reverse Calculator</span>
                </div>
                <ReverseCalculator
                  totalClasses={selectedSubject.totalClasses}
                  attendedClasses={selectedSubject.attendedClasses}
                  classesPerWeek={settings.weeklyClasses || 3}
                  targetPercentage={customTargetPercentage}
                />
              </div>
            </div>

            {/* Safe Buffer Slider - Green Theme */}
            <div className="tour-safe-buffer relative group">
              <div className="relative bg-card/50 backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 hover:shadow-lg shadow-green-500/20 hover:shadow-green-500/40 border-green-500/30 hover:border-green-400/50">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-medium text-green-300">Safe Buffer</span>
                </div>
                {metrics && (
                  <SafeBufferSlider
                    currentPercentage={metrics.currentPercentage}
                    targetPercentage={customTargetPercentage}
                    onTargetChange={setCustomTargetPercentage}
                  />
                )}
              </div>
            </div>

            {/* CIE Panic Button - Red Theme */}
            <div className="relative group">
              <div className="relative bg-card/50 backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 hover:shadow-lg shadow-red-500/20 hover:shadow-red-500/40 border-red-500/30 hover:border-red-400/50">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <span className="text-sm font-medium text-red-300">CIE Panic Mode</span>
                </div>
                <CIEPanicButton
                  totalClasses={selectedSubject.totalClasses}
                  attendedClasses={selectedSubject.attendedClasses}
                  targetPercentage={customTargetPercentage}
                  classesPerWeek={settings.weeklyClasses || 3}
                />
              </div>
            </div>

            {/* Group Bunk Planner - Orange Theme */}
            <div className="tour-group-planner relative group">
              <div className="relative bg-card/50 backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 hover:shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 border-orange-500/30 hover:border-orange-400/50">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-orange-400" />
                  <span className="text-sm font-medium text-orange-300">Group Planner</span>
                </div>
                <GroupBunkPlanner
                  subjects={subjects}
                  targetPercentage={customTargetPercentage}
                />
              </div>
            </div>

            {/* Life Event Planner - Indigo Theme */}
            <div className="tour-life-planner relative group">
              <div className="relative bg-card/50 backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 hover:shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 border-indigo-500/30 hover:border-indigo-400/50">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-indigo-400" />
                  <span className="text-sm font-medium text-indigo-300">Life Events</span>
                </div>
                <LifeEventPlanner
                  totalClasses={selectedSubject.totalClasses}
                  attendedClasses={selectedSubject.attendedClasses}
                  targetPercentage={customTargetPercentage}
                  classesPerWeek={settings.weeklyClasses || 3}
                />
              </div>
            </div>

            {/* Weekly Roast Report - Pink Theme */}
            <div className="relative group">
              <div className="relative bg-card/50 backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 hover:shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 border-pink-500/30 hover:border-pink-400/50">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="h-5 w-5 text-pink-400" />
                  <span className="text-sm font-medium text-pink-300">Weekly Roast</span>
                </div>
                <WeeklyRoastReport metrics={weeklyMetrics} />
              </div>
            </div>

            {/* Quick Stats - Cyan Theme */}
            <div className="tour-quick-stats relative group">
              <div className="relative bg-card/50 backdrop-blur-sm border rounded-xl p-6 transition-all duration-300 hover:shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 border-cyan-500/30 hover:border-cyan-400/50">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm font-medium text-cyan-300">Quick Stats</span>
                </div>
                <QuickStats 
                  totalClasses={selectedSubject.totalClasses}
                  attendedClasses={selectedSubject.attendedClasses}
                  currentPercentage={metrics?.currentPercentage || 0}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}