import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Subject, SubjectType } from '@/types/attendance';

interface EditSubjectDialogProps {
  subject: Subject;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<Subject>) => void;
}

export function EditSubjectDialog({ subject, open, onOpenChange, onUpdate }: EditSubjectDialogProps) {
  const [formData, setFormData] = useState({
    name: subject.name,
    credits: subject.credits?.toString() || '',
    totalClasses: subject.totalClasses.toString(),
    attendedClasses: subject.attendedClasses.toString(),
    subjectType: subject.subjectType
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.totalClasses || !formData.attendedClasses) {
      return;
    }

    const updates: Partial<Subject> = {
      name: formData.name.trim(),
      totalClasses: parseInt(formData.totalClasses),
      attendedClasses: parseInt(formData.attendedClasses),
      subjectType: formData.subjectType,
      ...(formData.subjectType === 'theory' && formData.credits && {
        credits: parseInt(formData.credits)
      })
    };

    onUpdate(subject.id, updates);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Subject</DialogTitle>
          <DialogDescription>
            Update your subject details and attendance information.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Data Structures"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subjectType">Subject Type</Label>
            <Select
              value={formData.subjectType}
              onValueChange={(value: SubjectType) => 
                setFormData({ ...formData, subjectType: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="theory">Theory</SelectItem>
                <SelectItem value="lab">Lab/Practical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.subjectType === 'theory' && (
            <div className="space-y-2">
              <Label htmlFor="credits">Credits (Optional)</Label>
              <Input
                id="credits"
                type="number"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                placeholder="e.g., 4"
                min="1"
                max="10"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalClasses">Total Classes</Label>
              <Input
                id="totalClasses"
                type="number"
                value={formData.totalClasses}
                onChange={(e) => setFormData({ ...formData, totalClasses: e.target.value })}
                placeholder="e.g., 45"
                min="1"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="attendedClasses">Classes Attended</Label>
              <Input
                id="attendedClasses"
                type="number"
                value={formData.attendedClasses}
                onChange={(e) => setFormData({ ...formData, attendedClasses: e.target.value })}
                placeholder="e.g., 40"
                min="0"
                max={formData.totalClasses || undefined}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Subject</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}