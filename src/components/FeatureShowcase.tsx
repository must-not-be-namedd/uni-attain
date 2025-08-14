import React from 'react';
import { StickyNote } from './StickyNote';
import { 
  Calculator, 
  Target, 
  Calendar, 
  Users, 
  TrendingUp, 
  Shield,
  AlertTriangle,
  BarChart3,
  Clock,
  CheckCircle2
} from 'lucide-react';

export function FeatureShowcase() {
  const features = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Overall Stats",
      description: "Track your attendance across all subjects with visual progress indicators",
      color: 'yellow' as const
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Bunk Forecasting", 
      description: "See exactly how many classes you can safely miss without dropping below your target",
      color: 'blue' as const
    },
    {
      icon: <Calculator className="h-6 w-6" />,
      title: "Reverse Calculator",
      description: "Work backwards from your goals - plan attendance patterns to reach target percentages",
      color: 'green' as const
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Safe Buffer Slider",
      description: "Set personal attendance targets and see how many more classes you need",
      color: 'pink' as const
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Life Event Planner",
      description: "Plan for trips, illness, or events. See impact on attendance and recovery plans",
      color: 'orange' as const
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Group Bunk Planner",
      description: "Planning to bunk with friends? Check if everyone can safely miss classes together",
      color: 'purple' as const
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "CIE Panic Button",
      description: "Emergency calculations for when exams approach and you need to know your options",
      color: 'yellow' as const
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Weekly Reports",
      description: "Get humorous weekly roasts about your attendance habits with actionable insights",
      color: 'blue' as const
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Quick Stats",
      description: "Instant overview of your current performance with some witty commentary",
      color: 'green' as const
    }
  ];

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <StickyNote color="yellow" size="lg" className="mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">📚 Grade-A Bunker Features</h2>
            <p className="text-sm">Your ultimate attendance management toolkit</p>
          </div>
        </StickyNote>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {features.map((feature, index) => (
          <StickyNote key={index} color={feature.color} size="md">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 mb-3">
                {feature.icon}
                <h3 className="font-bold text-sm">{feature.title}</h3>
              </div>
              <p className="text-xs leading-relaxed flex-1">{feature.description}</p>
            </div>
          </StickyNote>
        ))}
      </div>

      <div className="text-center">
        <StickyNote color="pink" size="md" className="mx-auto">
          <div className="text-center">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-bold mb-2">Why Choose Grade-A Bunker?</h3>
            <ul className="text-xs space-y-1 text-left">
              <li>✓ Smart attendance calculations</li>
              <li>✓ Risk-free bunk planning</li>
              <li>✓ Group coordination tools</li>
              <li>✓ Emergency recovery plans</li>
              <li>✓ Fun & engaging interface</li>
            </ul>
          </div>
        </StickyNote>
      </div>
    </div>
  );
}