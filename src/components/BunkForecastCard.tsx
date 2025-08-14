import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CalendarDays, TrendingDown, AlertTriangle, Clock } from 'lucide-react';
import { BunkForecast, MemeStatus } from '@/types/advancedAttendance';
import { format } from 'date-fns';

interface BunkForecastCardProps {
  forecast: BunkForecast;
  memeStatus: MemeStatus;
  currentPercentage: number;
  className?: string;
}

export function BunkForecastCard({ 
  forecast, 
  memeStatus, 
  currentPercentage,
  className 
}: BunkForecastCardProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'safe': return 'bg-success text-success-foreground';
      case 'cautious': return 'bg-primary text-primary-foreground';
      case 'edge': return 'bg-warning text-warning-foreground';
      case 'warning': return 'bg-warning text-warning-foreground';
      case 'danger': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getUrgencyIcon = () => {
    return memeStatus.urgency === 'urgent' ? 
      <AlertTriangle className="h-4 w-4" /> : 
      <Clock className="h-4 w-4" />;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Bunk Forecast
          </CardTitle>
          <Badge className={getSeverityColor(memeStatus.severity)}>
            {memeStatus.severity.toUpperCase()}
          </Badge>
        </div>
        <CardDescription>
          When will your attendance drop below threshold?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status with Meme */}
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            {getUrgencyIcon()}
            <span className="text-sm font-medium">Current Vibe</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{memeStatus.message}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm">Distance from target:</span>
            <Badge variant={memeStatus.distance >= 0 ? "secondary" : "destructive"}>
              {memeStatus.distance >= 0 ? '+' : ''}{memeStatus.distance.toFixed(1)}%
            </Badge>
          </div>
        </div>

        {/* Consecutive Bunk Scenario */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h4 className="font-medium">Worst Case (Consecutive Bunks)</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Classes until danger:</span>
              <p className="font-semibold text-destructive">
                {forecast.consecutive.classes} classes
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Time estimate:</span>
              <p className="font-semibold">
                {forecast.consecutive.weeks} weeks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            <span>Projected date: {format(forecast.consecutive.projectedDate, 'MMM dd, yyyy')}</span>
          </div>
        </div>

        {/* Trend-Based Scenario */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-warning" />
            <h4 className="font-medium">Realistic (Based on Recent Trend)</h4>
          </div>
          {forecast.trend.isSafe ? (
            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
              <p className="text-sm text-success">
                🎉 At your current pace, you'll stay above threshold!
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Weeks until danger:</span>
                  <p className="font-semibold text-warning">
                    {forecast.trend.weeks} weeks
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Projected date:</span>
                  <p className="font-semibold">
                    {format(forecast.trend.projectedDate, 'MMM dd')}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Current Attendance</span>
            <span className="font-semibold">{currentPercentage.toFixed(1)}%</span>
          </div>
          <Progress 
            value={currentPercentage} 
            className="h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Danger Zone</span>
            <span>85%</span>
            <span>Safe Zone</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}