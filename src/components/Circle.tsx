
import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface CircleProps {
  filled?: boolean;
  percentage?: number;
  size?: number;
  delay?: number;
  className?: string;
}

const Circle: React.FC<CircleProps> = ({ 
  filled = false, 
  percentage = 0, 
  size = 5, // Default to smaller size
  delay = 0,
  className 
}) => {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = size / 2 - 0.5; // Smaller stroke width adjustment for smaller circles
  const circumference = 2 * Math.PI * radius;
  
  useEffect(() => {
    if (circleRef.current && percentage > 0 && percentage < 100) {
      const strokeDashoffset = circumference - (percentage / 100) * circumference;
      
      // Set the initial position
      circleRef.current.style.setProperty('--circumference', `${circumference}px`);
      circleRef.current.style.strokeDasharray = `${circumference} ${circumference}`;
      circleRef.current.style.strokeDashoffset = `${circumference}px`;
      
      // Add a small delay before animation to create a staggered effect
      setTimeout(() => {
        circleRef.current!.style.strokeDashoffset = `${strokeDashoffset}px`;
        circleRef.current!.style.animation = 'fill-circle 0.6s ease-out forwards';
      }, delay);
    }
  }, [percentage, circumference, delay]);

  if (filled) {
    return (
      <div 
        className={cn(
          "bg-calendar-filled rounded-full animate-fade-in",
          className
        )}
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          animationDelay: `${delay}ms`
        }}
      />
    );
  }
  
  if (percentage > 0) {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`} 
        className={cn("animate-fade-in", className)}
        style={{ animationDelay: `${delay}ms` }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#E5E7EB"
          strokeWidth="0.5" // Thinner stroke for smaller circles
        />
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#64748B"
          strokeWidth="0.5" // Thinner stroke for smaller circles
          strokeLinecap="round"
          style={{
            transformOrigin: 'center',
            transform: 'rotate(-90deg)',
          }}
        />
      </svg>
    );
  }

  return (
    <div 
      className={cn(
        "bg-calendar-empty rounded-full animate-fade-in",
        className
      )}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        animationDelay: `${delay}ms`
      }}
    />
  );
};

export default Circle;
