
import React from 'react';
import Circle from './Circle';

interface WeekRowProps {
  weekIndex: number;
  completedWeeks: number;
  totalYears: number;
  currentWeek: number | null;
  currentWeekPercentage: number;
  circleSize?: number;
}

const WeekRow: React.FC<WeekRowProps> = ({ 
  weekIndex, 
  completedWeeks, 
  totalYears, 
  currentWeek, 
  currentWeekPercentage,
  circleSize = 5
}) => {
  // Calculate base delay for the animation
  const baseDelay = weekIndex * 5;
  
  // Add extra margin after each decade (every 10 columns)
  const rowClassName = `flex flex-row space-x-[1px] mb-[2px]`;

  return (
    <div className={rowClassName}>
      {Array.from({ length: totalYears }, (_, yearIndex) => {
        const weekNumber = yearIndex * 52 + weekIndex;
        const isFilled = weekNumber < completedWeeks;
        const isCurrentWeek = currentWeek !== null && yearIndex === currentWeek;
        const animationDelay = baseDelay + yearIndex * 3; // Staggered delay for each circle
        
        // Add extra right margin after each decade (every 10 columns)
        const isEndOfDecade = (yearIndex + 1) % 10 === 0 && yearIndex < totalYears - 1;
        const circleClassName = isEndOfDecade ? 'mr-2' : '';

        return (
          <Circle 
            key={yearIndex}
            filled={isFilled}
            percentage={isCurrentWeek ? currentWeekPercentage : 0}
            size={circleSize}
            delay={animationDelay}
            weekNumber={weekNumber}
            yearIndex={yearIndex}
            weekIndex={weekIndex}
            className={circleClassName}
          />
        );
      })}
    </div>
  );
};

export default WeekRow;
