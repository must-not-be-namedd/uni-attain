import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, UserX, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Subject } from '@/types/attendance';
import { GroupMember, GroupBunkPlan } from '@/types/advancedAttendance';
import { calculateGroupBunkPlan } from '@/utils/advancedCalculations';

interface GroupBunkPlannerProps {
  subjects: Subject[];
  targetPercentage: number;
  className?: string;
}

export function GroupBunkPlanner({ 
  subjects, 
  targetPercentage,
  className 
}: GroupBunkPlannerProps) {
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [newMember, setNewMember] = useState({
    name: '',
    attendancePercentage: 0,
    totalClasses: 0
  });
  const [proposedMissedClasses, setProposedMissedClasses] = useState(1);
  const [bunkPlan, setBunkPlan] = useState<GroupBunkPlan | null>(null);

  const addMember = () => {
    if (!newMember.name.trim() || !newMember.totalClasses || !newMember.attendancePercentage) return;

    const attendedClasses = Math.round((newMember.attendancePercentage / 100) * newMember.totalClasses);

    const member: GroupMember = {
      id: Date.now().toString(),
      name: newMember.name,
      totalClasses: newMember.totalClasses,
      attendedClasses,
      targetPercentage: targetPercentage
    };

    setGroupMembers([...groupMembers, member]);
    setNewMember({ name: '', attendancePercentage: 0, totalClasses: 0 });
  };

  const removeMember = (id: string) => {
    setGroupMembers(groupMembers.filter(m => m.id !== id));
    setBunkPlan(null);
  };

  const calculatePlan = () => {
    if (groupMembers.length === 0) return;

    const plan = calculateGroupBunkPlan(groupMembers, proposedMissedClasses);
    setBunkPlan(plan);
  };

  const getMemberCurrentPercentage = (member: GroupMember) => {
    return (member.attendedClasses / member.totalClasses) * 100;
  };

  return (
    <div className={`border-2 border-orange-500/30 rounded-lg p-6 space-y-6 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300 ${className}`}>
        {/* Add New Member */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <h4 className="font-medium">Add Group Member</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="member-name">Member Name</Label>
              <Input
                id="member-name"
                value={newMember.name}
                onChange={(e) => setNewMember({
                  ...newMember,
                  name: e.target.value
                })}
                placeholder="Friend's name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="friend-percentage">Friend's Current Attendance %</Label>
              <Input
                id="friend-percentage"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={newMember.attendancePercentage === 0 ? '' : newMember.attendancePercentage}
                onChange={(e) => setNewMember({
                  ...newMember,
                  attendancePercentage: e.target.value === '' ? 0 : Math.max(0, Math.min(100, parseFloat(e.target.value) || 0))
                })}
                placeholder="e.g., 78.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="friend-total-classes">Their Total Classes</Label>
              <Input
                id="friend-total-classes"
                type="number"
                min="0"
                value={newMember.totalClasses === 0 ? '' : newMember.totalClasses}
                onChange={(e) => setNewMember({
                  ...newMember,
                  totalClasses: e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value) || 0)
                })}
                placeholder="e.g., 45"
              />
            </div>
          </div>
          <Button 
            onClick={addMember} 
            disabled={!newMember.name.trim() || !newMember.totalClasses || !newMember.attendancePercentage}
            className="w-full"
          >
            Add Member
          </Button>
        </div>

        {/* Group Members List */}
        {groupMembers.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Group Members ({groupMembers.length})</h4>
            <div className="space-y-2">
              {groupMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.attendedClasses}/{member.totalClasses} classes
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {getMemberCurrentPercentage(member).toFixed(1)}%
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMember(member.id)}
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bunk Planning */}
        {groupMembers.length > 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="missed-classes">Proposed Classes to Miss</Label>
              <Input
                id="missed-classes"
                type="number"
                min="0"
                value={proposedMissedClasses || ''}
                onChange={(e) => setProposedMissedClasses(e.target.value === '' ? 1 : Math.max(1, parseInt(e.target.value) || 1))}
                placeholder="Number of classes"
              />
            </div>
            <Button onClick={calculatePlan} className="w-full">
              Analyze Group Safety
            </Button>
          </div>
        )}

        {/* Results */}
        {bunkPlan && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Group Analysis Results</h4>
              <Badge className={bunkPlan.isGroupSafe 
                ? 'bg-success text-success-foreground' 
                : 'bg-destructive text-destructive-foreground'
              }>
                {bunkPlan.isGroupSafe ? 'GROUP SAFE' : 'RISKS DETECTED'}
              </Badge>
            </div>

            {/* Safe Members */}
            {bunkPlan.safeMembers.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="font-medium text-success">Safe Members ({bunkPlan.safeMembers.length})</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {bunkPlan.safeMembers.map(memberId => {
                    const member = groupMembers.find(m => m.id === memberId);
                    if (!member) return null;
                    return (
                      <div key={memberId} className="p-2 bg-success/10 border border-success/20 rounded text-sm">
                        <span className="font-medium">{member.name}</span>
                        <span className="text-success ml-2">✓ Will stay safe</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Risk Members */}
            {bunkPlan.riskMembers.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="font-medium text-destructive">At Risk ({bunkPlan.riskMembers.length})</span>
                </div>
                <div className="space-y-2">
                  {bunkPlan.riskMembers.map(riskMember => (
                    <div key={riskMember.id} className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{riskMember.name}</span>
                        <Badge variant="destructive">
                          {riskMember.newPercentage.toFixed(1)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-destructive">
                        Needs {riskMember.extraNeeded} extra classes to recover
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation */}
            <div className="p-4 border rounded-lg">
              {bunkPlan.isGroupSafe ? (
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium text-success">Green Light! 🎉</p>
                    <p className="text-sm text-muted-foreground">
                      All group members will remain above their safety thresholds after missing {proposedMissedClasses} class(es).
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">Risk Warning! ⚠️</p>
                    <p className="text-sm text-muted-foreground">
                      Some members will fall below safe thresholds. Consider reducing missed classes or having at-risk members attend.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {groupMembers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Add group members to start planning</p>
          </div>
        )}
    </div>
  );
}