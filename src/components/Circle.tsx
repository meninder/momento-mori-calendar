
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

// DEBUGGING: Create a separate testing function
const testDateRange = (weekNum: number) => {
  const birthdate = new Date(1980, 6, 1);
  const weeksSinceBirth = weekNum - 1;
  const targetDate = addDays(birthdate, weeksSinceBirth * 7);
  let ageAtThisWeek = differenceInYears(targetDate, birthdate);
  const weekStart = addDays(birthdate, weeksSinceBirth * 7);
  const weekEnd = addDays(weekStart, 6);
  const weekOfYear = (weekNum - 1) % 52 + 1;

  return {
      start: format(weekStart, 'MMM d, yyyy'),
      end: format(weekEnd, 'MMM d, yyyy'),
      age: `Age ${ageAtThisWeek} years, ${weekOfYear} weeks of life`
  };
};

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
    const birthdate = new Date(1980, 6, 1); // June 1, 1980 (Month is 0-indexed)
  
    // Use differenceInWeeks to calculate age, accounting for partial years
    const weeksSinceBirth = weekNumber - 1; // Adjust week number to be 0-indexed
    const targetDate = addDays(birthdate, weeksSinceBirth * 7); // Calculate the date for the *start* of the week
  
    // Calculate age at this target date
    let ageAtThisWeek = differenceInYears(targetDate, birthdate);
  
    // Calculate the dates for this specific week
    const weekStart = addDays(birthdate, weeksSinceBirth * 7); // Recalculate Week start based on weeksSinceBirth
    const weekEnd = addDays(weekStart, 6);
  
    // Calculate the week number of life (add 1 to make it human-readable, starting from 1)
    const weekOfYear = (weekNumber - 1) % 52 + 1;
  
  
    return {
      start: format(weekStart, 'MMM d, yyyy'),
      end: format(weekEnd, 'MMM d, yyyy'),
      age: `Age ${ageAtThisWeek} years, ${weekOfYear} weeks of life`
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

// For debugging purposes, we can log test results using a normal function call
// console.log("Week 100:", testDateRange(100));
// console.log("Week 521:", testDateRange(521));
// console.log("Week 522:", testDateRange(522));
// console.log("Week 572:", testDateRange(572));
// console.log("Week 1040:", testDateRange(1040));
