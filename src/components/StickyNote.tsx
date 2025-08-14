import React from 'react';
import { cn } from '@/lib/utils';

interface StickyNoteProps {
  children: React.ReactNode;
  color?: 'yellow' | 'blue' | 'green' | 'pink' | 'orange' | 'purple' | 'periwinkle';
  rotate?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const colorVariants = {
  yellow: 'bg-yellow-200 border-yellow-300 text-yellow-900 shadow-yellow-200/50',
  blue: 'bg-blue-200 border-blue-300 text-blue-900 shadow-blue-200/50',
  green: 'bg-green-200 border-green-300 text-green-900 shadow-green-200/50',
  pink: 'bg-pink-200 border-pink-300 text-pink-900 shadow-pink-200/50',
  orange: 'bg-orange-200 border-orange-300 text-orange-900 shadow-orange-200/50',
  purple: 'bg-purple-200 border-purple-300 text-purple-900 shadow-purple-200/50',
  periwinkle: 'bg-[#CCCCFF] border-[#B8B8FF] text-[#4A4A8A] shadow-[#CCCCFF]/50',
};

const sizeVariants = {
  sm: 'p-3 text-sm min-h-[120px] w-full max-w-[200px]',
  md: 'p-4 text-base min-h-[150px] w-full max-w-[250px]',
  lg: 'p-6 text-lg min-h-[200px] w-full max-w-[300px]',
  xl: 'p-8 text-lg min-h-[250px] w-full max-w-[600px]',
  full: 'p-8 text-lg min-h-[300px] w-full max-w-[95vw]',
};

const rotateVariants = [
  'rotate-1',
  '-rotate-1',
  'rotate-2',
  '-rotate-2',
  'rotate-0',
];

export function StickyNote({ 
  children, 
  color = 'yellow', 
  rotate = true, 
  className,
  size = 'md'
}: StickyNoteProps) {
  const randomRotate = rotate ? rotateVariants[Math.floor(Math.random() * rotateVariants.length)] : '';
  
  return (
    <div
      className={cn(
        'relative border-2 rounded-sm shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl',
        'before:content-[""] before:absolute before:top-0 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-1/2',
        'before:w-4 before:h-4 before:bg-red-500 before:rounded-full before:shadow-md',
        colorVariants[color],
        sizeVariants[size],
        randomRotate,
        className
      )}
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {children}
    </div>
  );
}