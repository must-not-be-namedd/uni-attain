import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { CIECheckpoint } from '@/types/advancedAttendance';
import { calculateCIECheckpoint } from '@/utils/advancedCalculations';

interface CIEPanicButtonProps {
  totalClasses: number;
  attendedClasses: number;
  targetPercentage: number;
  classesPerWeek: number;
  className?: string;
}

export function CIEPanicButton({ 
  totalClasses, 
  attendedClasses, 
  targetPercentage, 
  classesPerWeek,
  className 
}: CIEPanicButtonProps) {
  const [checkpoints, setCheckpoints] = useState<CIECheckpoint[]>([]);
  const [newCheckpoint, setNewCheckpoint] = useState({
    name: '',
    totalClassesExpected: totalClasses + 20
  });
  const [customTotalClasses, setCustomTotalClasses] = useState(totalClasses);

  const addCheckpoint = () => {
    if (!newCheckpoint.name.trim()) return;

    const checkpoint = calculateCIECheckpoint(
      attendedClasses,
      customTotalClasses,
      targetPercentage / 100,
      classesPerWeek,
      newCheckpoint.totalClassesExpected,
      newCheckpoint.name
    );

    setCheckpoints([...checkpoints, checkpoint]);
    setNewCheckpoint({
      name: '',
      totalClassesExpected: customTotalClasses + 20
    });
  };

  const removeCheckpoint = (index: number) => {
    setCheckpoints(checkpoints.filter((_, i) => i !== index));
  };

  const getStatusIcon = (isPossible: boolean) => {
    return isPossible ? (
      <CheckCircle className="h-4 w-4 text-success" />
    ) : (
      <XCircle className="h-4 w-4 text-destructive" />
    );
  };

  const getStatusColor = (isPossible: boolean) => {
    return isPossible 
      ? 'bg-success text-success-foreground'
      : 'bg-destructive text-destructive-foreground';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          CIE Panic Button
        </CardTitle>
        <CardDescription>
          Calculate what you need to reach target by specific checkpoints
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status & Custom Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-3">Current Status</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Current</span>
                <p className="font-semibold">{((attendedClasses / customTotalClasses) * 100).toFixed(1)}%</p>
              </div>
              <div>
                <span className="text-muted-foreground">Attended</span>
                <p className="font-semibold">{attendedClasses}/{customTotalClasses}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="custom-total">Total Classes</Label>
              <Input
                id="custom-total"
                type="number"
                value={customTotalClasses}
                onChange={(e) => setCustomTotalClasses(parseInt(e.target.value) || totalClasses)}
                placeholder="Current total classes"
              />
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Target: {targetPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Add New Checkpoint */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
          <h4 className="font-medium">Add New Checkpoint</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="checkpoint-name">Checkpoint Name</Label>
              <Input
                id="checkpoint-name"
                value={newCheckpoint.name}
                onChange={(e) => setNewCheckpoint({
                  ...newCheckpoint,
                  name: e.target.value
                })}
                placeholder="e.g., Mid-semester, CIE-1"
              />
            </div>
            <div>
              <Label htmlFor="total-classes">Expected Total Classes</Label>
              <Input
                id="total-classes"
                type="number"
                value={newCheckpoint.totalClassesExpected}
                onChange={(e) => setNewCheckpoint({
                  ...newCheckpoint,
                  totalClassesExpected: parseInt(e.target.value) || customTotalClasses
                })}
                placeholder="Enter expected total classes"
              />
            </div>
          </div>
          <Button 
            onClick={addCheckpoint} 
            disabled={!newCheckpoint.name.trim()}
            className="w-full"
          >
            Add Checkpoint
          </Button>
        </div>

        {/* Checkpoints List */}
        {checkpoints.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Your Checkpoints</h4>
            {checkpoints.map((checkpoint, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(checkpoint.isPossible)}
                    <h5 className="font-medium">{checkpoint.name}</h5>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(checkpoint.isPossible)}>
                      {checkpoint.isPossible ? 'POSSIBLE' : 'IMPOSSIBLE'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCheckpoint(index)}
                    >
                      ×
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Classes</span>
                    <p className="font-semibold">{checkpoint.totalClassesExpected}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Required Present</span>
                    <p className="font-semibold">{checkpoint.requiredPresent}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Must Attend</span>
                    <p className="font-semibold text-destructive">{checkpoint.minAttendsNeeded}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Remaining</span>
                    <p className="font-semibold">{checkpoint.remainingClasses}</p>
                  </div>
                </div>

                {checkpoint.isPossible ? (
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium text-success">Action Plan</span>
                    </div>
                    <p className="text-sm text-success">
                      Attend at least <strong>{checkpoint.minAttendsNeeded}</strong> of the next{' '}
                      <strong>{checkpoint.remainingClasses}</strong> classes ({checkpoint.weeksNeeded} weeks of full attendance)
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="text-sm font-medium text-destructive">Critical Alert</span>
                    </div>
                    <p className="text-sm text-destructive">
                      Even if you attend all remaining {checkpoint.remainingClasses} classes, 
                      you cannot reach {targetPercentage}% by {checkpoint.name}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {checkpoints.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Add checkpoints to see what you need to do</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}