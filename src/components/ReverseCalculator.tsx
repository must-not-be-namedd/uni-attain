import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Calculator, Target, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { AttendancePattern, PatternProjection } from '@/types/advancedAttendance';
import { calculatePatternProjection } from '@/utils/advancedCalculations';

interface ReverseCalculatorProps {
  totalClasses: number;
  attendedClasses: number;
  classesPerWeek: number;
  targetPercentage?: number;
  className?: string;
}

export function ReverseCalculator({ 
  totalClasses, 
  attendedClasses, 
  classesPerWeek,
  targetPercentage = 85,
  className 
}: ReverseCalculatorProps) {
  const [pattern, setPattern] = useState<AttendancePattern>({
    type: 'weekly_count',
    classesPerWeek: classesPerWeek,
    totalClassesPerWeek: classesPerWeek
  });
  const [weeksToProject, setWeeksToProject] = useState<number>(4);
  const [customTarget, setCustomTarget] = useState<number>(targetPercentage);
  const [projection, setProjection] = useState<PatternProjection | null>(null);
  const [calculationMode, setCalculationMode] = useState<'project' | 'target'>('project');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handlePatternChange = (type: 'weekly_count' | 'specific_days') => {
    setPattern({
      type,
      classesPerWeek: type === 'weekly_count' ? classesPerWeek : undefined,
      selectedDays: type === 'specific_days' ? [] : undefined,
      totalClassesPerWeek: classesPerWeek
    });
  };

  const handleDayToggle = (day: string, checked: boolean) => {
    if (pattern.type !== 'specific_days') return;
    
    const selectedDays = pattern.selectedDays || [];
    const newSelectedDays = checked 
      ? [...selectedDays, day]
      : selectedDays.filter(d => d !== day);
    
    setPattern({
      ...pattern,
      selectedDays: newSelectedDays
    });
  };

  const calculateProjection = () => {
    const projectionInput = calculationMode === 'project' 
      ? { weeksToProject }
      : { targetPercentage: customTarget };
    
    const result = calculatePatternProjection(
      totalClasses,
      attendedClasses,
      0.85, // Default threshold for calculations
      pattern,
      calculationMode === 'project' ? weeksToProject : undefined,
      calculationMode === 'target' ? customTarget : undefined
    );
    
    setProjection(result);
  };

  const getResultColor = (percentage: number, target: number) => {
    if (percentage >= target) return 'text-success';
    if (percentage >= 75) return 'text-warning';
    return 'text-destructive';
  };

  const currentPercentage = (attendedClasses / totalClasses) * 100;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Reverse Attendance Calculator
        </CardTitle>
        <CardDescription>
          Plan your attendance pattern to reach your goals
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
              <span className="text-muted-foreground">Per Week</span>
              <p className="font-semibold">{classesPerWeek} classes</p>
            </div>
          </div>
        </div>

        {/* Calculation Mode */}
        <Tabs value={calculationMode} onValueChange={(value) => setCalculationMode(value as 'project' | 'target')}>
          <div className="space-y-2">
            <TabsList className="w-full flex flex-col h-auto p-1">
              <TabsTrigger value="project" className="w-full flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Project Future Percentage
              </TabsTrigger>
              <TabsTrigger value="target" className="w-full flex items-center gap-2">
                <Target className="h-4 w-4" />
                Calculate Classes to Reach Target
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="project" className="space-y-4">
            <div>
              <Label htmlFor="weeks">Weeks to project</Label>
              <Input
                id="weeks"
                type="number"
                value={weeksToProject}
                onChange={(e) => setWeeksToProject(parseInt(e.target.value) || 1)}
                placeholder="Enter any number of weeks"
              />
            </div>
          </TabsContent>

          <TabsContent value="target" className="space-y-4">
            <div>
              <Label htmlFor="target">Target percentage</Label>
              <Input
                id="target"
                type="number"
                step="0.1"
                value={customTarget}
                onChange={(e) => setCustomTarget(parseFloat(e.target.value) || 85)}
                placeholder="Enter target percentage (e.g., 85)"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Attendance Pattern */}
        <div className="space-y-4">
          <Label>Attendance Pattern</Label>
          <Tabs value={pattern.type} onValueChange={handlePatternChange}>
            <div className="space-y-2">
              <TabsList className="w-full flex flex-col h-auto p-1">
                <TabsTrigger value="weekly_count" className="w-full">Classes per Week Pattern</TabsTrigger>
                <TabsTrigger value="specific_days" className="w-full">Specific Days Pattern</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="weekly_count" className="space-y-4">
              <div>
                <Label htmlFor="weekly-classes">Classes you'll attend per week</Label>
                <Input
                  id="weekly-classes"
                  type="number"
                  value={pattern.classesPerWeek || 0}
                  onChange={(e) => setPattern({
                    ...pattern,
                    classesPerWeek: parseInt(e.target.value) || 0
                  })}
                  placeholder="Classes you'll attend per week"
                />
              </div>
            </TabsContent>

            <TabsContent value="specific_days" className="space-y-4">
              <div>
                <Label>Days you'll attend</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {daysOfWeek.slice(0, classesPerWeek).map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={pattern.selectedDays?.includes(day) || false}
                        onCheckedChange={(checked) => handleDayToggle(day, checked as boolean)}
                      />
                      <Label htmlFor={day} className="text-sm">{day}</Label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {pattern.selectedDays?.length || 0} days
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Calculate Button */}
        <Button onClick={calculateProjection} className="w-full">
          Calculate Projection
        </Button>

        {/* Results */}
        {projection && (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                {projection.isPossible ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
                Results
              </h4>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Weeks Needed</span>
                    <p className="text-lg font-semibold">
                      {projection.weeksNeeded === Infinity ? '∞' : projection.weeksNeeded}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Final Percentage</span>
                    <p className={`text-lg font-semibold ${getResultColor(projection.finalPercentage, customTarget)}`}>
                      {projection.finalPercentage.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg border">
                  <p className="text-sm">{projection.explanation}</p>
                </div>

                {!projection.isPossible && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">
                      💡 Try attending more classes per week or choose a lower target percentage
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}