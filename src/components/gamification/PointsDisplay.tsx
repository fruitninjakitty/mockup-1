
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface PointsDisplayProps {
  points: number;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PointsDisplay({ points, animated = false, size = 'md', className }: PointsDisplayProps) {
  const [displayPoints, setDisplayPoints] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (animated && points > displayPoints) {
      setIsAnimating(true);
      const diff = points - displayPoints;
      const increment = Math.max(1, Math.floor(diff / 20));
      
      const timer = setInterval(() => {
        setDisplayPoints(prev => {
          const next = prev + increment;
          if (next >= points) {
            clearInterval(timer);
            setIsAnimating(false);
            return points;
          }
          return next;
        });
      }, 50);

      return () => clearInterval(timer);
    } else {
      setDisplayPoints(points);
    }
  }, [points, animated]);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const starSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`flex items-center gap-1 ${sizeClasses[size]} ${className}`}>
      <Star className={`${starSizes[size]} text-yellow-500 ${isAnimating ? 'animate-pulse' : ''}`} fill="currentColor" />
      <span className={`font-semibold text-yellow-600 ${isAnimating ? 'animate-pulse' : ''}`}>
        {displayPoints.toLocaleString()}
      </span>
    </div>
  );
}
