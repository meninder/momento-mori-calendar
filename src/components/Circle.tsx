import React, { useEffect, useRef, useState } from 'react';
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
  const [isHovered, setIsHovered] = useState(false);
  const radius = size / 2 - 0.5; // Smaller stroke width adjustment for smaller circles
  const circumference = 2 * Math.PI * radius;
  
  // Calculate the hover size - significantly larger for more noticeable effect
  const hoverSize = size * 3; // Tripled the size for more impact
  const hoverRadius = hoverSize / 2 - 0.5;
  
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
    
    // Calculate the number of full years passed since birth
    const yearsSinceBirth = Math.floor(weekNumber / 52);

    //Calculate the date of the anniversary of the birth date for that year.
    const anniversaryDate = new Date(birthdate.getFullYear() + yearsSinceBirth, birthdate.getMonth(), birthdate.getDate());

    // Calculate the remaining weeks to add *after* the anniversary each year
    const weeksSinceAnniversary = weekNumber % 52;

    // Calculate the start date.  Starting point is the Anniversary
    let weekStart = new Date(anniversaryDate);
    weekStart = addDays(weekStart, weeksSinceAnniversary * 7); // Add the remaining weeks from Anniversary
    const weekEnd = addDays(weekStart, 6);

    // Calculate age at the *start* of the week.
    const ageAtThisWeek = differenceInYears(weekStart, birthdate);

    const weekOfLife = weeksSinceAnniversary + 1; // Weeks are typically 1-indexed for human readability
  
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
    // Apply size based on hover state
    const currentSize = isHovered ? hoverSize : size;
    const currentRadius = isHovered ? hoverRadius : radius;

    if (filled) {
      return (
        <div 
          className={cn(
            "bg-calendar-filled rounded-full animate-fade-in cursor-pointer transition-all duration-300 hover:z-10",
            className
          )}
          style={{ 
            width: `${currentSize}px`, 
            height: `${currentSize}px`,
            animationDelay: `${delay}ms`,
            transform: isHovered ? "scale(1.8)" : "scale(1)",
            boxShadow: isHovered ? "0 0 8px rgba(0,0,0,0.4)" : "none",
            backgroundColor: isHovered ? "#9b87f5" : "#1E293B", // Purple color on hover
            position: "relative",
            transition: "all 0.2s ease-out"
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      );
    }
    
    if (percentage > 0) {
      return (
        <svg 
          width={currentSize} 
          height={currentSize} 
          viewBox={`0 0 ${currentSize} ${currentSize}`} 
          className={cn("animate-fade-in cursor-pointer transition-all duration-300 hover:z-10", className)}
          style={{ 
            animationDelay: `${delay}ms`,
            transform: isHovered ? "scale(1.8)" : "scale(1)",
            filter: isHovered ? "drop-shadow(0 0 4px rgba(0,0,0,0.4))" : "none",
            position: "relative",
            transition: "all 0.2s ease-out"
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <circle
            cx={currentSize / 2}
            cy={currentSize / 2}
            r={currentRadius}
            fill="transparent"
            stroke="#E5E7EB"
            strokeWidth="0.5" // Thinner stroke for smaller circles
          />
          <circle
            ref={circleRef}
            cx={currentSize / 2}
            cy={currentSize / 2}
            r={currentRadius}
            fill="transparent"
            stroke={isHovered ? "#9b87f5" : "#64748B"} // Purple on hover, gray otherwise
            strokeWidth={isHovered ? "1" : "0.5"} // Thicker stroke when hovered
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
          "bg-calendar-empty rounded-full animate-fade-in cursor-pointer transition-all duration-300 hover:z-10",
          className
        )}
        style={{ 
          width: `${currentSize}px`, 
          height: `${currentSize}px`,
          animationDelay: `${delay}ms`,
          transform: isHovered ? "scale(1.8)" : "scale(1)",
          boxShadow: isHovered ? "0 0 8px rgba(0,0,0,0.4)" : "none",
          backgroundColor: isHovered ? "#D6BCFA" : "#E5E7EB", // Light purple on hover, gray otherwise
          position: "relative",
          transition: "all 0.2s ease-out"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
    );
  };

  return (
    <Tooltip delayDuration={50}>
      <TooltipTrigger asChild>
        <div className="inline-block cursor-pointer relative">
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
