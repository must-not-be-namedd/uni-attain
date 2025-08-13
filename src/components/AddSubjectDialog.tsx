import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Subject, SubjectType } from '@/types/attendance';

interface AddSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (subject: Omit<Subject, 'id'>) => void;
}

export function AddSubjectDialog({ open, onOpenChange, onAdd }: AddSubjectDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    credits: '',
    totalClasses: '',
    attendedClasses: '',
    subjectType: 'theory' as SubjectType
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.totalClasses || !formData.attendedClasses) {
      return;
    }

    const subject: Omit<Subject, 'id'> = {
      name: formData.name.trim(),
      totalClasses: parseInt(formData.totalClasses),
      attendedClasses: parseInt(formData.attendedClasses),
      subjectType: formData.subjectType,
      ...(formData.subjectType === 'theory' && formData.credits && {
        credits: parseInt(formData.credits)
      })
    };

    onAdd(subject);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      name: '',
      credits: '',
      totalClasses: '',
      attendedClasses: '',
      subjectType: 'theory'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>
            Add a new subject to track your attendance and calculate bunks.
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
            <Button type="submit">Add Subject</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}