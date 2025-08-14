import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Lock, Star, Zap, Target, Clock } from 'lucide-react';
import { Achievement } from '@/types/advancedAttendance';
import { format } from 'date-fns';

interface AchievementBadgesProps {
  achievements: Achievement[];
  className?: string;
}

export function AchievementBadges({ achievements, className }: AchievementBadgesProps) {
  const getAchievementIcon = (type: Achievement['type']) => {
    switch (type) {
      case 'lecture_ninja': return <Zap className="h-5 w-5" />;
      case 'houdini': return <Star className="h-5 w-5" />;
      case 'last_minute_saver': return <Target className="h-5 w-5" />;
      case 'consistent_hero': return <Trophy className="h-5 w-5" />;
    }
  };

  const getAchievementColor = (type: Achievement['type'], unlocked: boolean) => {
    if (!unlocked) return 'bg-muted text-muted-foreground';
    
    switch (type) {
      case 'lecture_ninja': return 'bg-primary text-primary-foreground';
      case 'houdini': return 'bg-destructive text-destructive-foreground';
      case 'last_minute_saver': return 'bg-warning text-warning-foreground';
      case 'consistent_hero': return 'bg-success text-success-foreground';
    }
  };

  const getAchievementRarity = (type: Achievement['type']) => {
    switch (type) {
      case 'lecture_ninja': return { rarity: 'Common', points: 100 };
      case 'houdini': return { rarity: 'Rare', points: 250 };
      case 'last_minute_saver': return { rarity: 'Epic', points: 500 };
      case 'consistent_hero': return { rarity: 'Legendary', points: 1000 };
    }
  };

  const totalPoints = achievements
    .filter(achievement => achievement.unlocked)
    .reduce((sum, achievement) => sum + getAchievementRarity(achievement.type).points, 0);

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Achievement Badges
        </CardTitle>
        <CardDescription>
          Unlock badges by maintaining good attendance patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-primary">{unlockedCount}</p>
            <p className="text-sm text-muted-foreground">Badges Unlocked</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-2xl font-bold text-warning">{totalPoints}</p>
            <p className="text-sm text-muted-foreground">Achievement Points</p>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => {
            const rarity = getAchievementRarity(achievement.type);
            return (
              <div
                key={achievement.type}
                className={`p-4 border rounded-lg transition-all ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-background to-muted border-primary/20 shadow-md' 
                    : 'bg-muted/50 border-muted opacity-75'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${getAchievementColor(achievement.type, achievement.unlocked)}`}>
                    {achievement.unlocked ? (
                      getAchievementIcon(achievement.type)
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className={`font-semibold ${achievement.unlocked ? '' : 'text-muted-foreground'}`}>
                        {achievement.name}
                      </h4>
                      <Badge variant={achievement.unlocked ? "secondary" : "outline"} className="text-xs">
                        {rarity.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {achievement.condition}
                      </span>
                      <span className={`font-medium ${achievement.unlocked ? 'text-primary' : 'text-muted-foreground'}`}>
                        {rarity.points} pts
                      </span>
                    </div>
                    {achievement.unlocked && achievement.unlockedDate && (
                      <div className="flex items-center gap-1 text-xs text-success">
                        <Clock className="h-3 w-3" />
                        <span>Unlocked {format(achievement.unlockedDate, 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievement Descriptions */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium">How to Unlock</h4>
          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded">
              <Zap className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <span className="font-medium">Lecture Ninja:</span>
                <span className="text-muted-foreground ml-1">
                  Attend all classes for 7 consecutive days without missing any
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded">
              <Star className="h-4 w-4 text-destructive mt-0.5" />
              <div>
                <span className="font-medium">The Houdini:</span>
                <span className="text-muted-foreground ml-1">
                  Miss exactly 5 consecutive classes (for that dramatic comeback story)
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded">
              <Target className="h-4 w-4 text-warning mt-0.5" />
              <div>
                <span className="font-medium">Last-Minute Saver:</span>
                <span className="text-muted-foreground ml-1">
                  Improve from below 75% to above 85% within a limited window
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded">
              <Trophy className="h-4 w-4 text-success mt-0.5" />
              <div>
                <span className="font-medium">Consistent Hero:</span>
                <span className="text-muted-foreground ml-1">
                  Maintain ≥90% attendance over the last 30 classes
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Achievement Progress</span>
            <span>{unlockedCount}/{achievements.length}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
            />
          </div>
        </div>

        {unlockedCount === achievements.length && (
          <div className="text-center p-4 bg-success/10 border border-success/20 rounded-lg">
            <Trophy className="h-8 w-8 text-success mx-auto mb-2" />
            <p className="font-semibold text-success">Achievement Master! 🎉</p>
            <p className="text-sm text-muted-foreground">
              You've unlocked all attendance achievements!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}