import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Calendar, Users } from 'lucide-react';

interface QuickStatsProps {
  totalClasses: number;
  attendedClasses: number;
  currentPercentage: number;
  className?: string;
}

export function QuickStats({ 
  totalClasses, 
  attendedClasses, 
  currentPercentage, 
  className 
}: QuickStatsProps) {
  const missedClasses = totalClasses - attendedClasses;
  const streakDays = Math.min(attendedClasses, 7); // Simplified streak calculation
  const thisWeekAttended = Math.min(attendedClasses, 5); // Assume max 5 classes per week

  const getPerformanceLevel = () => {
    if (currentPercentage >= 95) return { level: 'Attendance God 🙏', color: 'bg-success text-success-foreground' };
    if (currentPercentage >= 85) return { level: 'Solid Student 📚', color: 'bg-primary text-primary-foreground' };
    if (currentPercentage >= 75) return { level: 'Playing with Fire 🔥', color: 'bg-warning text-warning-foreground' };
    return { level: 'Bunking Champion 😅', color: 'bg-destructive text-destructive-foreground' };
  };

  const performance = getPerformanceLevel();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Quick Stats
        </CardTitle>
        <CardDescription>
          Your attendance overview at a glance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Performance Level */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <span className="text-sm font-medium">Overall Performance</span>
          <Badge className={performance.color}>
            {performance.level}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Total Attended</span>
            </div>
            <p className="text-2xl font-bold text-primary">{attendedClasses}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-destructive" />
              <span className="text-sm text-muted-foreground">Classes Missed</span>
            </div>
            <p className="text-2xl font-bold text-destructive">{missedClasses}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-success" />
              <span className="text-sm text-muted-foreground">Recent Streak</span>
            </div>
            <p className="text-2xl font-bold text-success">{streakDays} days</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-warning" />
              <span className="text-sm text-muted-foreground">This Week</span>
            </div>
            <p className="text-2xl font-bold text-warning">{thisWeekAttended}/5</p>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm text-primary font-medium">
            {currentPercentage >= 95 
              ? "🏆 Perfect attendance! Are you even human?" 
              : currentPercentage >= 85 
                ? "🎉 You're crushing it! Your future self thanks you!" 
                : currentPercentage >= 75
                  ? "⚠️ Walking the tightrope! Time to show up more often!"
                  : "🚨 Danger zone! Your attendance needs CPR!"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}