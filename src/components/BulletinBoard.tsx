import React from 'react';
import { cn } from '@/lib/utils';

interface BulletinBoardProps {
  children: React.ReactNode;
  className?: string;
}

export function BulletinBoard({ children, className }: BulletinBoardProps) {
  return (
    <div
      className={cn(
        'relative min-h-screen p-8',
        'bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100',
        'before:absolute before:inset-0 before:opacity-10',
        'before:bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cg fill-opacity=\'0.03\'%3E%3Cpolygon fill=\'%23000\' points=\'50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40\'/%3E%3C/g%3E%3C/svg%3E")]',
        className
      )}
    >
      {/* Wood texture overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23654321' fill-opacity='0.1'%3E%3Cpath d='M0 0h80v80H0V0zm20 20v40h40V20H20zm20 35a15 15 0 1 1 0-30 15 15 0 0 1 0 30z' opacity='0.5'/%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Cork board pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #8B4513 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, #8B4513 1px, transparent 1px),
            radial-gradient(circle at 25% 75%, #8B4513 1px, transparent 1px),
            radial-gradient(circle at 75% 25%, #8B4513 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 0 0, 0 0, 0 0'
        }} />
      </div>

      {/* Push pins scattered around */}
      <div className="absolute top-20 left-20 w-3 h-3 bg-red-500 rounded-full shadow-md"></div>
      <div className="absolute top-32 right-40 w-3 h-3 bg-blue-500 rounded-full shadow-md"></div>
      <div className="absolute top-40 left-1/3 w-3 h-3 bg-green-500 rounded-full shadow-md"></div>
      <div className="absolute bottom-40 right-20 w-3 h-3 bg-yellow-500 rounded-full shadow-md"></div>
      <div className="absolute bottom-60 left-40 w-3 h-3 bg-purple-500 rounded-full shadow-md"></div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}