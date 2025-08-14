import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, MessageSquare, Flame } from 'lucide-react';
import { WeeklyMetrics } from '@/types/advancedAttendance';

interface WeeklyRoastReportProps {
  metrics: WeeklyMetrics;
  className?: string;
}

export function WeeklyRoastReport({ metrics, className }: WeeklyRoastReportProps) {
  const getRoastColor = (level: WeeklyMetrics['roastLevel']) => {
    switch (level) {
      case 'praise': return 'bg-success text-success-foreground';
      case 'neutral': return 'bg-muted text-muted-foreground';
      case 'mild': return 'bg-warning text-warning-foreground';
      case 'savage': return 'bg-destructive/80 text-destructive-foreground';
      case 'critical': return 'bg-destructive text-destructive-foreground';
    }
  };

  const getRoastIntensity = (level: WeeklyMetrics['roastLevel']) => {
    switch (level) {
      case 'praise': return { emoji: '🏆', intensity: 'Praise Mode' };
      case 'neutral': return { emoji: '😐', intensity: 'Neutral Zone' };
      case 'mild': return { emoji: '😒', intensity: 'Mild Roast' };
      case 'savage': return { emoji: '🔥', intensity: 'Savage Mode' };
      case 'critical': return { emoji: '💀', intensity: 'CRITICAL ROAST' };
    }
  };

  const getTrendIcon = () => {
    return metrics.deltaPercentage >= 0 ? (
      <TrendingUp className="h-4 w-4 text-success" />
    ) : (
      <TrendingDown className="h-4 w-4 text-destructive" />
    );
  };

  const roastIntensity = getRoastIntensity(metrics.roastLevel);

  const getAdditionalRoasts = () => {
    const roasts = [];
    
    if (metrics.currentPercentage < 60) {
      roasts.push("Your attendance is flatlining! 📉");
    }
    
    if (metrics.deltaPercentage < -10) {
      roasts.push("Did you forget college exists? 🏫❓");
    }
    
    if (metrics.currentPercentage > 95) {
      roasts.push("Okay, we get it, you're perfect! 😇");
    }
    
    if (metrics.deltaPercentage > 10) {
      roasts.push("Someone discovered the classroom exists! 🔍");
    }

    return roasts;
  };

  const additionalRoasts = getAdditionalRoasts();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Weekly Roast Report
        </CardTitle>
        <CardDescription>
          Your brutally honest attendance analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Roast Header */}
        <div className="text-center space-y-2">
          <div className="text-4xl">{roastIntensity.emoji}</div>
          <Badge className={getRoastColor(metrics.roastLevel)} variant="outline">
            <Flame className="h-3 w-3 mr-1" />
            {roastIntensity.intensity}
          </Badge>
        </div>

        {/* Main Roast Message */}
        <div className="p-4 bg-muted/50 rounded-lg text-center">
          <p className="text-lg font-medium mb-2">{metrics.roastMessage}</p>
          {additionalRoasts.length > 0 && (
            <div className="space-y-1">
              {additionalRoasts.map((roast, index) => (
                <p key={index} className="text-sm text-muted-foreground italic">
                  {roast}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Weekly Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">This Week</span>
            </div>
            <p className="text-2xl font-semibold">{metrics.currentPercentage.toFixed(1)}%</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">Last Week</span>
            </div>
            <p className="text-2xl font-semibold">{metrics.previousPercentage.toFixed(1)}%</p>
          </div>
        </div>

        {/* Change Analysis */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Weekly Change</span>
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <span className={`font-semibold ${
                metrics.deltaPercentage >= 0 ? 'text-success' : 'text-destructive'
              }`}>
                {metrics.deltaPercentage >= 0 ? '+' : ''}{metrics.deltaPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <Progress 
            value={Math.abs(metrics.deltaPercentage) * 10} 
            className="h-2"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>No Change</span>
            <span>Massive Change</span>
          </div>
        </div>

        {/* Improvement Scale */}
        <div className="space-y-3">
          <h4 className="font-medium">Improvement Scale</h4>
          <div className="space-y-2 text-sm">
            <div className={`flex justify-between p-2 rounded ${
              metrics.roastLevel === 'praise' ? 'bg-success/20 border border-success/30' : 'bg-muted/30'
            }`}>
              <span>🏆 Praise Territory</span>
              <span className="text-muted-foreground">+2% or more</span>
            </div>
            <div className={`flex justify-between p-2 rounded ${
              metrics.roastLevel === 'neutral' ? 'bg-muted border' : 'bg-muted/30'
            }`}>
              <span>😐 Neutral Zone</span>
              <span className="text-muted-foreground">0% to +2%</span>
            </div>
            <div className={`flex justify-between p-2 rounded ${
              metrics.roastLevel === 'mild' ? 'bg-warning/20 border border-warning/30' : 'bg-muted/30'
            }`}>
              <span>😒 Mild Disappointment</span>
              <span className="text-muted-foreground">0% to -2%</span>
            </div>
            <div className={`flex justify-between p-2 rounded ${
              metrics.roastLevel === 'savage' ? 'bg-destructive/20 border border-destructive/30' : 'bg-muted/30'
            }`}>
              <span>🔥 Savage Territory</span>
              <span className="text-muted-foreground">-2% to -5%</span>
            </div>
            <div className={`flex justify-between p-2 rounded ${
              metrics.roastLevel === 'critical' ? 'bg-destructive/30 border border-destructive/50' : 'bg-muted/30'
            }`}>
              <span>💀 Critical Condition</span>
              <span className="text-muted-foreground">Below -5%</span>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="p-3 border rounded-lg bg-primary/5">
          <p className="text-sm italic text-center">
            {metrics.roastLevel === 'praise' && "Keep up the momentum! You're on fire! 🔥"}
            {metrics.roastLevel === 'neutral' && "Consistency is key. Small steps matter! 👍"}
            {metrics.roastLevel === 'mild' && "Tomorrow is a new day to bounce back! 💪"}
            {metrics.roastLevel === 'savage' && "Rock bottom is a solid foundation to build on! 🏗️"}
            {metrics.roastLevel === 'critical' && "The only way is up from here! 🚀"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}