
import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { addDays, differenceInYears, format } from 'date-fns';

interface CircleProps {
  filled?: boolean;
  percentage?: number;
  size?: number;
  delay?: number;
  className?: string;
  weekNumber?: number;
  row?: number;
  weekIndex?: number;
}

const Circle: React.FC<CircleProps> = ({ 
  filled = false, 
  percentage = 0, 
  size = 5, // Default to smaller size
  delay = 0,
  className,
  weekNumber = 0,
  row = 0,
  weekIndex = 0
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

  const getDateRange = () => {
    const birthdate = new Date(1980, 5, 1); 
    
    const yearsToAdd = Math.floor(weekNumber / 52);
    const weeksToAdd = weekNumber % 52;

    let newYear = birthdate.getFullYear() + yearsToAdd;
    let weekStart = new Date(newYear, birthdate.getMonth(), birthdate.getDate()); // Start at birthday that year
    weekStart = addDays(weekStart, weeksToAdd * 7);  // Then add the remaining weeks.

    const weekEnd = addDays(weekStart, 6);
    const ageAtThisWeek = differenceInYears(weekStart, birthdate);
    const weekOfLife = weekNumber % 52;
    
  
    return {
      start: format(weekStart, 'MMM d, yyyy'),
      end: format(weekEnd, 'MMM d, yyyy'),
      age: `Age ${ageAtThisWeek} years, week ${weekOfLife} of life`
    };
  };

  const dateRange = getDateRange();
  const tooltipContent = (
    <>
      <div className="font-medium">{dateRange.age}</div>
      <div className="text-xs text-muted-foreground">{dateRange.start} - {dateRange.end}</div>
    </>
  );

  const renderCircle = () => {
    if (filled) {
      return (
        <div 
          className={cn(
            "bg-calendar-filled rounded-full animate-fade-in cursor-pointer",
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
          className={cn("animate-fade-in cursor-pointer", className)}
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
          "bg-calendar-empty rounded-full animate-fade-in cursor-pointer",
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

  return (
    <Tooltip delayDuration={50}>
      <TooltipTrigger asChild>
        <div className="inline-block cursor-pointer">
          {renderCircle()}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" align="center" className="z-50 text-xs">
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
};

export default Circle;
