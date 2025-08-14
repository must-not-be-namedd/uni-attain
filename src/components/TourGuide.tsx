import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { Button } from '@/components/ui/button';
import { HelpCircle, X } from 'lucide-react';

const tourSteps: Step[] = [
  {
    target: '.tour-overall-stats',
    content: '📊 Your attendance overview at a glance! See your performance across all subjects.',
    disableBeacon: true,
  },
  {
    target: '.tour-subjects-tab',
    content: '📚 Manage individual subjects here. Add new subjects and track each one separately.',
  },
  {
    target: '.tour-advanced-tab',
    content: '🧠 Advanced features for power users! Plan bunks, calculate attendance patterns, and more.',
  },
  {
    target: '.tour-quick-stats',
    content: '⚡ Quick insights about your current attendance status with some humor!',
  },
  {
    target: '.tour-bunk-forecast',
    content: '🔮 See how many classes you can safely miss without jeopardizing your attendance.',
  },
  {
    target: '.tour-reverse-calculator',
    content: '🧮 Work backwards from your goals. Plan attendance patterns to reach target percentages.',
  },
  {
    target: '.tour-safe-buffer',
    content: '🛡️ Set your personal safety buffer and see how many classes you need to reach your target.',
  },
  {
    target: '.tour-life-planner',
    content: '📅 Plan for trips, illness, or events. See how they impact your attendance and plan recovery.',
  },
  {
    target: '.tour-group-planner',
    content: '👥 Planning to bunk with friends? Check if everyone can safely miss classes together.',
  }
];

interface TourGuideProps {
  run: boolean;
  onClose: () => void;
}

export function TourGuide({ run, onClose }: TourGuideProps) {
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status as any)) {
      onClose();
    }
  };

  return (
    <Joyride
      steps={tourSteps}
      run={run}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: 'hsl(var(--primary))',
          backgroundColor: 'hsl(var(--background))',
          textColor: 'hsl(var(--foreground))',
          overlayColor: 'rgba(0, 0, 0, 0.4)',
          arrowColor: 'hsl(var(--background))',
          zIndex: 10000,
        },
        tooltip: {
          backgroundColor: 'hsl(var(--background))',
          borderRadius: '8px',
          border: '1px solid hsl(var(--border))',
          color: 'hsl(var(--foreground))',
        },
        tooltipContent: {
          padding: '16px',
          fontSize: '14px',
          lineHeight: '1.5',
        },
        buttonNext: {
          backgroundColor: 'hsl(var(--primary))',
          color: 'hsl(var(--primary-foreground))',
          borderRadius: '6px',
          padding: '8px 16px',
          border: 'none',
          fontSize: '14px',
          fontWeight: '500',
        },
        buttonBack: {
          color: 'hsl(var(--muted-foreground))',
          borderRadius: '6px',
          padding: '8px 16px',
          border: '1px solid hsl(var(--border))',
          backgroundColor: 'transparent',
          fontSize: '14px',
          fontWeight: '500',
        },
        buttonSkip: {
          color: 'hsl(var(--muted-foreground))',
          fontSize: '14px',
        },
        spotlight: {
          borderRadius: '8px',
        }
      }}
      locale={{
        back: 'Previous',
        close: 'Close',
        last: 'Finish Tour',
        next: 'Next',
        skip: 'Skip Tour',
      }}
    />
  );
}

interface TourButtonProps {
  onStartTour: () => void;
}

export function TourButton({ onStartTour }: TourButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onStartTour}
      className="fixed bottom-4 right-4 z-50 shadow-lg hover:shadow-xl bg-background border-primary/20 hover:border-primary/40"
    >
      <HelpCircle className="h-4 w-4 mr-2" />
      Take Tour
    </Button>
  );
}