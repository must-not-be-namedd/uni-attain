import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Shield, Target, AlertTriangle } from 'lucide-react';

interface SafeBufferSliderProps {
  currentPercentage: number;
  targetPercentage: number;
  onTargetChange: (value: number) => void;
  className?: string;
}

export function SafeBufferSlider({ 
  currentPercentage, 
  targetPercentage, 
  onTargetChange,
  className 
}: SafeBufferSliderProps) {
  const getWarningLevel = () => {
    if (currentPercentage < 85) {
      return {
        level: 'danger',
        color: 'bg-destructive text-destructive-foreground',
        icon: <AlertTriangle className="h-4 w-4" />,
        message: 'CONDONATION RISK!'
      };
    } else if (currentPercentage < targetPercentage) {
      return {
        level: 'warning',
        color: 'bg-warning text-warning-foreground',
        icon: <AlertTriangle className="h-4 w-4" />,
        message: 'Below personal target'
      };
    } else {
      return {
        level: 'safe',
        color: 'bg-success text-success-foreground',
        icon: <Shield className="h-4 w-4" />,
        message: 'You\'re safe!'
      };
    }
  };

  const warning = getWarningLevel();

  const sliderMarks = [
    { value: 75, label: '75%' },
    { value: 85, label: '85%' },
    { value: 90, label: '90%' },
    { value: 95, label: '95%' }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Safe Buffer Settings
        </CardTitle>
        <CardDescription>
          Set your personal attendance target
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Current Attendance</p>
            <p className="text-2xl font-semibold">{currentPercentage.toFixed(1)}%</p>
          </div>
          <Badge className={warning.color}>
            <div className="flex items-center gap-1">
              {warning.icon}
              {warning.message}
            </div>
          </Badge>
        </div>

        {/* Target Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="target-slider">Personal Target</Label>
            <span className="text-sm font-semibold bg-primary text-primary-foreground px-2 py-1 rounded">
              {targetPercentage}%
            </span>
          </div>
          
          <div className="px-2">
            <Slider
              id="target-slider"
              min={75}
              max={100}
              step={5}
              value={[targetPercentage]}
              onValueChange={(values) => onTargetChange(values[0])}
              className="w-full"
            />
          </div>

          {/* Slider Marks */}
          <div className="flex justify-between text-xs text-muted-foreground px-2">
            {sliderMarks.map((mark) => (
              <div key={mark.value} className="flex flex-col items-center">
                <div className="w-px h-2 bg-border"></div>
                <span>{mark.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <h4 className="font-medium">Recommendations</h4>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-start gap-2 p-2 rounded bg-muted/30">
              <div className="w-2 h-2 rounded-full bg-destructive mt-1.5 flex-shrink-0"></div>
              <div>
                <span className="font-medium">75%:</span> Minimum for eligibility (risky!)
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 rounded bg-muted/30">
              <div className="w-2 h-2 rounded-full bg-warning mt-1.5 flex-shrink-0"></div>
              <div>
                <span className="font-medium">85%:</span> College safety threshold
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 rounded bg-muted/30">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
              <div>
                <span className="font-medium">90%:</span> Comfortable buffer zone
              </div>
            </div>
            <div className="flex items-start gap-2 p-2 rounded bg-muted/30">
              <div className="w-2 h-2 rounded-full bg-success mt-1.5 flex-shrink-0"></div>
              <div>
                <span className="font-medium">95%:</span> Ultra-safe perfectionist mode
              </div>
            </div>
          </div>
        </div>

        {/* Classes to Target */}
        <div className="p-3 border rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Classes to reach target:</span>
            <span className={`font-semibold ${
              currentPercentage >= targetPercentage ? 'text-success' : 'text-destructive'
            }`}>
              {currentPercentage >= targetPercentage ? 
                'Target achieved! 🎉' : 
                `${Math.ceil((targetPercentage - currentPercentage) * 10)} classes needed`
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}