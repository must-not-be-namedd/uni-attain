import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { LifeEvent } from '@/types/advancedAttendance';
import { calculateLifeEventImpact } from '@/utils/advancedCalculations';

interface LifeEventPlannerProps {
  totalClasses: number;
  attendedClasses: number;
  targetPercentage: number;
  classesPerWeek: number;
  className?: string;
}

export function LifeEventPlanner({ 
  totalClasses, 
  attendedClasses, 
  targetPercentage, 
  classesPerWeek,
  className 
}: LifeEventPlannerProps) {
  const [events, setEvents] = useState<LifeEvent[]>([]);
  const [newEvent, setNewEvent] = useState({
    name: '',
    startDate: '',
    endDate: '',
    expectedMissedClasses: 3
  });

  const addEvent = () => {
    if (!newEvent.name.trim() || !newEvent.startDate || !newEvent.endDate) return;

    const eventToAnalyze = {
      name: newEvent.name,
      startDate: new Date(newEvent.startDate),
      endDate: new Date(newEvent.endDate),
      expectedMissedClasses: newEvent.expectedMissedClasses
    };

    const analyzedEvent = calculateLifeEventImpact(
      attendedClasses,
      totalClasses,
      targetPercentage / 100,
      classesPerWeek,
      eventToAnalyze
    );

    setEvents([...events, analyzedEvent]);
    setNewEvent({
      name: '',
      startDate: '',
      endDate: '',
      expectedMissedClasses: 3
    });
  };

  const removeEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const getImpactColor = (percentage: number) => {
    if (percentage >= targetPercentage) return 'text-success';
    if (percentage >= 75) return 'text-warning';
    return 'text-destructive';
  };

  const getImpactLevel = (percentage: number) => {
    if (percentage >= targetPercentage) return { level: 'Safe', color: 'bg-success text-success-foreground' };
    if (percentage >= 85) return { level: 'Caution', color: 'bg-warning text-warning-foreground' };
    if (percentage >= 75) return { level: 'Risk', color: 'bg-destructive/80 text-destructive-foreground' };
    return { level: 'Danger', color: 'bg-destructive text-destructive-foreground' };
  };

  const currentPercentage = (attendedClasses / totalClasses) * 100;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Life Event Planner
        </CardTitle>
        <CardDescription>
          Plan for trips, illness, or other events that affect attendance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Current</span>
              <p className="font-semibold">{currentPercentage.toFixed(1)}%</p>
            </div>
            <div>
              <span className="text-muted-foreground">Attended</span>
              <p className="font-semibold">{attendedClasses}/{totalClasses}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Target</span>
              <p className="font-semibold">{targetPercentage}%</p>
            </div>
          </div>
        </div>

        {/* Add New Event */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
          <h4 className="font-medium">Plan New Event</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="event-name">Event Name</Label>
              <Input
                id="event-name"
                value={newEvent.name}
                onChange={(e) => setNewEvent({
                  ...newEvent,
                  name: e.target.value
                })}
                placeholder="e.g., Family Trip, Medical Leave"
              />
            </div>
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={newEvent.startDate}
                onChange={(e) => setNewEvent({
                  ...newEvent,
                  startDate: e.target.value
                })}
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={newEvent.endDate}
                onChange={(e) => setNewEvent({
                  ...newEvent,
                  endDate: e.target.value
                })}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="missed-classes">Expected Classes to Miss</Label>
              <Input
                id="missed-classes"
                type="number"
                min="1"
                max="20"
                value={newEvent.expectedMissedClasses}
                onChange={(e) => setNewEvent({
                  ...newEvent,
                  expectedMissedClasses: parseInt(e.target.value) || 1
                })}
                placeholder="Number of classes"
              />
            </div>
          </div>
          <Button 
            onClick={addEvent} 
            disabled={!newEvent.name.trim() || !newEvent.startDate || !newEvent.endDate}
            className="w-full"
          >
            Analyze Event Impact
          </Button>
        </div>

        {/* Events List */}
        {events.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Planned Events</h4>
            {events.map((event, index) => {
              const impact = getImpactLevel(event.newPercentage);
              return (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium">{event.name}</h5>
                      <p className="text-sm text-muted-foreground">
                        {event.startDate.toLocaleDateString()} - {event.endDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={impact.color}>
                        {impact.level}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEvent(index)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>

                  {/* Impact Analysis */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Classes Missed</span>
                      <p className="font-semibold text-destructive">{event.expectedMissedClasses}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">New Percentage</span>
                      <p className={`font-semibold ${getImpactColor(event.newPercentage)}`}>
                        {event.newPercentage.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Recovery Needed</span>
                      <p className="font-semibold text-primary">{event.catchupClassesNeeded} classes</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Recovery Time</span>
                      <p className="font-semibold">{event.catchupWeeksNeeded} weeks</p>
                    </div>
                  </div>

                  {/* Recovery Plan */}
                  {event.newPercentage < targetPercentage && (
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Recovery Plan</span>
                      </div>
                      <p className="text-sm">
                        After the event, attend at least <strong>{event.catchupClassesNeeded}</strong> classes 
                        (≈ {event.catchupWeeksNeeded} weeks of full attendance) to get back to {targetPercentage}%
                      </p>
                    </div>
                  )}

                  {/* Warning if critical */}
                  {event.newPercentage < 75 && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <span className="text-sm font-medium text-destructive">Critical Warning</span>
                      </div>
                      <p className="text-sm text-destructive">
                        This event will drop you below minimum eligibility requirements. 
                        Consider reducing the duration or attending some classes during the event.
                      </p>
                    </div>
                  )}

                  {/* Safe message */}
                  {event.newPercentage >= targetPercentage && (
                    <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-success" />
                        <span className="text-sm text-success">
                          🎉 You'll remain above your target! Enjoy your event stress-free.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {events.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Plan events to see their impact on your attendance</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}